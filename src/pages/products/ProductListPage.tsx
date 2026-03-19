import { useRef, useState, useCallback } from "react";
import {
    Box,
    Container,
    Grid,
    Paper,
    Stack,
    Typography,
    Pagination,
    CircularProgress,
    IconButton,
    type SelectChangeEvent,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useNavigate } from "react-router";
import type {
    LoadProductByNameType,
    ProductCondition,
    ProductListItem,
    ProductListResponse,
    SelectedCategory,
} from "../../types/product.type";
import {
    GET_PRODUCTS_LIST_PAGE,
    SEARCH_PRODUCT_BY_NAME,
} from "../../library/graphql/queries/products";
import ProductCard from "../../components/products/ProductCard";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useDebouncedSearch } from "../../hooks/useDebouncedSearch";
import { useDebouncedRange } from "../../hooks/useDebouncedRange";
import useOnBoardNavigate from "../../hooks/onBoardNavigate";
import { DEFAULT_PAGE_SIZE, SORT_OPTIONS } from "../../constants/products";
import DashboardSidebar from "../../components/products/dashboard/DashboardSidebar";
import DashboardToolbar from "../../components/products/dashboard/DashboardToolbar";
import { useProductListFilters } from "../../hooks/useProductListFilters";

const ProductList = () => {
    const navigate = useNavigate();
    const onBoardNavigate = useOnBoardNavigate();

    const {
        page,
        sort,
        category,
        searchName,
        minPrice,
        maxPrice,
        selectedConditions,
        filter,
        pagination,
        setFilterParams,
    } = useProductListFilters();

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const searchbarClick = useOutsideClick(wrapperRef);

    const [priceRange, setPriceRange] = useState<[number, number]>([
        minPrice ?? 0,
        maxPrice ?? 5000,
    ]);
    const [searchInputValue, setSearchInputValue] = useState("");

    const { data, loading, error } = useQuery<ProductListResponse>(
        GET_PRODUCTS_LIST_PAGE,
        {
            variables: {
                filter,
                pagination,
            },
        },
    );

    const [loadProductByName, { data: searchData }] =
        useLazyQuery<LoadProductByNameType>(SEARCH_PRODUCT_BY_NAME);

    const searchResult: ProductListItem[] = searchData?.products?.items ?? [];
    const products = data?.products.items ?? [];
    const totalPages = data?.products.totalPages ?? 1;

    const handleStartSellingClick = () => {
        onBoardNavigate("/seller/new");
    };

    const handleToggleCondition = (cond: ProductCondition) => {
        const nextConditions = selectedConditions.includes(cond)
            ? selectedConditions.filter((c) => c !== cond)
            : [...selectedConditions, cond];

        setFilterParams({
            condition: nextConditions.join(","),
            page: "1",
        });
    };

    const handlePriceChange = (_: Event, value: number | number[]) => {
        if (!Array.isArray(value)) return;
        setPriceRange([value[0], value[1]]);
    };

    const handleCategoryClick = (cat: SelectedCategory) => {
        if (!cat.id || cat.id === category) {
            setFilterParams({ category: "", page: "1" });
            return;
        }

        setFilterParams({ category: cat.id, page: "1" });
    };

    const handleSortChange = (e: SelectChangeEvent<string>) => {
        setFilterParams({
            sort: e.target.value,
            page: "1",
        });
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setFilterParams({ page: String(value) });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setFilterParams({ search: searchInputValue, page: "1" });
        setSearchInputValue("");
    };

    const handleSearchSelect = (productId: string) => {
        setSearchInputValue("");
        navigate(`/products/${productId}`);
    };

    const handleClearSearchName = () => {
        setSearchInputValue("");
        setFilterParams({ search: "", page: "1" });
    };

    useDebouncedSearch(searchInputValue, 500, async (search: string) => {
        await loadProductByName({
            variables: {
                pagination: {
                    page: 1,
                    pageSize: DEFAULT_PAGE_SIZE,
                    sortBy: "DATE",
                    sortDirection: "DESC",
                },
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
        [setFilterParams],
    );

    useDebouncedRange(priceRange, 500, onRangeChangeDebounced);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h4" fontWeight={600}>
                        Browse gear & instruments
                    </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                    Guitars, synths, drums, studio gear and more, find the next piece of your setup.
                </Typography>
            </Box>

            {searchName && (
                <Box sx={{ mb: 3, ml: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h4" fontWeight={700}>
                            {searchName}
                        </Typography>
                        <IconButton
                            size="large"
                            aria-label="clear search results"
                            onClick={handleClearSearchName}
                            color="inherit"
                        >
                            <ClearIcon />
                        </IconButton>
                    </Stack>
                </Box>
            )}

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 2 }}>
                    <DashboardSidebar
                        selectedCategoryId={category ?? ""}
                        priceRange={priceRange}
                        selectedConditions={selectedConditions}
                        onCategoryClick={handleCategoryClick}
                        onPriceChange={handlePriceChange}
                        onToggleCondition={handleToggleCondition}
                        onStartSellingClick={handleStartSellingClick}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 9 }}>
                    <DashboardToolbar
                        wrapperRef={wrapperRef}
                        searchInputValue={searchInputValue}
                        setSearchInputValue={setSearchInputValue}
                        handleSearchSubmit={handleSearchSubmit}
                        searchResult={searchResult}
                        isSearchOpen={searchbarClick === "inside"}
                        handleSearchSelect={handleSearchSelect}
                        sort={sort}
                        handleSortChange={handleSortChange}
                        sortOptions={SORT_OPTIONS}
                    />

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
                                Try broadening your search, changing some filters or price range.
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
                                    onClick={() => navigate(`/products/${product.id}`)}
                                />
                            </Grid>
                        ))}
                    </Grid>

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
