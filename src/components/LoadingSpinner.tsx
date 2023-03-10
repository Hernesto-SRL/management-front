import {Box, Typography, useTheme} from "@mui/material";
import {ClipLoader} from "react-spinners";
import {tokens} from "../theme";

const LoadingSpinner = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box>
            <Typography variant="h2" sx={{
                textAlign: "center",
                paddingBottom: "20px"
            }}>
                Cargando...
            </Typography>
            <Box display="flex" justifyContent="center">
                <ClipLoader
                    color={colors.primary[100]}
                    loading={true}
                />
            </Box>
        </Box>
    );
};

export default LoadingSpinner;