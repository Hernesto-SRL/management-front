import {Box, Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {useSelector} from "react-redux";
import {AppState} from "../../reduxStore";
import Header from "../../components/Header";
import React, {useState} from "react";
import useCategories, {Category} from "../../hooks/useCategories";
import {Formik, FormikHelpers} from "formik";
import {inputStylign} from "../../utils";
import {ShelfLife, shelfLifeValues} from "../../types";
import * as yup from "yup";
import ErrorMessage from "./ErrorMessage";
import QrBarcodeScanner from "../../components/QrBarcodeScanner";
import Axios from "axios";
import {NotificationSender} from "../../Notifications";

enum RenderState {
    Scanner,
    Error,
    Form
}

interface FormProps {
    categories: Category[] | undefined;
    onSuccess: () => void;
    barcode?: string;
}

interface FormData {
    name: string;
    description: string;
    barcode: string;
    categoryId: number;
    shelfLifeId: number;
    supplier: string;
    minStockRequired: number;
}

const NewProductForm = ({ categories, onSuccess, barcode = "" }: FormProps) => {
    if (!categories)
        return null;

    const handleFormSubmit = (data: FormData, { setErrors }: FormikHelpers<FormData>) => {
        const payload = {
            name: data.name,
            description: data.description,
            categoryId: data.categoryId,
            shelfLife: data.shelfLifeId,
            barcode: data.barcode.toString(),
            // TODO supplier: data.supplier,
            minStockRequired: data.minStockRequired
        };

        Axios.post("/api/Product", payload)
            .then(res => {
                if (res.status === 200)
                {
                    NotificationSender.info("Nuevo producto registrado con exito.");
                    onSuccess();
                    return;
                }

                console.warn(`Unknown response status from /Product ${res.status}`);
            })
            .catch (err => {
                if (err.response && err.response.status === 409)
                {
                    NotificationSender.warning("Ya existe un producto con este codigo de barras.");
                    setErrors({barcode: "Ya existe un producto con este codigo de barras."});
                    return;
                }

                NotificationSender.error("Ha ocurrido un error registrando el nuevo producto.");
            });
    };

    const schema = yup.object().shape({
        name: yup.string()
            .max(50, "El campo no puede contener mas de 50 caracteres")
            .required("Campo Obligatorio"),

        description: yup.string()
            .max(250, "El campo no puede contener mas de 250 caracteres"),

        barcode: yup.string()
            .max(128, "El campo no puede contener mas de 128 caracteres")
            .required("Campo Obligatorio"),

        supplier: yup.string()
            .max(50, "El campo no puede contener mas de 50 caracteres"),

        minStockRequired: yup.number()
            .min(1, "Debe ingresar un numero mayor a 1")
            .max(1000000, "La cantidad no puede ser mayor a 1.000.000")
            .required("Campo Obligatorio")
    });

    const initialValues: FormData = {
        name: "",
        description: "",
        categoryId: categories[0].id,
        barcode: barcode,
        shelfLifeId: shelfLifeValues[0].id,
        supplier: "",
        minStockRequired: 1
    };

    return (
        <Box width="100%" maxWidth="800px">
            <Formik
                initialValues={initialValues}
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
                                variant="filled"
                                type="text"
                                label="Nombre"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.name}
                                name="name"
                                error={!!touched.name && !!errors.name}
                                helperText={touched.name && errors.name}
                                sx={inputStylign}
                            />
                            <TextField
                                variant="filled"
                                type="text"
                                label="Descripción"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.description}
                                name="description"
                                error={!!touched.description && !!errors.description}
                                helperText={touched.description && errors.description}
                                sx={inputStylign}
                                multiline
                                rows={5}
                            />
                            <TextField
                                variant="filled"
                                type="number"
                                label="Codigo de Barras"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.barcode}
                                name="barcode"
                                error={!!touched.barcode && !!errors.barcode}
                                helperText={touched.barcode && errors.barcode}
                                sx={inputStylign}
                            />
                            <FormControl variant="filled">
                                <InputLabel>Categoria</InputLabel>
                                <Select
                                    value={values.categoryId}
                                    name="categoryId"
                                    onChange={handleChange}
                                    sx={inputStylign}
                                >
                                    {categories?.map((category: Category, idx) => (
                                        <MenuItem
                                            key={idx}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl variant="filled">
                                <InputLabel>Vida Util</InputLabel>
                                <Select
                                    value={values.shelfLifeId}
                                    name="shelfLifeId"
                                    onChange={handleChange}
                                    sx={inputStylign}
                                >
                                    {shelfLifeValues.map((shelfLife: ShelfLife, idx) => (
                                        <MenuItem
                                            key={idx}
                                            value={shelfLife.id}
                                        >
                                            {shelfLife.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                variant="filled"
                                type="text"
                                label="Proveedor"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.supplier}
                                name="supplier"
                                error={!!touched.supplier && !!errors.supplier}
                                helperText={touched.supplier && errors.supplier}
                                sx={inputStylign}
                            />
                            <TextField
                                variant="filled"
                                type="number"
                                label="Stock Minimo Requerido"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.minStockRequired}
                                name="minStockRequired"
                                error={!!touched.minStockRequired && !!errors.minStockRequired}
                                helperText={touched.minStockRequired && errors.minStockRequired}
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
}

const NewProduct = () => {
    const { categories, isLoading, isError } = useCategories();

    const receivedBarcode = useSelector((state: AppState) => state.control.barcode);

    const [renderState, setRenderState] = useState(receivedBarcode ? RenderState.Form : RenderState.Scanner);
    const [errorMessage, setErrorMessage] = useState("");
    const [scannedBarcode, setScannedBarcode] = useState(receivedBarcode || "");

    if (isError || (!isLoading && !categories)) {
        setErrorMessage("Hubo un error cargando la informacion necesaria");
        setRenderState(RenderState.Error);
    }

    const onQrScanned = (qr: string) => {
        // TODO
    };

    const onBarcodeScanned = (barcode: string) => {
        setScannedBarcode(barcode);
        setRenderState(RenderState.Form);
    };

    const renderSwitch = () => {
        switch (renderState)
        {
            case RenderState.Scanner:
                return <QrBarcodeScanner
                    onQrFound={onQrScanned}
                    onBarcodeFound={onBarcodeScanned}
                    onManualInputClick={() => setRenderState(RenderState.Form)}
                />;
            case RenderState.Error:
                return <ErrorMessage
                    error={errorMessage}
                    onGoBackClick={() => setRenderState(RenderState.Scanner)}
                />;
            case RenderState.Form:
                return <NewProductForm
                    categories={categories}
                    barcode={scannedBarcode}
                    onSuccess={() => setRenderState(RenderState.Scanner)}
                />;
        }
    };

    return (
        <Box width="100%">
            <Box m="20px">
                <Header title="NUEVO PRODUCTO" subtitle="Registrar Nuevo Producto"/>
                <Box display="flex" justifyContent="center">
                    {renderSwitch()}
                </Box>
            </Box>
        </Box>
    );
};

export default NewProduct;