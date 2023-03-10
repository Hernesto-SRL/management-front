import {Box, Button, TextField} from "@mui/material";
import * as yup from "yup";
import {Formik, FormikHelpers} from "formik";
import Header from "../components/Header";
import useUserInfo from "../hooks/useUserInfo";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import Axios from "axios";
import {NotificationSender} from "../Notifications";
import {inputStylign} from "../utils";
import useIsMobile from "../hooks/useIsMobile";

interface RegisterData {
    name: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// Minimum eight characters, at least one letter, one number and one special character:
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const registerSchema = yup.object().shape({
    name: yup.string().max(25, "El campo no puede contener mas de 25 caracteres").required("Campo Obligatorio"),
    lastName: yup.string().max(25, "El campo no puede contener mas de 25 caracteres").required("Campo Obligatorio"),
    email: yup.string().email("Email Invalido").max(50, "El campo no puede contener mas de 50 caracteres").required("Campo Obligatorio"),
    password: yup.string().matches(passwordRegex, "La contraseña debe tener al menos 8 caracteres, una letra, un numero y un caracter especial").max(32, "El campo no puede contener mas de 32 caracteres").required("Campo Obligatorio"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Las contraseñas no coinciden").required()
});

const initialValues: RegisterData = {
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
};

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const isMobile = useIsMobile();

    const { user, refetch } = useUserInfo();

    useEffect(() => {
        if (user)
            navigate(from, { replace: true });
    }, []);

    const handleFormSubmit = (registerData: RegisterData, { setErrors }: FormikHelpers<RegisterData>) => {
        Axios.post("/api/User/Register", registerData)
            .then(async res => {
                if (res.status === 200)
                {
                    await refetch();
                    navigate(from, { replace: true });
                    return;
                }
            })
            .catch(err => {
                const data = err.response?.data;
                if (data && data.detail)
                {
                    const detail = JSON.parse(data.detail)[0];
                    const errorCode = detail.Code;
                    switch (errorCode)
                    {
                        case "InvalidEmail":
                            setErrors({email: "El email es invalido."});
                            return;
                        case "DuplicateEmail":
                            setErrors({email: "El email ya se encuentra en uso."});
                            return;
                        default:
                            NotificationSender.error(detail.Description);
                            console.warn(`Unknown /User/Register response code: ${errorCode}`);
                            break;
                    }
                }

                NotificationSender.error("No se ha podido registrar en este momento. Por favor intente más tarde.");
            });
    };

    return (
        <Box m="20px">
            <Header title="REGISTRARSE" center/>
            <Box
                display="flex"
                justifyContent="center"
            >
                <Formik initialValues={initialValues}
                        onSubmit={handleFormSubmit}
                        validationSchema={registerSchema}
                >
                    {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                        <form onSubmit={handleSubmit} style={{ width: isMobile ? "80%" : "50%" }}>
                            <Box
                                display="grid"
                                gap="30px"
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
                                    label="Apellido"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.lastName}
                                    name="lastName"
                                    error={!!touched.lastName && !!errors.lastName}
                                    helperText={touched.lastName && errors.lastName}
                                    sx={inputStylign}
                                />
                                <TextField
                                    variant="filled"
                                    type="text"
                                    label="Email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    name="email"
                                    error={!!touched.email && !!errors.email}
                                    helperText={touched.email && errors.email}
                                    sx={inputStylign}
                                />
                                <TextField
                                    variant="filled"
                                    type="password"
                                    label="Contraseña"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.password}
                                    name="password"
                                    error={!!touched.password && !!errors.password}
                                    helperText={touched.password && errors.password}
                                    sx={inputStylign}
                                />
                                <TextField
                                    variant="filled"
                                    type="password"
                                    label="Confirmar Contraseña"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.confirmPassword}
                                    name="confirmPassword"
                                    error={!!touched.confirmPassword && !!errors.confirmPassword}
                                    helperText={touched.confirmPassword && errors.confirmPassword}
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
                                    Registrarse
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
};

export default Register;