import "react-pro-sidebar/dist/css/styles.css";
import {Box, Typography, IconButton, useTheme} from "@mui/material";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import {tokens} from "../theme";
import React, {useState} from "react";
import {MenuOutlined} from "@mui/icons-material";
import {Link} from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";

export interface SidebarProps {
    title: string;
    sections: SidebarSections;
}

export interface SidebarSections {
    [key: string]: SidebarItemProps[];
}

export interface SidebarItemProps {
    title: string;
    to: string;
    icon: React.ReactNode;
}

interface ItemPropsInternal {
    title: string;
    to: string;
    icon: React.ReactNode;
    selected: string;
    setSelected(selected: string): void;
}

const Item = ({ title, to, icon, selected, setSelected }: ItemPropsInternal) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <MenuItem
            active={selected === title}
            style={{ color: colors.grey[100] }}
            onClick={() => setSelected(title)}
            icon={icon}
        >
            <Typography>{title}</Typography>
            <Link to={to}/>
        </MenuItem>
    );
};

const Sidebar = ({ title, sections }: SidebarProps) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const isMobile = useIsMobile();
    const [isCollapsed, setIsCollapsed] = useState(isMobile);
    const [selected, setSelected] = useState("Dashboard");
    const [touchPosition, setTouchPosition] = useState(0);

    const onTouchStart = (e: any) => {
        const touchDown = e.touches[0].clientX;
        setTouchPosition(touchDown);
    };

    const onTouchMove = (e: any) => {
        const touchDown = touchPosition;
        if (touchDown === 0)
            return;

        const currentTouch = e.touches[0].clientX;
        const diff = touchDown - currentTouch;

        if (diff > 5)
            setIsCollapsed(true);

        if (diff < -5)
            setIsCollapsed(false);

        setTouchPosition(0);
    };

    return (
        <Box
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}

            sx={{
                paddingTop: "10px",
                "& .pro-sidebar-inner": {
                    background: `${colors.primary[400]} !important`
                },
                "& .pro-icon-wrapper": {
                    backgroundColor: "transparent !important"
                },
                "& .pro-inner-item": {
                    padding: "5px 35px 5px 20px !important"
                },
                "& .pro-inner-item:hover": {
                    color: "#868dfb !important"
                },
                "& .pro-menu-item.active": {
                    color: "#6870fa !important"
                }
            }}
        >
            <ProSidebar collapsed={isCollapsed}>
                <Menu iconShape="square">
                    {/* LOGO AND MENU ICON */}
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={isCollapsed ? <MenuOutlined/> : undefined}
                        style={{
                            margin: "10px 0 20px 0",
                            color: colors.grey[100]
                        }}
                    >
                        {!isCollapsed && (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                ml="15px"
                            >
                                <Typography variant="h3" color={colors.grey[100]}>
                                    {title}
                                </Typography>
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <MenuOutlined/>
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {/* MENU ITEMS*/}
                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                        {Object.keys(sections).map((sectionTitle: string, idx: number) => {
                            const items: SidebarItemProps[] = sections[sectionTitle];
                            return (
                                <React.Fragment key={idx}>
                                    <Typography
                                        variant="h6"
                                        color={colors.grey[300]}
                                        sx={{m: "15px 0 5px 20px"}}
                                    >
                                        {sectionTitle}
                                    </Typography>
                                    {items.map((itemProps: SidebarItemProps, idx: number) => (
                                        <React.Fragment key={idx}>
                                            <Item
                                                title={itemProps.title}
                                                to={itemProps.to}
                                                icon={itemProps.icon}
                                                selected={selected}
                                                setSelected={setSelected}
                                            />
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default Sidebar;