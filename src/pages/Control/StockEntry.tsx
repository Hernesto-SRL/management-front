import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField, Typography, useTheme
} from "@mui/material";
import Header from "../../components/Header";
import React, {useState} from "react";
import {Formik} from "formik";
import {inputStylign} from "../../utils";
import {tokens} from "../../theme";
import useWarehouses, {Warehouse} from "../../hooks/useWarehouses";
import QrBarcodeScanner from "../../components/QrBarcodeScanner";
import LoadingSpinner from "../../components/LoadingSpinner";
import ManualBarcode from "./ManualBarcode";
import useIsMobile from "../../hooks/useIsMobile";
import Axios from "axios";
import {Batch, ProductBatches} from "../../types";
import ErrorMessage from "./ErrorMessage";
import {NotificationSender} from "../../Notifications";
import useToggle from "../../hooks/useToggle";
import * as yup from "yup";
import YesNoPrompt from "./YesNoPrompt";
import {useDispatch, useSelector} from "react-redux";
import {AppState, controlActions} from "../../reduxStore";
import {useNavigate} from "react-router-dom";

enum BatchOption {
    NewBatch,
    ExistingBatch
}

enum RenderState {
    Scanner,
    ManualInput,
    Loading,
    NewProductPrompt,
    Error,
    Form
}

interface FormProps {
    warehouses: Warehouse[] | undefined;
    productBatches: ProductBatches | undefined;
    onSuccess: () => void;
}

interface FormData {
    warehouseId: number;
    batchId: number;
    amount: number;
}

const StockEntryForm = ({ warehouses, productBatches, onSuccess }: FormProps) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useIsMobile();
    const [usingNewBatch, toggleUsingNewBatch] = useToggle(true);

    if (!warehouses || !productBatches)
        return null; // Neither should ever be undefined, they're both checked before rendering this component

    const productHasBatches = productBatches.batches.length > 0;

    const schema = yup.object().shape({
        amount: yup.number()
            .min(1, "Debe ingresar un numero mayor a 1")
            .max(1000000, "La cantidad no puede ser mayor a 1.000.000")
            .required("Campo Obligatorio")
    });

    const handleFormSubmit = (data: FormData) => {
        const payload: any = {
            productId: productBatches.id,
            amount: data.amount,
            isEntry: true
        };

        // Send batch id if using existing batch
        // Send warehouse id if creating a new batch
        if (usingNewBatch)
            payload.batchId = data.batchId;
        else
            payload.warehouseId = data.warehouseId;

        Axios.put("/api/Stock", payload)
            .then(res => {
                if(res.status === 200 || res.status === 201)
                {
                    NotificationSender.info("Ingreso de stock registrado exitosamente");
                    onSuccess();
                    return;
                }
                console.warn(`Unknown response status from /Stock ${res.status}`);
            })
            .catch(err => {
                console.error(err);
                NotificationSender.error("Hubo un error tratando de actualizar el stock");
            });
    };

    const formatWarehouseSelectString = (warehouse: Warehouse): string => {
        return `${warehouse.name} - ${warehouse.address}`;
    };

    const formatBatchSelectString = (batch: Batch): string => {
        const warehouse = warehouses.find(w => w.id === batch.warehouseId);
        return `${batch.entryDate} - ${warehouse?.address} - (${batch.currentStock})`;
    };

    const initialFormValues: FormData = {
        warehouseId: warehouses[0].id,
        batchId: productHasBatches ? productBatches.batches[0].id : 0,
        amount: 1
    };

    return (
        <Box width="100%" maxWidth="800px">
            <Formik
                initialValues={initialFormValues}
                onSubmit={handleFormSubmit}
                validationSchema={schema}
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            gap="30px"
                            width="100%"
                        >
                            <TextField
                                inputProps={{
                                    readOnly: true,
                                    disabled: true
                                }}
                                variant="filled"
                                type="text"
                                label="Nombre"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={productBatches?.name}
                                name="name"
                                sx={inputStylign}
                            />
                            <TextField
                                inputProps={{
                                    readOnly: true,
                                    disabled: true
                                }}
                                variant="filled"
                                type="text"
                                label="Codigo de Barras"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={productBatches?.barcode}
                                name="barcode"
                                sx={inputStylign}
                            />
                            <Box display={isMobile ? "block" : "flex"}>
                                <FormControl sx={{
                                    width: isMobile ? "100%" : "40%",
                                    paddingBottom: "30px",
                                }}>
                                    <FormLabel
                                        id="batch-type-label"
                                        sx={{
                                            "&.Mui-focused": { color: colors.grey[200] }
                                        }}
                                    >
                                        Lote
                                    </FormLabel>
                                    <RadioGroup
                                        aria-labelledby="batch-type-label"
                                        defaultValue={BatchOption.NewBatch}
                                        onChange={toggleUsingNewBatch}
                                    >
                                        <FormControlLabel
                                            value={BatchOption.NewBatch}
                                            control={<Radio color="secondary"/>}
                                            label="Crear Nuevo Lote Automaticamente"
                                        />
                                        {productHasBatches &&
                                        <FormControlLabel
                                            value={BatchOption.ExistingBatch}
                                            control={<Radio color="secondary"/>}
                                            label="Usar Lote Existente"
                                        />}
                                    </RadioGroup>
                                </FormControl>
                                <FormControl variant="filled" sx={{
                                    width: isMobile ? "100%" : "60%"
                                }}>
                                    { usingNewBatch ?
                                        <>
                                            <InputLabel>Deposito</InputLabel>
                                            <Select
                                                value={values.warehouseId}
                                                name="warehouseId"
                                                onChange={handleChange}
                                                sx={inputStylign}
                                            >
                                                {warehouses?.map((warehouse, idx) => (
                                                    <MenuItem
                                                        key={idx}
                                                        value={warehouse.id}
                                                    >
                                                        {formatWarehouseSelectString(warehouse)}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </>
                                        : <>
                                            <InputLabel>Lote</InputLabel>
                                            <Select
                                                value={values.batchId}
                                                name="batchId"
                                                onChange={handleChange}
                                                sx={inputStylign}
                                            >
                                                {productBatches?.batches?.map((batch: Batch, idx) => (
                                                    <MenuItem
                                                        key={idx}
                                                        value={batch.id}
                                                    >
                                                        {formatBatchSelectString(batch)}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </>}
                                </FormControl>
                            </Box>
                            <TextField
                                variant="filled"
                                type="number"
                                label="Cantidad"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.amount}
                                name="amount"
                                error={!!touched.amount && !!errors.amount}
                                helperText={touched.amount && errors.amount}
                                sx={{...inputStylign, gridColumn: "span 4"}}
                            />
                        </Box>
                        <Box display="flex" justifyContent="center" mt="20px">
                            <Button
                                type="submit"
                                color="secondary"
                                variant="contained"
                                size="medium"
                                sx={{ width: "60%", fontSize: "1.2rem" }}
                            >
                                REGISTRAR
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

const StockEntry = () => {
    const { warehouses, isLoading, isError } = useWarehouses();

    const [renderState, setRenderState] = useState(RenderState.Scanner);
    const [errorMessage, setErrorMessage] = useState("");
    const [productBatches, setProductBatches] = useState<ProductBatches>();

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const barcode = useSelector((state: AppState) => state.control.barcode);

    if (isError || (!isLoading && !warehouses)) {
        setErrorMessage("Hubo un error cargando la informacion necesaria");
        setRenderState(RenderState.Error);
    }

    const onQrScanned = (qr: string) => {
        // TODO
    };

    const onBarcodeScanned = (barcode: string) => {
        setRenderState(RenderState.Loading);
        dispatch(controlActions.setBarcode(barcode));

        Axios.get(`/api/Batch?barcode=${barcode}`)
            .then(res => {
                switch (res.status)
                {
                    case 200:
                        setProductBatches(res.data as ProductBatches);
                        setRenderState(RenderState.Form);
                        return;
                    case 204:
                        setRenderState(RenderState.NewProductPrompt);
                        return;
                }

                NotificationSender.warn(`Unknown /Batch?barcode=${barcode} response status: ${res.status}`);
                setRenderState(RenderState.Scanner);
            })
            .catch(err => {
                setErrorMessage("Hubo un error cargando el producto");
                setRenderState(RenderState.Error);
                console.error(err);
            });
    };

    const renderSwitch = () => {
        switch (renderState)
        {
            case RenderState.Scanner:
                return <QrBarcodeScanner
                    onQrFound={onQrScanned}
                    onBarcodeFound={onBarcodeScanned}
                    onManualInputClick={() => setRenderState(RenderState.ManualInput)}
                />;
            case RenderState.ManualInput:
                return <ManualBarcode onBarcodeEntered={onBarcodeScanned}/>;
            case RenderState.Loading:
                return <LoadingSpinner/>;
            case RenderState.NewProductPrompt:
                return <YesNoPrompt
                    message={`No se ha encontrado un producto con codigo de barras ${barcode}`}
                    question="¿Desea registrar un nuevo producto?"
                    onYesClick={() => navigate("/control/newProduct")}
                    onNoClick={() => setRenderState(RenderState.Scanner)}
                />;
            case RenderState.Error:
                return <ErrorMessage
                    error={errorMessage}
                    onGoBackClick={() => setRenderState(RenderState.Scanner)}
                />;
            case RenderState.Form:
                return <StockEntryForm
                    warehouses={warehouses}
                    productBatches={productBatches}
                    onSuccess={() => setRenderState(RenderState.Scanner)}
                />;
        }
    };

    return (
        <Box width="100%">
            <Box m="20px">
                <Header title="INGRESO" subtitle="Registrar Nuevo Ingreso De Stock"/>
                <Box display="flex" justifyContent="center">
                    {renderSwitch()}
                </Box>
            </Box>
        </Box>
    );
};

export default StockEntry;