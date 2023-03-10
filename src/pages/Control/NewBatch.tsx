import {Box, Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import Header from "../../components/Header";
import React, {useState} from "react";
import ErrorMessage from "./ErrorMessage";
import YesNoPrompt from "./YesNoPrompt";
import {useDispatch, useSelector} from "react-redux";
import {AppState, controlActions} from "../../reduxStore";
import {useNavigate} from "react-router-dom";
import Axios from "axios";
import {Batch, Product} from "../../types";
import {NotificationSender} from "../../Notifications";
import QrBarcodeScanner from "../../components/QrBarcodeScanner";
import ManualBarcode from "./ManualBarcode";
import LoadingSpinner from "../../components/LoadingSpinner";
import useWarehouses, {Warehouse} from "../../hooks/useWarehouses";
import {Formik} from "formik";
import {inputStylign} from "../../utils";

enum RenderState {
    Scanner,
    ManualInput,
    Loading,
    NewProductPrompt,
    Error,
    Form
}

interface FormProps {
    product: Product | undefined;
    warehouses: Warehouse[] | undefined;
    onSuccess: () => void;
}

interface FormData {
    warehouseId: number;
}

const NewBatchForm = ({ product, warehouses, onSuccess }: FormProps) => {
    if (!product || !warehouses)
        return null; // Neither should ever be undefined, they're both checked before rendering this component

    const handleFormSubmit = (data: FormData) => {
        const payload = {
            productId: product.id,
            warehouseId: data.warehouseId
        };

        Axios.post("/api/Batch", payload)
            .then(res => {
                if (res.status === 200)
                {
                    NotificationSender.info("Nuevo lote registrado con exito.");
                    onSuccess();
                    return;
                }

                console.warn(`Unknown response status from /Batch ${res.status}`);
            }).
            catch(err => {
                NotificationSender.error("Ha ocurrido un error registrando el nuevo lote.");
                console.error(err);
            });
    };

    const formatWarehouseSelectString = (warehouse: Warehouse): string => {
        return `${warehouse.name} - ${warehouse.address}`;
    };

    return (
        <Box width="100%" maxWidth="800px">
            <Formik
                initialValues={{ warehouseId: warehouses[0].id }}
                onSubmit={handleFormSubmit}
            >
                {({ values, handleBlur, handleChange, handleSubmit }) => (
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
                                value={product?.name}
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
                                value={product?.barcode}
                                name="barcode"
                                sx={inputStylign}
                            />
                            <FormControl variant="filled">
                                <InputLabel>Deposito</InputLabel>
                                <Select
                                    value={values.warehouseId}
                                    name="warehouseId"
                                    onChange={handleChange}
                                    sx={inputStylign}
                                >
                                    {warehouses?.map((warehouse: Warehouse, idx) => (
                                        <MenuItem
                                            key={idx}
                                            value={warehouse.id}
                                        >
                                            {formatWarehouseSelectString(warehouse)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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

const NewBatch = () => {
    const { warehouses, isLoading, isError } = useWarehouses();

    const [renderState, setRenderState] = useState(RenderState.Scanner);
    const [errorMessage, setErrorMessage] = useState("");
    const [product, setProduct] = useState<Product | undefined>();

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

        Axios.get(`/api/Product/${barcode}`)
            .then(res => {
                switch (res.status)
                {
                    case 200:
                        setProduct(res.data as Product);
                        setRenderState(RenderState.Form);
                        return;
                    case 204:
                        setRenderState(RenderState.NewProductPrompt);
                        break;
                }

                NotificationSender.warn(`Unknown /Product/${barcode} response status: ${res.status}`);
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
                return <NewBatchForm
                    product={product}
                    warehouses={warehouses}
                    onSuccess={() => setRenderState(RenderState.Scanner)}
                />;
        }
    };

    return (
        <Box width="100%">
            <Box m="20px">
                <Header title="NUEVO LOTE" subtitle="Registrar Nuevo Lote"/>
                <Box display="flex" justifyContent="center">
                    {renderSwitch()}
                </Box>
            </Box>
        </Box>
    );
};

export default NewBatch;