import React, {useContext, useState} from "react";
import {Box, IconButton, Typography, useTheme} from "@mui/material";
import {ColorModeContext, tokens} from "../theme";
import {Link, useNavigate} from "react-router-dom";
import {
    AdminPanelSettingsOutlined,
    DarkModeOutlined,
    LightModeOutlined,
    LoginOutlined,
    LogoutOutlined,
    PersonOutlined, RuleFolderOutlined,
    SettingsOutlined
} from "@mui/icons-material";
import useUserInfo, {UserRole} from "../hooks/useUserInfo";
import {OutsideClickHandler} from "./OutsideClickHandler";
import Axios from "axios";

const Navbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);

    const [dropdownMenuOpen, setDropdownMenuOpen] = useState<boolean>(false);
    const { user, isLoading } = useUserInfo();

    const closeDropdown = () => setDropdownMenuOpen(false);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 2,
                backgroundColor: colors.primary[400],
                boxShadow: "0 .25rem .75rem rgba(0.5, 0.5, 0.5, .5)"
            }}
        >
            {/* BRAND NAME */}
            <Link to="/">
                <Typography
                    variant="h3"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ mb: "5px"}}
                >
                    Hernesto SRL
                </Typography>
            </Link>

            {/* MENU ICONS */}
            <Box display="flex">
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark"
                        ? <LightModeOutlined/>
                        : <DarkModeOutlined/>
                    }
                </IconButton>
                {isLoading || !user ?
                    <IconButton>
                        <Link to="/login">
                            <LoginOutlined/>
                        </Link>
                    </IconButton> :
                    <>
                        <OutsideClickHandler handleClick={() => setDropdownMenuOpen(false)}>
                            <IconButton onClick={() => setDropdownMenuOpen(!dropdownMenuOpen)}>
                                <PersonOutlined/>
                            </IconButton>
                            {dropdownMenuOpen && <UserMenuDropdown closeDropdown={closeDropdown}/>}
                        </OutsideClickHandler>
                    </>
                }
            </Box>
        </Box>
    );
};

interface UserMenuProps {
    closeDropdown: () => void;
}

const UserMenuDropdown = ({ closeDropdown }: UserMenuProps) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const { refetch } = useUserInfo();

    const onItemClicked = (route: string) => {
        navigate(route);
        closeDropdown();
    };

    const onLogoutClicked = () => {
        Axios.get("/api/User/Logout")
            .then(async res => {
                if (res.status === 200)
                    await refetch();
            });
        closeDropdown();
    };

    return (
        <Box sx={{
            position: "absolute",
            zIndex: "999",
            top: "58px",
            width: "200px",
            transform: "translate(-85%)",
            backgroundColor: colors.primary[400],
            border: `1px solid ${colors.greenAccent[700]}`,
            borderRadius: "8px",
            padding: "1rem",
            overflow: "hidden"
        }}>
            <DropdownMenuItem icon={<SettingsOutlined/>} text="Perfil" onClick={() => onItemClicked("/profile")}/>
            <DropdownMenuItem icon={<AdminPanelSettingsOutlined/>} text="Admin" onClick={() => onItemClicked("/admin")} requiresRoles={UserRole.Admin}/>
            <DropdownMenuItem icon={<RuleFolderOutlined/>} text="Control" onClick={() => onItemClicked("/control/stockEntry")} requiresRoles={UserRole.Admin}/>
            <DropdownMenuItem icon={<LogoutOutlined/>} text="Cerrar Sesion" onClick={onLogoutClicked}/>
        </Box>
    );
};

interface DropdownMenuItemProps {
    icon: React.ReactNode,
    text: string
    onClick: () => void;
    requiresRoles?: UserRole;
}

const DropdownMenuItem = ({ icon, text, onClick, requiresRoles }: DropdownMenuItemProps) => {
    const { user } = useUserInfo();

    if (requiresRoles && user && (requiresRoles & user.roles) !== requiresRoles)
        return <></>;

    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            height: "50px",
            width: "100%",
            transition: "background 1s",
        }}>
            <Box sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                padding: "0.5rem",
                borderRadius: "8px",
                "&:hover": {
                    backgroundColor: "#a3a3a3",
                    cursor: "pointer"
                }
            }}
                 onClick={onClick}
            >
                {text}
                {icon}
            </Box>
        </Box>
    );
};

export default Navbar;