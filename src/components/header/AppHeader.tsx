import { useState } from "react";
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Container,
    Chip,
    Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useNavigate } from "react-router";
import { useAuthContext } from "../../context/useAppContext";
import RouterLinkButton from "../common/RouterLinkButton";
import HeaderSiteLogo from "./HeaderSiteLogo";
import HeaderMobileDrawer from "./HeaderMobileDrawer";
import HeaderMobileSearch from "./search/HeaderMobileSearch";
import HeaderDesktopSearch from "./search/HeaderDesktopSearch";

import HeaderUserSection from "./HeaderUserSection";
import { MAIN_NAV_LINKS } from "./MainNavLinks";

const mainNavLinks = MAIN_NAV_LINKS;

const AppHeader = () => {
    const { isAuthenticated } = useAuthContext();
    const navigate = useNavigate();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [search, setSearch] = useState("");

    const handleToggleMobileDrawer = (
        value: "open" | "close" | "toggle" = "toggle"
    ) => {
        console.log({ value });
        if (value === "open") return setMobileOpen(true);
        if (value === "close") return setMobileOpen(false);
        setMobileOpen((prev) => !prev);
    };

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // TODO
        // navigate(`/?q=${encodeURIComponent(search.trim())}`);
    };

    return (
        <>
            <AppBar position="sticky">
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ gap: 2, display: "block" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            {/* mobile burger */}
                            <Box
                                sx={{
                                    display: { xs: "flex", md: "none" },
                                    mr: 1,
                                }}
                            >
                                <IconButton
                                    size="large"
                                    aria-label="open navigation menu"
                                    aria-haspopup="true"
                                    onClick={() =>
                                        handleToggleMobileDrawer("toggle")
                                    }
                                    color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Box>

                            {/* Logo */}
                            <Box
                                sx={{
                                    flexGrow: 2,
                                    display: "flex",
                                    justifyContent: {
                                        xs: "center",
                                        md: "flex-start",
                                    },
                                }}
                            >
                                <HeaderSiteLogo />
                            </Box>
                            {/* Search desktop */}
                            <Box
                                mx="auto"
                                sx={{
                                    flexGrow: 2,
                                    display: { xs: "none", md: "block" },
                                }}
                            >
                                <HeaderDesktopSearch
                                    value={search}
                                    onChange={setSearch}
                                    onSubmit={handleSearchSubmit}
                                />
                            </Box>

                            {/* only on desktop */}
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: {
                                        xs: "none",
                                        md: "flex",
                                    },
                                    justifyContent: "center",
                                }}
                            >
                                {mainNavLinks.map((link) => (
                                    <RouterLinkButton
                                        key={link.to}
                                        to={link.to}
                                        sx={{
                                            my: 2,
                                            mx: 1,
                                            color: "white",
                                            display: "block",
                                        }}
                                    >
                                        {link.label}
                                    </RouterLinkButton>
                                ))}

                                {isAuthenticated && (
                                    <Chip
                                        label="Seller panel"
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                        icon={
                                            <StorefrontIcon
                                                sx={{ fontSize: 16 }}
                                            />
                                        }
                                        onClick={() => navigate("/seller")}
                                        sx={{ alignSelf: "center" }}
                                    />
                                )}
                            </Box>

                            {/* right part  avatarLetter */}
                            <HeaderUserSection />
                        </Box>
                        <Box
                            pb={1}
                            sx={{ display: { xs: "block", md: "none" } }}
                        >
                            <Divider sx={{ mb: 2 }} />
                            <HeaderMobileSearch
                                value={search}
                                onChange={setSearch}
                                onSubmit={handleSearchSubmit}
                            />
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <HeaderMobileDrawer
                open={mobileOpen}
                toggleMobileDrawer={handleToggleMobileDrawer}
            />
        </>
    );
};

export default AppHeader;
