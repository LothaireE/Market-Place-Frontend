import { useEffect, useState, useRef, useCallback } from "react";
import {
    Box,
    Container,
    Grid,
    Paper,
    Stack,
    Typography,
    Slider,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Select,
    MenuItem,
    Button,
    Pagination,
    CircularProgress,
    IconButton,
    type SelectChangeEvent,
} from "@mui/material";
import EuroIcon from "@mui/icons-material/Euro";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SortIcon from "@mui/icons-material/Sort";
import ClearIcon from "@mui/icons-material/Clear";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useNavigate, useSearchParams } from "react-router";
import type {
    Category,
    ProductCondition,
    ProductImage,
} from "../../types/product.type";
import DashboardCategories from "../../components/products/dashboard/DashboardCategories";
import DashboardSearchBar from "../../components/products/dashboard/DashboardSearchBar";
import { useDebouncedSearch } from "../../hooks/useDebouncedSearch";
import {
    GET_PRODUCTS_LIST_PAGE,
    SEARCH_PRODUCT_BY_NAME,
} from "../../library/graphql/queries/products";
import ProductCard from "../../components/products/ProductCard";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import SearchDropDownSelector from "../../components/header/search/SearchDropDownSelector";
import {
    applyNewSearchParams,
    type FilterUpdate,
} from "../../utils/applyNewSearchParams";
import { useDebouncedRange } from "../../hooks/useDebouncedRange";
import useOnBoardNavigate from "../../hooks/onBoardNavigate";

const pagination = {
    page: null,
    pageSize: 12, // null,
    sortBy: "DATE",
    sortDirection: "DESC",
};

export type PaginationInput = {
    page?: string;
    pageSize?: number; // null,
    sortBy?: "DATE" | "PRICE";
    sortDirection?: "ASC" | "DESC";
};

export type ProductFilterInput = {
    ids?: string[] | null;
    search?: string;
    category?: string;
    condition?: [ProductCondition] | null;
    minPrice?: number | null;
    maxPrice?: number | null;
};

type Product = {
    id: string;
    name: string;
    unitPrice: number;
    condition: ProductCondition;
    categories?: [Category];
    images: ProductImage[];
    status: string;
    sellerProfile: {
        user: { username: string };
    };
};

type ProductsResponse = {
    products: {
        items: Product[];
        totalItems: number;
        totalPages: number;
    };
};

const CONDITION_FILTERS: { label: string; value: ProductCondition }[] = [
    { label: "Excellent", value: "EXCELLENT" },
    { label: "Good", value: "GOOD" },
    { label: "Correct", value: "CORRECT" },
    { label: "Used", value: "USED" },
    { label: "Damaged", value: "DAMAGED" },
];

const SORT_OPTIONS = [
    { label: "Newest first", value: "NEWEST" },
    { label: "Price: low → high", value: "PRICE_ASC" },
    { label: "Price: high → low", value: "PRICE_DESC" },
];

type SelectedCategory = {
    id: string;
    name: string;
};

type LoadProductByNameType = {
    products: { items: Product[] };
    totalPages: number;
    totalProducts: number;
    currentPage: number;
};

const ProductList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParams = searchParams.get("category") ?? null;
    const searchNameParams = searchParams.get("search") ?? null;
    const minPriceParams = searchParams.get("minPrice") ?? null;
    const maxPriceParams = searchParams.get("maxPrice") ?? null;
    const conditionParams = searchParams.get("condition") ?? null;
    // const sortParams = searchParams.get("sort") ?? null;

    const navigate = useNavigate();

    const onBoardNavigate = useOnBoardNavigate();

    const handleStartSellingClick = () => {
        onBoardNavigate("/seller/new");
    };

    // const setFilterParams = (filter: FilterUpdate) => {
    //     setSearchParams((prev) => applyNewSearchParams(prev, filter));
    // };

    const setFilterParams = useCallback(
        (filter: FilterUpdate) => {
            setSearchParams((prev) => applyNewSearchParams(prev, filter));
        },
        [setSearchParams]
    );

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const searchbarClick = useOutsideClick(wrapperRef);

    // Filtres
    const [selectedCategory, setSelectedCategory] = useState<Category>({
        id: categoryParams ?? "",
        name: "",
    });
    const [selectedConditions, setSelectedConditions] = useState<
        ProductCondition[]
    >([]);

    const [priceRange, setPriceRange] = useState<[number, number]>([
        minPriceParams ? Number(minPriceParams) : 0,
        maxPriceParams ? Number(maxPriceParams) : 5000,
    ]);
    const [searchInputValue, setSearchInputValue] = useState("");
    const [searchResult, setSearchResult] = useState<Product[]>([]);
    const [sort, setSort] = useState<string>("NEWEST");
    const [page, setPage] = useState(1);
    // const limit = 12;
    //  const filter = { search: "" };

    const conditionArray = conditionParams
        ? (conditionParams.split(",") as ProductCondition[])
        : [];

    const paramsfilter = {
        search: searchNameParams,
        category: categoryParams,
        minPrice: minPriceParams ? Number(minPriceParams) : null,
        maxPrice: maxPriceParams ? Number(maxPriceParams) : null,
        condition:
            conditionArray && conditionArray.length > 0 ? conditionArray : null,
    } as ProductFilterInput;

    const { data, loading, error } = useQuery<ProductsResponse>(
        GET_PRODUCTS_LIST_PAGE,
        {
            variables: {
                // filter: filter
                filter: paramsfilter,
                pagination: pagination,
            },
        }
    );

    const [loadProductByName, { data: searchData }] =
        useLazyQuery<LoadProductByNameType>(SEARCH_PRODUCT_BY_NAME);

    useEffect(() => {
        if (searchData?.products?.items) {
            setSearchResult(searchData.products.items);
        }
    }, [searchData]);

    const products = data?.products.items ?? [];
    const totalPages = data?.products.totalPages ?? 1;
    const handleToggleCondition = (cond: ProductCondition) => {
        setPage(1);
        setSelectedConditions((prev) =>
            prev.includes(cond)
                ? prev.filter((c) => c !== cond)
                : [...prev, cond]
        );
        setFilterParams({
            condition: selectedConditions.includes(cond)
                ? selectedConditions.filter((c) => c !== cond).join(",")
                : [...selectedConditions, cond].join(","),
            page: "1",
        });
    };

    const handlePriceChange = (_: Event, value: number | number[]) => {
        // i will probably have to insert some sort of debounce here
        if (!Array.isArray(value)) return;
        setPriceRange([value[0], value[1]]);
        setPage(1);
    };

    const handleCategoryClick = (cat: SelectedCategory) => {
        if (!cat.id || cat.id === categoryParams) {
            setFilterParams({ category: "" });
            setSelectedCategory({ id: "", name: "" });
        } else {
            setFilterParams({ category: cat.id || null, page: "1" });
            setSelectedCategory(cat);
        }
    };

    const handleSortChange = (e: SelectChangeEvent<string>) => {
        setSort(e.target.value as string);
        setPage(1);
    };
    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSearchSubmit = (event: React.FormEvent) => {
        // TODO handle search submit that renders the results of said search in grid
        event.preventDefault();
        setSearchInputValue("");
        setSearchResult([]);
        setFilterParams({ search: searchInputValue });
        setPage(1);
    };

    const goToDetails = (id: string) => {
        navigate(`/products/${id}`);
    };

    useDebouncedSearch(searchInputValue, 500, async (search: string) => {
        await loadProductByName({
            variables: {
                pagination,
                filter: { search },
            },
        });
    });

    const onRangeChangeDebounced = useCallback(
        (range: [number, number]) => {
            setFilterParams({
                minPrice: range[0],
                maxPrice: range[1],
                page: "1",
            });
        },
        [setFilterParams]
    );

    useDebouncedRange(priceRange, 500, onRangeChangeDebounced);

    const handleSearchSelect = (productId: string) => {
        setSearchInputValue("");
        setSearchResult([]);
        navigate(`/products/${productId}`);
    };

    const handleClearSearchName = () => {
        console.info("You clicked the delete icon.");
        setSearchInputValue("");
        setSearchResult([]);
        setFilterParams({ search: "" });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* HEADER */}
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h4" fontWeight={600}>
                        Browse instruments
                    </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                    Guitars, synths, drums, studio gear and more, find the next
                    piece of your setup.
                </Typography>
            </Box>
            {searchNameParams && (
                <Box sx={{ mb: 3, ml: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h4" fontWeight={700}>
                            {searchNameParams}
                        </Typography>
                        <IconButton
                            size="large"
                            aria-label="clear search results"
                            aria-haspopup="true"
                            onClick={handleClearSearchName}
                            color="inherit"
                        >
                            <ClearIcon />
                        </IconButton>
                    </Stack>
                </Box>
            )}
            <Grid container spacing={3}>
                {/* dashboard */}

                <Grid size={{ xs: 12, md: 2 }}>
                    <Paper
                        elevation={1}
                        sx={{ p: 2.5, borderRadius: 3, mb: 2 }}
                    >
                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            sx={{ mb: 1 }}
                        >
                            Categories
                        </Typography>

                        <DashboardCategories
                            selectedCategory={selectedCategory}
                            onCategoryClick={handleCategoryClick}
                        />

                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            sx={{ mb: 1, mt: 1 }}
                        >
                            Price range
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <EuroIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                                {priceRange[0]} € – {priceRange[1]} €
                            </Typography>
                        </Stack>
                        <Slider
                            sx={{ mt: 1 }}
                            value={priceRange}
                            min={0}
                            max={5000}
                            step={50}
                            onChange={handlePriceChange}
                            valueLabelDisplay="off"
                        />

                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            sx={{ mb: 1, mt: 2 }}
                        >
                            Condition
                        </Typography>
                        <FormGroup>
                            {CONDITION_FILTERS.map((c) => (
                                <FormControlLabel
                                    key={c.value}
                                    control={
                                        <Checkbox
                                            checked={selectedConditions.includes(
                                                c.value
                                            )}
                                            onChange={() =>
                                                handleToggleCondition(c.value)
                                            }
                                            size="small"
                                        />
                                    }
                                    label={c.label}
                                />
                            ))}
                        </FormGroup>
                    </Paper>

                    {/* Petit encart info vendeur */}
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            display: { xs: "none", md: "block" },
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 1 }}
                        >
                            <StorefrontIcon color="primary" />
                            <Typography variant="subtitle2" fontWeight={600}>
                                Want to sell your gear?
                            </Typography>
                        </Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1.5 }}
                        >
                            Turn your unused instruments into cash. List them on
                            Cheap Zicos Music Market.
                        </Typography>
                        <Button
                            size="small"
                            variant="outlined"
                            fullWidth
                            // onClick={() => navigate("/seller/new")}
                            onClick={handleStartSellingClick}
                        >
                            Start selling
                        </Button>
                    </Paper>
                </Grid>

                {/* LISTE PRODUITS */}
                <Grid size={{ xs: 12, md: 9 }}>
                    {/* Bar de recherche + tri */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            mb: 2,
                            border: (theme) =>
                                `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            alignItems={{ xs: "stretch", sm: "center" }}
                            justifyContent="space-between"
                            // border={3}
                        >
                            <Box
                                ref={wrapperRef}
                                sx={{ position: "relative" }}
                                width={"100%"}
                            >
                                <DashboardSearchBar
                                    value={searchInputValue}
                                    handleOnChange={setSearchInputValue}
                                    handleSearchSubmit={handleSearchSubmit}
                                    placeholder="Search by name, brand, model…"
                                />
                                <SearchDropDownSelector // TODO rename it search selector
                                    items={searchResult}
                                    handleOnClick={handleSearchSelect}
                                    open={searchbarClick === "inside"}
                                />
                            </Box>
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ minWidth: 220 }}
                            >
                                <SortIcon color="action" />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Sort by
                                </Typography>
                                <Select
                                    size="small"
                                    value={sort}
                                    onChange={handleSortChange}
                                    fullWidth
                                >
                                    {SORT_OPTIONS.map((opt) => (
                                        <MenuItem
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Stack>
                        </Stack>
                    </Paper>

                    {/* Contenu liste */}
                    {loading && (
                        <Box
                            sx={{
                                minHeight: 200,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    )}

                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            Unable to load products. Please try again later.
                        </Typography>
                    )}

                    {!loading && products.length === 0 && !error && (
                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                textAlign: "center",
                                border: (theme) =>
                                    `1px dashed ${theme.palette.divider}`,
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                No instruments match your filters
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Try broadening your search, removing some
                                filters or increasing the price range.
                            </Typography>
                        </Paper>
                    )}

                    <Grid container spacing={2.5} py={1}>
                        {products.map((product) => (
                            <Grid
                                key={product.id}
                                size={{ xs: 12, sm: 6, md: 3 }}
                                gap={1}
                                marginBottom={2}
                            >
                                <ProductCard
                                    product={{ ...product }}
                                    onClick={() => goToDetails(product.id)}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination */}
                    {products.length > 0 && (
                        <Box
                            sx={{
                                mt: 3,
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                shape="rounded"
                            />
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductList;
