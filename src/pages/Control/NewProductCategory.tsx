import {Box, Button, TextField} from "@mui/material";
import Header from "../../components/Header";
import React from "react";
import {Formik, FormikHelpers} from "formik";
import {inputStylign} from "../../utils";
import * as yup from "yup";
import Axios from "axios";
import {NotificationSender} from "../../Notifications";
import useCategories from "../../hooks/useCategories";

interface FormData {
    name: string;
}

const NewProductCategory = () => {
    const { refetch } = useCategories();

    const handleFormSubmit = (data: FormData, { resetForm, setErrors }: FormikHelpers<FormData>) => {
        Axios.post("/api/Product/Categories", {
            name: data.name
        })
        .then(async res => {
            if (res.status === 200)
            {
                NotificationSender.info("Nuevo categoria registrada con exito.");
                resetForm();
                await refetch();
                return;
            }

            console.warn(`Unknown response status from /Product/Categories ${res.status}`);
        })
        .catch(err => {
            if (!err.response)
            {
                NotificationSender.error("Ha ocurrido un error registrando la categoria.");
                return;
            }

            switch (err.response.status)
            {
                case 400:
                    setErrors({ name: "El nombre no puede tener más de 25 caracteres." });
                    break;
                case 409:
                    setErrors({ name: "Ya existe una categoria con ese nombre." });
                    break;
            }
        });
    };

    const schema = yup.object().shape({
        name: yup.string()
            .max(25, "El campo no puede contener mas de 25 caracteres")
            .required("Campo Obligatorio")
    });

    return (
        <Box width="100%">
            <Box m="20px">
                <Header title="NUEVA CATEGORIA" subtitle="Registrar Nueva Categoria de Producto"/>
                <Box display="flex" justifyContent="center">
                    <Box width="100%" maxWidth="800px">
                        <Formik
                            initialValues={{name: ""}}
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

export default NewProductCategory;