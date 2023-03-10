import {Box, Button, TextField} from "@mui/material";
import Header from "../../components/Header";
import React from "react";
import {Formik, FormikHelpers} from "formik";
import {inputStylign} from "../../utils";
import * as yup from "yup";
import Axios from "axios";
import {NotificationSender} from "../../Notifications";
import useWarehouses from "../../hooks/useWarehouses";

interface FormData {
    name: string;
    address: string;
}

const NewWarehouse = () => {
    const { refetch } = useWarehouses();

    const handleFormSubmit = (data: FormData, { resetForm }: FormikHelpers<FormData>) => {
        Axios.post("/api/Warehouse", {
            name: data.name,
            address: data.address
        })
            .then(async res => {
                if (res.status === 200)
                {
                    NotificationSender.info("Nuevo deposito registrado con exito.");
                    resetForm();
                    await refetch();
                    return;
                }

                console.warn(`Unknown response status from /Warehouse ${res.status}`);
            })
            .catch(err => {
                NotificationSender.error("Ha ocurrido un error registrando la categoria.");
                console.error(err);
            });
    };

    const schema = yup.object().shape({
        name: yup.string()
            .max(25, "El campo no puede contener mas de 25 caracteres")
            .required("Campo Obligatorio"),
        address: yup.string()
            .max(50, "El campo no puede contener mas de 25 caracteres")
            .required("Campo Obligatorio")
    });

    return (
        <Box width="100%">
            <Box m="20px">
                <Header title="NUEVO DEPOSITO" subtitle="Registrar Nuevo Deposito"/>
                <Box display="flex" justifyContent="center">
                    <Box width="100%" maxWidth="800px">
                        <Formik
                            initialValues={{name: "", address: ""}}
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
                                            label="Direccion"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.address}
                                            name="address"
                                            error={!!touched.address && !!errors.address}
                                            helperText={touched.address && errors.address}
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
                </Box>
            </Box>
        </Box>
    );
};

export default NewWarehouse;