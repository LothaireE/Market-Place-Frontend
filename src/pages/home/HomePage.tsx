import { useQuery } from "@apollo/client";
// import DashboardGrid from "../../components/dashboard/DashboardGrid";
import {
    // GET_PRODUCTS,
    GET_PRODUCTS_HOMEPAGE,
} from "../../library/graphql/queries/products";
import type { Product } from "../../types/product.type";
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Chip,
    Stack,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HeroBanner from "../../components/hero-banner/HeroBanner";
import SellSection from "../../components/common/SellSection";
// import AdvantagesStrip from "../../components/advantages/AdvantagesStrip";
import ProductCard from "../../components/products/ProductCard";

const pagination = {
    page: null,
    pageSize: null,
    sortBy: null,
    sortDirection: null,
};

const categories = [
    "Femme",
    "Homme",
    "Enfant",
    "Luxe",
    "Maison",
    "Électronique",
    "Sport",
    "Vintage",
];

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
        { variables: { pagination: pagination } } //page } }
    );

    console.log({ loading, error, data });
    return (
        <Box>
            {/* Hero section */}
            <HeroBanner />

            {/* Catégories */}
            <CategoryStrip />

            {/* Produits mis en avant */}
            {/* <Container maxWidth="lg" sx={{ py: 4 }}> */}
            <Container maxWidth="lg">
                <SectionHeader
                    title="Les dernières pépites"
                    subtitle="Découvre les derniers articles mis en ligne"
                    actionLabel="Voir tout"
                    onActionClick={() => {
                        // navigate("/products")
                    }}
                />

                <Grid container spacing={3}>
                    {data?.products.items.map((product) => (
                        // <Grid key={product.id} item xs={12} sm={6} md={3} >
                        <Grid key={product.id}>
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

const CategoryStrip = () => {
    return (
        <Box
            sx={{
                bgcolor: "background.paper",
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    py: 1.5,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                }}
            >
                {categories.map((cat) => (
                    <Chip
                        key={cat}
                        label={cat}
                        clickable
                        sx={{
                            borderRadius: 999,
                            fontWeight: 500,
                        }}
                        // onClick={() => navigate(`/products?category=${cat}`)}
                    />
                ))}
            </Container>
        </Box>
    );
};

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

// type Product = (typeof mockProducts)[number];
