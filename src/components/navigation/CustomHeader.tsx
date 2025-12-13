import { useState } from "react";
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Tooltip,
    MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdbIcon from "@mui/icons-material/Adb";
import { useAuthContext, useCartContext } from "../../context/useAppContext";
import { useNavigate } from "react-router";
import { MaterialUISwitch } from "../common/SwitchThemeButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CartIcon from "../cart/CartIcon";
import RouterLinkButton from "../common/RouterLinkButton";

const pages = [
    { label: "Products", to: "/" },
    { label: "Create Product", to: "/create-product" },
    { label: "Blog", to: "/" },
];
const settings = ["Profile", "Account", "Dashboard", "Login", "Logout"];

function CustomHeader() {
    const { logout, toggleTheme, themeMode } = useAuthContext();
    const { cartItems } = useCartContext();
    const navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        const target = event.target as HTMLElement;
        setAnchorElNav(null);
        if (target.textContent === "Products") navigate("/");
        if (target.textContent === "Create Product")
            navigate("/create-product");
    };

    const handleCloseUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        const target = event.target as HTMLElement;
        if (target.textContent === "Logout") {
            logout?.();
            navigate("/");
        }
        if (target.textContent === "Login") navigate("/authenticate");

        setAnchorElUser(null);
    };

    const handleToggleTheme = () => toggleTheme();

    const handleCartClick = () => {
        console.log("panier !");
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon
                        sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        LOGO
                    </Typography>
                    {/* phone  */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: "block", md: "none" } }}
                        >
                            {pages.map((page, idx) => (
                                <MenuItem
                                    key={idx}
                                    onClick={handleCloseNavMenu}
                                >
                                    <RouterLinkButton
                                        to={page.to}
                                        sx={{ textAlign: "center" }}
                                    >
                                        {page.label}
                                    </RouterLinkButton>
                                </MenuItem>
                            ))}
                            {/* {pages.map((page) => (
                                <MenuItem
                                    key={page}
                                    onClick={handleCloseNavMenu}
                                >
                                    <Typography sx={{ textAlign: "center" }}>
                                        {page}
                                    </Typography>
                                </MenuItem>
                            ))} */}
                        </Menu>
                    </Box>
                    <AdbIcon
                        sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
                    />
                    {/* desktop  */}
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: "flex", md: "none" },
                            flexGrow: 1,
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        LOGO
                    </Typography>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                        }}
                    >
                        {/* {pages.map((page, idx) => (
                            <Button
                                key={idx}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    my: 2,
                                    color: "white",
                                    display: "block",
                                }}
                            >
                                {page}
                            </Button>
                        ))} */}
                        {pages.map((page, idx) => (
                            <RouterLinkButton
                                key={idx}
                                to={page.to}
                                sx={{
                                    my: 2,
                                    color: "white",
                                    display: "block",
                                }}
                            >
                                {page.label}
                            </RouterLinkButton>
                        ))}
                    </Box>
                    {/* Options */}
                    <Box
                        sx={{
                            flexGrow: 0,
                            // display: "flex",
                            alignItems: "center",
                            gap: 2,
                            display: { xs: "none", md: "flex" },
                        }}
                    >
                        <IconButton
                            sx={{ color: "inherit" }}
                            onClick={() => {
                                console.log("open favorites");
                                // navigate("/favorites");
                            }}
                        >
                            <FavoriteIcon />
                        </IconButton>
                        <CartIcon
                            handleClick={handleCartClick}
                            itemsCount={cartItems.length}
                        />

                        {/* Settings */}

                        <Tooltip title="Open settings">
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: 0 }}
                            >
                                <Avatar
                                    alt="Remy Sharp"
                                    src="/static/images/avatar/2.jpg"
                                />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
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
                            {settings.map((setting) => (
                                <MenuItem
                                    key={setting}
                                    onClick={(event) =>
                                        handleCloseUserMenu(event)
                                    }
                                >
                                    <Typography sx={{ textAlign: "center" }}>
                                        {setting}
                                    </Typography>
                                </MenuItem>
                            ))}
                            <MenuItem onClick={handleToggleTheme}>
                                <Typography sx={{ textAlign: "center" }}>
                                    {themeMode === "lightMode"
                                        ? "Light Mode"
                                        : "Dark Mode"}
                                </Typography>
                                <MaterialUISwitch
                                    defaultValue={"lightMode"}
                                    checked={themeMode !== "lightMode"}
                                />
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default CustomHeader;
