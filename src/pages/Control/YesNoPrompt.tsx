import {Box, Button, Typography, useTheme} from "@mui/material";
import {tokens} from "../../theme";

interface Props {
    message: string;
    question: string;
    onYesClick: () => void;
    onNoClick: () => void;
}

const YesNoPrompt = ({ message, question, onYesClick, onNoClick }: Props) => {
    const theme = useTheme();

    const colors = tokens(theme.palette.mode);
    return (
        <Box textAlign="center">
            <Typography variant="h2" color={colors.grey[100]}>
                {message}
            </Typography>
            <Typography variant="h2" color={colors.grey[100]}>
                {question}
            </Typography>
            <Box display="flex" justifyContent="center" mt="20px" gap="50px">
                <Button
                    color="secondary"
                    variant="contained"
                    size="medium"
                    sx={{ width: "20%", fontSize: "1.2rem" }}
                    onClick={onYesClick}
                >
                    Si
                </Button>
                <Button
                    color="secondary"
                    variant="contained"
                    size="medium"
                    sx={{ width: "20%", fontSize: "1.2rem" }}
                    onClick={onNoClick}
                >
                    No
                </Button>
            </Box>
        </Box>
    );
};

export default YesNoPrompt;