import {Box, Typography, useTheme} from "@mui/material";
import {tokens} from "../theme";

export interface HeaderProps {
    title: string;
    subtitle?: string;
    center?: boolean;
}

const Header = ({ title, subtitle = "", center = false }: HeaderProps) => {
      const theme = useTheme();
      const colors = tokens(theme.palette.mode);

      return (
        <Box mb="30px" textAlign={ center ? "center" : undefined }>
            <Typography
                variant="h2"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ mb: "5px" }}
            >
                {title}
            </Typography>

            {subtitle && <Typography
                variant="h5"
                color={colors.greenAccent[400]}
            >
                {subtitle}
            </Typography>}
        </Box>
      );
};

export default Header;