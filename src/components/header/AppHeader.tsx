import { useEffect, useRef, useState } from "react";
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
import { useDebouncedSearch } from "../../hooks/useDebouncedSearch";
import { useLazyQuery } from "@apollo/client";
import type { Product } from "../../types/product.type";
import { SEARCH_PRODUCT_BY_NAME } from "../../library/graphql/queries/products";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import SearchDropDownSelector from "./search/SearchDropDownSelector";
import useOnBoardNavigate from "../../hooks/onBoardNavigate";

type LoadProductByNameType = {
    products: { items: Product[] };
    totalPages: number;
    totalProducts: number;
    currentPage: number;
};

const AppHeader = () => {
    const { isAuthenticated } = useAuthContext();
    const navigate = useNavigate();
    const onBoardNavigate = useOnBoardNavigate();

    const handleClick = () => onBoardNavigate("seller/new");

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const searchbarClick = useOutsideClick(wrapperRef);

    const mobileWrapperRef = useRef<HTMLDivElement | null>(null);
    const mobileSearchbarClick = useOutsideClick(mobileWrapperRef);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchInputValue, setSearchInputValue] = useState("");
    const [searchResult, setSearchResult] = useState<Product[]>([]);

    const pagination = {
        page: null,
        pageSize: null,
        sortBy: "DATE",
        sortDirection: "DESC",
    };
    //TODO: rewrite all the other useLazyQuery
    //  no more onCompleted, uef now
    // https://github.com/apollographql/apollo-client/issues/12352
    const [loadProductByName, { data: searchData }] =
        useLazyQuery<LoadProductByNameType>(SEARCH_PRODUCT_BY_NAME);

    useEffect(() => {
        if (searchData?.products?.items) {
            setSearchResult(searchData.products.items);
        }
    }, [searchData]);

    const handleToggleMobileDrawer = (
        value: "open" | "close" | "toggle" = "toggle",
    ) => {
        if (value === "open") return setMobileOpen(true);
        if (value === "close") return setMobileOpen(false);
        setMobileOpen((prev) => !prev);
    };

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setSearchInputValue("");
        setSearchResult([]);
        navigate(`/products/?search=${searchInputValue}`);
    };

    useDebouncedSearch(searchInputValue, 500, async (search: string) => {
        await loadProductByName({
            variables: {
                pagination,
                filter: { search },
            },
        });
    });

    const handleSelect = (id: string) => {
        navigate(`/products/${id}`);
        setSearchInputValue("");
        setSearchResult([]);
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
                                ref={wrapperRef}
                                mx="auto"
                                sx={{
                                    flexGrow: 2,
                                    display: { xs: "none", md: "block" },
                                    position: "relative",
                                }}
                            >
                                <HeaderDesktopSearch
                                    value={searchInputValue}
                                    onChange={setSearchInputValue}
                                    onSubmit={handleSearchSubmit}
                                />
                                <SearchDropDownSelector
                                    open={searchbarClick === "inside"}
                                    items={searchResult}
                                    handleOnClick={handleSelect}
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
                                {MAIN_NAV_LINKS.map((link) => (
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
                                        onClick={handleClick}
                                        sx={{ alignSelf: "center" }}
                                    />
                                )}
                            </Box>

                            {/* right part  avatarLetter */}
                            <HeaderUserSection />
                        </Box>
                        <Box
                            pb={1}
                            sx={{
                                display: { xs: "block", md: "none" },
                                position: "relative",
                            }}
                            ref={mobileWrapperRef}
                        >
                            <Divider sx={{ mb: 2 }} />
                            <HeaderMobileSearch
                                value={searchInputValue}
                                onChange={setSearchInputValue}
                                onSubmit={handleSearchSubmit}
                            />
                            <SearchDropDownSelector
                                open={mobileSearchbarClick === "inside"}
                                items={searchResult}
                                handleOnClick={handleSelect}
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
