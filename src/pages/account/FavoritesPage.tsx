import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Stack,
    Avatar,
    Chip,
    IconButton,
    Button,
    CircularProgress,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import EuroIcon from "@mui/icons-material/Euro";
import { gql, useQuery } from "@apollo/client";
import { useNavigate } from "react-router";
import {
    useCartContext,
    useFavoritesContext,
} from "../../context/useAppContext";
import type { FavoriteProduct } from "../../types/product.type";

const GET_MY_FAVORITES = gql`
    query UserFavorites {
        favorites {
            product {
                id
                name
                price
                condition
                images {
                    name
                    url
                    bytes
                    format
                    height
                    width
                }
                sellerProfile {
                    user {
                        username
                    }
                }
            }
        }
    }
`;

const FavoritesPage = () => {
    const navigate = useNavigate();
    const cart = useCartContext();
    const favorites = useFavoritesContext();

    const { data, loading, error, refetch } = useQuery<{
        favoriteProducts: FavoriteProduct[];
    }>(GET_MY_FAVORITES);

    const handleToggleFavorite = async (productId: string) => {
        await favorites.toggleFavorite(productId);
        // On refetch la liste après modification
        refetch();
    };

    const handleAddToCart = async (product: FavoriteProduct) => {
        await cart.addItem(product, 1);
    };

    const handleViewDetails = (id: string) => {
        navigate(`/products/${id}`);
    };

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

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h5" color="error" gutterBottom>
                    Unable to load your favorites.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Please check your connection and try again.
                </Typography>
            </Container>
        );
    }

    const favoritesList = data?.favoriteProducts ?? [];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <FavoriteIcon color="primary" />
                    <Typography variant="h4" fontWeight={600}>
                        Favorites
                    </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                    All the instruments and music gear you have saved to keep an
                    eye on.
                </Typography>
            </Box>

            {/* Empty state */}
            {favoritesList.length === 0 && (
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
                        You have not added any favorites yet
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        Browse guitars, synths, pedals and studio gear. Tap the
                        heart icon on any listing you like.
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<MusicNoteIcon />}
                        onClick={() => navigate("/products")}
                        sx={{ borderRadius: 999 }}
                    >
                        Explore gear
                    </Button>
                </Paper>
            )}

            {/* Favorites grid */}
            <Grid container spacing={3}>
                {favoritesList.map((product) => (
                    <Grid size={{ xs: 12, md: 6 }} key={product.id}>
                        <Paper
                            elevation={1}
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                display: "flex",
                                gap: 2,
                                alignItems: "flex-start",
                                "&:hover": {
                                    boxShadow: 4,
                                },
                            }}
                        >
                            {/* Image */}
                            <Avatar
                                variant="rounded"
                                src={product.images?.[0]?.url}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 2,
                                    flexShrink: 0,
                                }}
                            >
                                <MusicNoteIcon />
                            </Avatar>

                            {/* Content */}
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                    spacing={1}
                                >
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            variant="h6"
                                            fontWeight={600}
                                            noWrap
                                        >
                                            {product.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            noWrap
                                        >
                                            Seller:{" "}
                                            {
                                                product.sellerProfile.user
                                                    .username
                                            }
                                        </Typography>
                                    </Box>

                                    <IconButton
                                        onClick={() =>
                                            handleToggleFavorite(product.id)
                                        }
                                        sx={{
                                            bgcolor: "action.hover",
                                            "&:hover": {
                                                bgcolor: "action.selected",
                                            },
                                        }}
                                    >
                                        <FavoriteBorderIcon color="error" />
                                    </IconButton>
                                </Stack>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{ mt: 1, mb: 1 }}
                                    alignItems="center"
                                >
                                    <Chip
                                        size="small"
                                        icon={<EuroIcon />}
                                        label={`${product.price} €`}
                                        color="primary"
                                        variant="outlined"
                                    />
                                    <Chip
                                        size="small"
                                        label={product.condition
                                            .toLowerCase()
                                            .replace("_", " ")}
                                        sx={{ textTransform: "capitalize" }}
                                        variant="outlined"
                                    />
                                </Stack>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    justifyContent="flex-end"
                                >
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<ShoppingCartIcon />}
                                        onClick={() => handleAddToCart(product)}
                                        sx={{ borderRadius: 999 }}
                                    >
                                        Add to cart
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="text"
                                        startIcon={<VisibilityIcon />}
                                        onClick={() =>
                                            handleViewDetails(product.id)
                                        }
                                    >
                                        View
                                    </Button>
                                </Stack>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default FavoritesPage;
