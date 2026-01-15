import { gql, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router";
import type { ProductCondition, ProductImage } from "../../types/product.type";
import DisplayProductDetails from "../../components/products/DisplayProductDetails";
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    IconButton,
    CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const GET_PRODUCT_BY_ID = gql`
    query Product($id: ID!) {
        product(id: $id) {
            id
            name
            description
            price
            condition
            categories {
                name
            }
            createdAt
            images {
                publicId
                url
                width
                height
            }
            sellerProfile {
                id
                user {
                    username
                }
            }
        }
    }
`;

export type ProductDetail = {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    condition: ProductCondition;
    category?: string | null;
    createdAt?: string | null;
    images: ProductImage[];
    sellerProfile: {
        id: string;
        city?: string | null;
        country?: string | null;
        user: {
            username: string;
        };
    };
};

type ProductQueryResponse = {
    product: ProductDetail | null;
};

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // const { isAuthenticated } = useAuthContext();
    // const cart = useCartContext();
    // const favorites = useFavoritesContext();

    const { data, loading, error } = useQuery<ProductQueryResponse>(
        GET_PRODUCT_BY_ID,
        {
            variables: { id },
            // skip: !id,
        }
    );

    const product = data?.product || null;

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box
                    sx={{
                        minHeight: "50vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error || !product) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleGoBack}
                    sx={{ mb: 2 }}
                >
                    Back
                </Button>
                <Paper
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h6" color="error" gutterBottom>
                        We couldn&apos;t find this listing.
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        The instrument may have been sold or removed, or the
                        link might be incorrect.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/products")}
                    >
                        Browse other instruments
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={handleGoBack}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                    Back to listings
                </Typography>
            </Box>

            <DisplayProductDetails {...product} />
        </Container>
    );
};

export default ProductDetailPage;
