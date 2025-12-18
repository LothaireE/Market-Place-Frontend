import { useState } from "react";
import {
    Avatar,
    Box,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Tooltip,
} from "@mui/material";
import CartIcon from "../cart/CartIcon";
import { MaterialUISwitch } from "../common/SwitchThemeButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { useAuthContext, useCartContext } from "../../context/useAppContext";
import { useNavigate } from "react-router";

type HeaderUserSectionProps = {
    onSetMobileOpen?: (open: boolean) => void;
};

const HeaderUserSection = ({ onSetMobileOpen }: HeaderUserSectionProps) => {
    const { isAuthenticated, logout, themeMode, toggleTheme, avatarLetter } =
        useAuthContext();
    const { totalQuantity } = useCartContext();
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => setAnchorElUser(null);

    const handleAuthenticateClick = async () => {
        onSetMobileOpen?.(false);
        if (isAuthenticated) {
            await logout?.();
            navigate("/");
        } else {
            navigate("/authenticate");
        }
        handleCloseUserMenu();
    };
    return (
        <Box
            sx={{
                flexGrow: 0,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                ml: 1,
            }}
        >
            {isAuthenticated && (
                <IconButton
                    sx={{
                        color: "inherit",
                        display: { xs: "none", md: "inline-flex" },
                    }}
                    // onClick={onFavoritesClick}
                    onClick={() => navigate("/account/favorites")}
                >
                    <FavoriteIcon />
                </IconButton>
            )}

            {/* Cart icon */}
            {/* <CartIcon handleClick={onCartClick} count={cartCount} /> */}
            <CartIcon
                handleClick={() => navigate("/account/cart")}
                count={totalQuantity}
            />

            {/* Avatar + menu */}
            <Tooltip title="Open account menu">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar>{avatarLetter}</Avatar>
                </IconButton>
            </Tooltip>

            <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar-user"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                {/*
                  cannot group menu item under <> </>
                 MUI Menu doesn't accept a Fragment as a child. 
                 isAuthenticated && for each item
                 */}
                {isAuthenticated && (
                    <MenuItem
                        onClick={() => {
                            navigate("/account");
                            handleCloseUserMenu();
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                            <AccountCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="My account" />
                    </MenuItem>
                )}
                {isAuthenticated && (
                    <MenuItem
                        onClick={() => {
                            navigate("/seller");
                            handleCloseUserMenu();
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                            <StorefrontIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Seller panel" />
                    </MenuItem>
                )}
                <MenuItem onClick={handleAuthenticateClick}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                        {isAuthenticated ? (
                            <LogoutIcon fontSize="small" />
                        ) : (
                            <LoginIcon fontSize="small" />
                        )}
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            isAuthenticated ? "Log out" : "Sign up / Log in"
                        }
                    />
                </MenuItem>

                <MenuItem onClick={toggleTheme}>
                    {/* <ListItemIcon sx={{ minWidth: 32 }}>
                        <MusicNoteIcon fontSize="small" />
                    </ListItemIcon> */}
                    <ListItemText
                        primary={
                            themeMode === "lightMode"
                                ? "Light mode"
                                : "Dark mode"
                        }
                    />
                    <MaterialUISwitch
                        defaultValue="lightMode"
                        checked={themeMode !== "lightMode"}
                    />
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default HeaderUserSection;
