import {Box, Button, TextField} from "@mui/material";
import * as yup from "yup";
import {Formik, FormikHelpers} from "formik";
import Header from "../components/Header";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Axios from "axios";
import {NotificationSender} from "../Notifications";
import useUserInfo from "../hooks/useUserInfo";
import {useEffect} from "react";
import {inputStylign} from "../utils";
import useIsMobile from "../hooks/useIsMobile";

interface LoginData {
    email: string;
    password: string;
}

const loginSchema = yup.object().shape({
    email: yup.string().email("Email Invalido").max(50, "El campo no puede contener mas de 50 caracteres").required("Campo Obligatorio"),
    password: yup.string().max(32, "El campo no puede contener mas de 32 caracteres").required("Campo Obligatorio")
});

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const isMobile = useIsMobile();

    const { user, refetch } = useUserInfo();

    useEffect(() => {
        if (user)
            navigate(from, { replace: true });
    }, []);

    const handleFormSubmit = (loginData: LoginData, { setErrors }: FormikHelpers<LoginData>) => {
        Axios.post("/api/User/Login", loginData)
            .then(async res => {
                if (res.status === 200)
                {
                    await refetch();
                    navigate(from, { replace: true });
                }
            })
            .catch(err => {
                if (err.response && err.response.status === 400)
                {
                    const data = err.response.data;
                    let message =  "El email o la contraseña es incorrecto";
                    if (data && data.isLockedOut)
                        message = 'Has excedido la cantidad máxima de intentos. Reintente en 5 minutos.';
                    setErrors({email: message});
                    return;
                }

                NotificationSender.error(`LOGIN ERROR ${err.response?.status}`);
            });
    };

    return (
        <Box m="20px">
            <Header title="LOGIN" center/>
            <Box
                display="flex"
                justifyContent="center"
            >
                <Formik initialValues={{ email: "", password: "" }}
                        onSubmit={handleFormSubmit}
                        validationSchema={loginSchema}
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
                            </Box>
                            <Box display="flex" justifyContent="center" mt="20px">
                                <Button
                                    type="submit"
                                    color="secondary"
                                    variant="contained"
                                    size="medium"
                                    sx={{ width: "60%", fontSize: "1.2rem" }}
                                >
                                    Login
                                </Button>
                            </Box>
                            <Box display="flex" justifyContent="center" p="20px">
                                <Link to="/register" style={{
                                    fontSize: "1.2rem",
                                    textDecoration: "underline",
                                    textAlign: "center"
                                }}>
                                    No tienes una cuenta? Registrate Aquí.
                                </Link>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
};

export default Login;