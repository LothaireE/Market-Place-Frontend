import {
    Box,
    Typography,
    CircularProgress,
    Paper,
    Grid,
    Divider,
    ImageList,
    ImageListItem,
    Container,
    Button,
    Chip,
    Stack,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { gql, useQuery } from "@apollo/client";
import { useApi } from "../../hooks/useApi";
import { API_URLS } from "../../config/env";
import type { Product, ProductImage } from "../../types/product.type";

const GET_PRODUCT_BY_ID = gql`
    query Product($id: ID!) {
        product(id: $id) {
            id
            name
            description
            unitPrice
            condition
            sellerProfile {
                user {
                    username
                }
            }
            images {
                publicId
                url
                width
                height
                bytes
                format
                name
            }
        }
    }
`;

type ProductImageGalleryProps = {
    images: ProductImage[];
};

const ProductImageGallery = ({ images }: ProductImageGalleryProps) => {
    if (!images || images.length === 0) {
        return (
            <Box
                sx={{
                    width: "100%",
                    height: 300,
                    borderRadius: 2,
                    border: (theme) => `1px dashed ${theme.palette.divider}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                }}
            >
                <Typography variant="body2">
                    No photos yet. Add photos to make your listing stand out.
                </Typography>
            </Box>
        );
    }

    return (
        <ImageList
            sx={{ width: "100%", maxWidth: 520 }}
            cols={3}
            rowHeight={164}
        >
            {images.map((item) => (
                <ImageListItem key={item.publicId}>
                    <img
                        srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                        alt={item.name}
                        loading="lazy"
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
};

const SellerProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { loading, error, data } = useQuery<{ product: Product }>(
        GET_PRODUCT_BY_ID,
        { variables: { id } }
    );

    const { fetchWithAuth } = useApi();
    const navigate = useNavigate();

    if (loading) {
        return (
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
        );
    }

    if (error || !data?.product) {
        return (
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Typography variant="h5" color="error" gutterBottom>
                    Unable to load this listing.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    The instrument may have been removed or the link is
                    incorrect.
                </Typography>
            </Container>
        );
    }

    const product = data.product;

    const handleDeleteProduct = async () => {
        try {
            const response = await fetchWithAuth(API_URLS.deleteProduct, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id }),
            });

            if (!response.ok) {
                console.error("Delete request failed", response);
            } else {
                console.log("Product deleted", response);
            }
        } catch (err) {
            console.error("Delete error", err);
        } finally {
            setTimeout(() => {
                navigate("/seller/products");
            }, 1500);
        }
    };

    const handleUpdateProduct = () => {
        navigate(`/update-product/${product.id}`);
    };

    const displayCondition = product.condition.toLowerCase().replace("_", " ");

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
                {/* Header  */}
                <Box
                    sx={{
                        mb: 3,
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: "space-between",
                        gap: 1,
                    }}
                >
                    <Box>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            {product.name}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="h5" fontWeight={700}>
                                {product.unitPrice} €
                            </Typography>
                            <Chip
                                label={displayCondition}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ textTransform: "capitalize" }}
                            />
                        </Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            Sold by{" "}
                            <strong>
                                {product.sellerProfile.user.username}
                            </strong>
                        </Typography>
                    </Box>
                </Box>

                <Grid container spacing={4}>
                    <Grid>
                        {/* <Grid item xs={12} md={6}> */}
                        <ProductImageGallery images={product.images || []} />
                    </Grid>

                    <Grid>
                        {/* <Grid item xs={12} md={6}> */}

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Instrument details
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={1.5}>
                                <Typography variant="body2">
                                    <strong>Title:</strong> {product.name}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Condition:</strong>{" "}
                                    {displayCondition}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Price:</strong> {product.unitPrice}{" "}
                                    €
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Seller:</strong>{" "}
                                    {product.sellerProfile.user.username}
                                </Typography>
                            </Stack>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Description
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="body2" color="text.secondary">
                                {product.description ||
                                    "No description provided."}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                mt: 2,
                                p: 2,
                                borderRadius: 2,
                                bgcolor: "background.default",
                                border: (theme) =>
                                    `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                gutterBottom
                            >
                                Seller tools
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                            >
                                Manage this listing: adjust price, update
                                details or remove it from the marketplace.
                            </Typography>
                            <Stack direction="row" spacing={2} flexWrap="wrap">
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleUpdateProduct}
                                >
                                    Edit listing
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleDeleteProduct}
                                >
                                    Delete listing
                                </Button>
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default SellerProductDetailPage;
