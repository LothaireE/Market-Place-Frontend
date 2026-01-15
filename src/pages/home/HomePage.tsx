import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../../library/graphql/queries/products";
import type { Product } from "../../types/product.type";
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Stack,
    CircularProgress,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HeroBanner from "../../components/hero-banner/HeroBanner";
import SellSection from "../../components/common/SellSection";
import CategoryStrip from "../../components/products/CategoryStrip";
import { useNavigate } from "react-router";
import ProductCard from "../../components/products/ProductCard";

const pagination = {
    page: null,
    pageSize: 8, // null,
    sortBy: "DATE",
    sortDirection: "DESC",
};

export type ProductsQueryResponse = {
    products: {
        totalPages: number;
        totalProducts: number;
        currentPage: number;
        items: Product[];
    };
};

const HomePage = () => {
    const navigate = useNavigate();

    const { loading, error, data } = useQuery<ProductsQueryResponse>(
        GET_PRODUCTS,
        {
            variables: { pagination },
        }
    );

    const goToDetails = (id: string) => {
        navigate(`/products/${id}`);
    };

    return (
        <Box>
            {/* Banner */}
            <HeroBanner />

            {/* Categories */}
            <CategoryStrip />

            {/*  products */}
            <Container maxWidth="lg" sx={{ py: 1 }}>
                <SectionHeader
                    title="Latest finds"
                    subtitle="Discover the newest items posted"
                    actionLabel="See all"
                    onActionClick={() => {
                        navigate("/products");
                    }}
                />

                <Grid container spacing={2} py={1} marginBottom={0}>
                    {data?.products.items.map((product) => {
                        console.log("product dans home page ", product);
                        return (
                            <Grid
                                marginBottom={2}
                                size={{ xs: 6, md: 3 }}
                                key={product.id}
                            >
                                <ProductCard
                                    product={{ ...product }}
                                    onClick={() => goToDetails(product.id)}
                                />
                            </Grid>
                        );
                    })}
                </Grid>
                {loading && (
                    <Box
                        sx={{
                            minHeight: "60vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Box
                        sx={{
                            minHeight: "60vh",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography
                            variant="h5"
                            color="textPrimary"
                            gutterBottom
                        >
                            Something went wrong.
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Please refresh the page or try again later.
                        </Typography>
                    </Box>
                )}
            </Container>

            <SellSection />
        </Box>
    );
};

export default HomePage;

type SectionHeaderProps = {
    title: string;
    subtitle?: string;
    actionLabel?: string;
    onActionClick?: () => void;
};

const SectionHeader = ({
    title,
    subtitle,
    actionLabel,
    onActionClick,
}: SectionHeaderProps) => {
    return (
        <Stack
            direction="row"
            alignItems="baseline"
            justifyContent="space-between"
            sx={{ mb: 2 }}
        >
            <Box>
                <Typography variant="h5" fontWeight={600}>
                    {title}
                </Typography>

                {subtitle && (
                    <Typography variant="body2" color="text.secondary">
                        {subtitle}
                    </Typography>
                )}
            </Box>

            {actionLabel && (
                <Button
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    onClick={onActionClick}
                >
                    {actionLabel}
                </Button>
            )}
        </Stack>
    );
};
