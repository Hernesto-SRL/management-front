import {Box, Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import Header from "../../components/Header";
import React, {useState} from "react";
import QrBarcodeScanner from "../../components/QrBarcodeScanner";
import LoadingSpinner from "../../components/LoadingSpinner";
import useWarehouses, {Warehouse} from "../../hooks/useWarehouses";
import ManualBarcode from "./ManualBarcode";
import ErrorMessage from "./ErrorMessage";
import {Formik} from "formik";
import {inputStylign} from "../../utils";
import {Batch, ProductBatches} from "../../types";
import useIsMobile from "../../hooks/useIsMobile";
import {controlActions} from "../../reduxStore";
import Axios from "axios";
import {NotificationSender} from "../../Notifications";
import * as yup from "yup";
import newBatch from "./NewBatch";

enum RenderState {
    Scanner,
    ManualInput,
    Loading,
    Error,
    Form
}

interface FormProps {
    warehouses: Warehouse[] | undefined;
    productBatches: ProductBatches | undefined;
    onSuccess: () => void;
}

interface FormData {
    batchId: number;
    amount: number;
}

const StockExitForm = ({ warehouses, productBatches, onSuccess }: FormProps) => {

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
        const payload = {
            productId: productBatches.id,
            amount: data.amount,
            isEntry: false,
            batchId: data.batchId
        };

        Axios.put("/api/Stock", payload)
            .then(res => {
                if (res.status === 200)
                {
                    NotificationSender.info("Egreso de stock registrado con exito.");
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

    const formatBatchSelectString = (batch: Batch): string => {
        const warehouse = warehouses.find(w => w.id === batch.warehouseId);
        return `${batch.entryDate} - ${warehouse?.address} - (${batch.currentStock})`;
    };

    const initialFormValues: FormData = {
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
                            <FormControl variant="filled">
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
                            </FormControl>
                            <TextField
                                variant="filled"
                                type="number"
                                label="Cantidad a Egresar"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.amount}
                                name="amount"
                                error={!!touched.amount && !!errors.amount}
                                helperText={touched.amount && errors.amount}
                                sx={inputStylign}
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

const StockExit = () => {
    const { warehouses, isLoading, isError } = useWarehouses();

    const [renderState, setRenderState] = useState(RenderState.Scanner);
    const [errorMessage, setErrorMessage] = useState("");
    const [productBatches, setProductBatches] = useState<ProductBatches>();

    if (isError || (!isLoading && !warehouses)) {
        setErrorMessage("Hubo un error cargando la informacion necesaria");
        setRenderState(RenderState.Error);
    }

    const onQrScanned = (qr: string) => {
        // TODO
    };

    const onBarcodeScanned = (barcode: string) => {
        setRenderState(RenderState.Loading);

        Axios.get(`/api/Batch?barcode=${barcode}`)
            .then(res => {
                switch (res.status)
                {
                    case 200:
                        setProductBatches(res.data as ProductBatches);
                        setRenderState(RenderState.Form);
                        return;
                    case 204:
                        NotificationSender.info("No se ha encontrado ningun producto con ese codigo de barras.");
                        setRenderState(RenderState.Scanner);
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
            case RenderState.Error:
                return <ErrorMessage
                    error={errorMessage}
                    onGoBackClick={() => setRenderState(RenderState.Scanner)}
                />;
            case RenderState.Form:
                return <StockExitForm
                    warehouses={warehouses}
                    productBatches={productBatches}
                    onSuccess={() => setRenderState(RenderState.Scanner)}
                />;
        }
    };

    return (
        <Box width="100%">
            <Box m="20px">
                <Header title="SALIDA" subtitle="Registrar Salida De Stock"/>
                <Box display="flex" justifyContent="center">
                    {renderSwitch()}
                </Box>
            </Box>
        </Box>
    );
};

export default StockExit;