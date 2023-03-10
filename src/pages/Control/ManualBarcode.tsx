import React from "react";
import {Box, Button, TextField} from "@mui/material";
import {Formik} from "formik";
import {inputStylign} from "../../utils";
import useIsMobile from "../../hooks/useIsMobile";
import * as yup from "yup";

interface FormData {
    barcode: string;
}

export interface ManualBarcodeProps {
    onBarcodeEntered: (barcode: string) => void;
}

const ManualBarcode = ({ onBarcodeEntered }: ManualBarcodeProps) => {
    const isMobile = useIsMobile();

    const handleFormSubmit = ({ barcode }: FormData) => {
        onBarcodeEntered(barcode);
    };

    const schema = yup.object().shape({
        barcode: yup.string()
            .max(128, "El campo no puede contener mas de 128 caracteres")
            .required("Campo Obligatorio"),
    });

    return (
        <Formik
            initialValues={{barcode: ""}}
            onSubmit={handleFormSubmit}
            validationSchema={schema}
        >
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit} style={{ width: isMobile ? "80%" : "50%" }}>
                    <Box display="grid" gap="30px">
                        <TextField
                            type="number"
                            variant="filled"
                            label="Codigo de Barras"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.barcode}
                            name="barcode"
                            error={!!touched.barcode && !!errors.barcode}
                            helperText={touched.barcode && errors.barcode}
                            sx={inputStylign}
                        />
                        <Box display="flex" justifyContent="center">
                            <Button
                                type="submit"
                                color="secondary"
                                variant="contained"
                                size="large"
                                sx={{ width: "60%", fontSize: "0.9rem" }}
                            >
                                Buscar
                            </Button>
                        </Box>
                    </Box>
                </form>
            )}
        </Formik>
    )
};

export default ManualBarcode;