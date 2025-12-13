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
    Stack,
    Chip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { gql, useQuery } from "@apollo/client";
// import { useApi } from "../hooks/useApi";
// import { API_URLS } from "../config/env";
import { useCartContext, useFavoritesContext } from "../context/useAppContext";
import type { Product, ProductImage } from "../types/product.type";

const GET_PRODUCT_BY_ID = gql`
    query Product($id: ID!) {
        product(id: $id) {
            id
            name
            description
            price
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

type StandardImageListProps = {
    images: ProductImage[];
};

const StandardImageList = ({ images }: StandardImageListProps) => {
    if (!images.length) return null;

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

const Details = () => {
    const { id } = useParams<{ id: string }>();

    const { loading, error, data } = useQuery<{ product: Product }>(
        GET_PRODUCT_BY_ID,
        { variables: { id } }
    );

    // const { fetchWithAuth } = useApi();
    const navigate = useNavigate();
    const cartContext = useCartContext();
    const favoritesContext = useFavoritesContext();

    if (loading) {
        return (
            <Container
                sx={{ py: 6, display: "flex", justifyContent: "center" }}
            >
                <CircularProgress />
            </Container>
        );
    }

    if (error || !data?.product) {
        return (
            <Container sx={{ py: 6 }}>
                <Typography variant="h5" color="error" gutterBottom>
                    We couldn&apos;t find this gear.
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    It may have been removed or is temporarily unavailable.
                </Typography>
                <Button variant="contained" onClick={() => navigate("/")}>
                    Back to marketplace
                </Button>
            </Container>
        );
    }

    const product = data.product;

    // const handleDeleteProduct = async () => {
    //     try {
    //         const response = await fetchWithAuth(API_URLS.deleteProduct, {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({
    //                 productId: product.id,
    //             }),
    //         });

    //         if (!response.ok) {
    //             console.error("Delete request failed", response);
    //         } else {
    //             console.log("Product deleted", response);
    //         }
    //     } catch (err) {
    //         console.error("Delete error", err);
    //     } finally {
    //         setTimeout(() => {
    //             navigate("/");
    //         }, 1500);
    //     }
    // };

    // const handleUpdateProduct = () => {
    //     navigate(`/update-product/${product.id}`);
    // };

    const handleAddToCart = async () => {
        await cartContext.addItem(product, 1);
    };

    const handleRemoveFromCart = async () => {
        await cartContext.removeItem(product.id);
    };

    const handleClearCart = async () => {
        await cartContext.clearCart();
    };

    const handleToggleFavorite = async () => {
        await favoritesContext.toggleFavorite(product.id);
    };

    const formattedPrice = `${product.price} €`;

    return (
        <Container sx={{ py: 4 }}>
            <Box
                sx={{
                    mb: 3,
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { xs: "flex-start", md: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Second-hand musical gear • Safe & easy selling
                    </Typography>
                </Box>

                {/* <Stack direction="row" spacing={1} flexWrap="wrap">
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
                </Stack> */}
            </Box>

            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Grid container spacing={4}>
                    <Grid size={{ sm: 12, md: 6 }}>
                        {product.images && product.images.length > 0 ? (
                            <StandardImageList images={product.images} />
                        ) : (
                            <Box
                                sx={{
                                    width: "100%",
                                    minHeight: 260,
                                    borderRadius: 2,
                                    border: (theme) =>
                                        `1px dashed ${theme.palette.divider}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: "background.default",
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    No photos available for this instrument yet.
                                </Typography>
                            </Box>
                        )}
                    </Grid>

                    <Grid size={{ sm: 12, md: 6 }}>
                        <Stack spacing={2}>
                            {/* price + condition */}
                            <Box>
                                <Typography variant="h5" fontWeight={700}>
                                    {formattedPrice}
                                </Typography>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{ mt: 1 }}
                                >
                                    <Chip
                                        label={`Condition: ${product.condition.toLowerCase()}`}
                                        size="small"
                                        color="default"
                                        variant="outlined"
                                    />
                                    <Chip
                                        label={`Seller: ${product.sellerProfile.user.username}`}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Stack>
                            </Box>

                            <Divider />

                            {/* description */}
                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    gutterBottom
                                >
                                    Gear description
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {product.description ||
                                        "The seller has not added any description yet."}
                                </Typography>
                            </Box>

                            {/* seller  */}
                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    gutterBottom
                                >
                                    Seller
                                </Typography>
                                <Typography variant="body2">
                                    Username:{" "}
                                    {product.sellerProfile.user.username}
                                </Typography>
                            </Box>

                            <Divider />

                            {/* Cart / favorites actions */}
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleAddToCart}
                                >
                                    Add to cart
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    fullWidth
                                    onClick={handleToggleFavorite}
                                >
                                    Add / remove from favorites
                                </Button>
                            </Stack>

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1}
                                sx={{ mt: 1 }}
                            >
                                <Button
                                    variant="text"
                                    color="secondary"
                                    size="small"
                                    onClick={handleRemoveFromCart}
                                >
                                    Remove from cart
                                </Button>
                                <Button
                                    variant="text"
                                    color="secondary"
                                    size="small"
                                    onClick={handleClearCart}
                                >
                                    Clear cart
                                </Button>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default Details;
