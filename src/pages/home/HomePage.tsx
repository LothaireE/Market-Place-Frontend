import { useQuery } from "@apollo/client";
import { GET_PRODUCTS_HOMEPAGE } from "../../library/graphql/queries/products";
import type { Product } from "../../types/product.type";
import { Box, Container, Typography, Button, Grid, Stack } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HeroBanner from "../../components/hero-banner/HeroBanner";
import SellSection from "../../components/common/SellSection";
import ProductCard from "../../components/products/ProductCard";
import CategoryStrip from "../../components/products/CategoryStrip";
import { useNavigate } from "react-router";

const pagination = {
    page: null,
    pageSize: null,
    sortBy: null,
    sortDirection: null,
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
    const { loading, error, data } = useQuery<ProductsQueryResponse>(
        GET_PRODUCTS_HOMEPAGE,
        { variables: { pagination } }
    );
    const navigate = useNavigate();
    console.log({ loading, error, data });

    return (
        <Box>
            {/* Banner */}
            <HeroBanner />

            {/* Categories */}
            <CategoryStrip />

            {/*  products */}
            <Container maxWidth="lg">
                <SectionHeader
                    title="Latest finds"
                    subtitle="Discover the newest items posted"
                    actionLabel="See all"
                    onActionClick={() => {
                        navigate("/products");
                    }}
                />

                <Grid container spacing={3} py={1}>
                    {data?.products.items.map((product) => (
                        <Grid size={{ xs: 6, md: 3 }} key={product.id}>
                            <ProductCard {...product} />
                        </Grid>
                    ))}
                </Grid>
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
