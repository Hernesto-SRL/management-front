import {Box, Button, Typography} from "@mui/material";

interface Props {
    error: string;
    onGoBackClick: () => void;
}

const ErrorMessage = ({ error, onGoBackClick }: Props) => {
    return (
        <Box>
            <Typography variant="h2" textAlign="center">{error}</Typography>
            <Box display="flex" justifyContent="center" paddingTop="20px">
                <Button
                    type="button"
                    color="secondary"
                    variant="contained"
                    size="large"
                    onClick={onGoBackClick}
                    sx={{
                        fontSize: "1rem",
                        width: "50%"
                    }}
                >
                    Volver
                </Button>
            </Box>
        </Box>
    );
};

export default ErrorMessage;