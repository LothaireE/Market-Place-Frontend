import { MaterialUISwitch } from "../common/SwitchThemeButton";
import { MAIN_NAV_LINKS, type MainNavLinkItem } from "./MainNavLinks";
import { useAuthContext } from "../../context/useAppContext";
import { useNavigate } from "react-router";

import {
    Box,
    Typography,
    Avatar,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Chip,
    Stack,
    ListItem,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const mainNavLinks = MAIN_NAV_LINKS;

type HeaderMobileDrawerProps = {
    open: boolean;
    toggleMobileDrawer: (value: "open" | "close" | "toggle") => void;
};

const HeaderMobileDrawer = ({
    open,
    toggleMobileDrawer,
}: HeaderMobileDrawerProps) => {
    const {
        isAuthenticated,
        avatarLetter,
        user,
        themeMode,
        logout,
        toggleTheme,
    } = useAuthContext();

    const navigate = useNavigate();

    const handleNavClick = (to: string) => {
        navigate(to);
        toggleMobileDrawer("close");
    };

    const handleAuthenticateClick = async () => {
        if (isAuthenticated) {
            await logout?.();
            navigate("/");
        } else {
            navigate("/authenticate");
        }
        toggleMobileDrawer("close");
    };

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={() => toggleMobileDrawer("toggle")}
        >
            <Box
                sx={{
                    width: 260,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                }}
            >
                {/* Header */}
                <Box sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 36, height: 36 }}>
                            {avatarLetter}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {isAuthenticated
                                    ? user?.username || "Musician"
                                    : "Welcome"}
                            </Typography>
                            {/* <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {isAuthenticated
                                    ? user?.email
                                    : "Sign in to access your account"}
                            </Typography> */}
                        </Box>
                    </Stack>

                    {isAuthenticated && (
                        <Chip
                            label="Seller"
                            size="small"
                            color="primary"
                            icon={<StorefrontIcon sx={{ fontSize: 16 }} />}
                            sx={{ mt: 1 }}
                            // onClick={handleSellerClick}
                            onClick={() => {
                                handleNavClick("/seller");
                            }}
                        />
                    )}
                </Box>

                <Divider sx={{ mb: 1 }} />

                <List dense>
                    {mainNavLinks.map((link: MainNavLinkItem) => (
                        <ListItemButton
                            key={link.to}
                            onClick={() => handleNavClick(link.to)}
                            sx={{ borderRadius: 2 }}
                        >
                            <ListItemIcon>{link.icon}</ListItemIcon>
                            <ListItemText primary={link.label} />
                        </ListItemButton>
                    ))}

                    {isAuthenticated && (
                        <>
                            <ListItemButton
                                onClick={() => {
                                    handleNavClick("/account");
                                }}
                                // onClick={handleAccountClick}
                                sx={{ mt: 0.5, borderRadius: 2 }}
                            >
                                <ListItemIcon>
                                    <AccountCircleIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="My account" />
                            </ListItemButton>

                            <ListItemButton
                                onClick={() => {
                                    handleNavClick("/seller");
                                }}
                                // onClick={handleSellerClick}
                                sx={{ borderRadius: 2 }}
                            >
                                <ListItemIcon>
                                    <StorefrontIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Seller panel" />
                            </ListItemButton>

                            <ListItemButton
                                // onClick={handleFavoritesClick}
                                onClick={() => {
                                    handleNavClick("/account/favorites");
                                }}
                                sx={{ borderRadius: 2 }}
                            >
                                <ListItemIcon>
                                    <FavoriteIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Favorites" />
                            </ListItemButton>

                            <ListItemButton
                                onClick={() => {
                                    handleNavClick("/account/cart");
                                }}
                                // onClick={handleCartClick}
                                sx={{ borderRadius: 2 }}
                            >
                                <ListItemIcon>
                                    <ShoppingCartIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Cart" />
                            </ListItemButton>
                        </>
                    )}
                </List>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ mt: "auto" }}>
                    <List dense>
                        <ListItem
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                                px: 1,
                            }}
                            secondaryAction={
                                <MaterialUISwitch
                                    defaultValue="lightMode"
                                    checked={themeMode !== "lightMode"}
                                    onChange={toggleTheme}
                                />
                            }
                        >
                            <ListItemIcon>
                                <MusicNoteIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    themeMode === "lightMode"
                                        ? "Light mode"
                                        : "Dark mode"
                                }
                            />
                        </ListItem>

                        <ListItemButton
                            onClick={handleAuthenticateClick}
                            // onClick={() => {
                            //     handleNavClick("/account/favorites");
                            // }}
                            sx={{ borderRadius: 2 }}
                        >
                            <ListItemIcon>
                                {isAuthenticated ? (
                                    <LogoutIcon fontSize="small" />
                                ) : (
                                    <LoginIcon fontSize="small" />
                                )}
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    isAuthenticated
                                        ? "Log out"
                                        : "Sign up / Log in"
                                }
                            />
                        </ListItemButton>
                    </List>
                </Box>
            </Box>
        </Drawer>
    );
};

export default HeaderMobileDrawer;
