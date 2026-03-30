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
import EmptyList from "../../components/common/EmptyList";

const GET_MY_FAVORITES = gql`
    query UserFavorites {
        favorites {
            product {
                id
                name
                unitPrice
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
    const { addItem, removeItem, isInCart } = useCartContext();
    const favorites = useFavoritesContext();

    const { data, loading, error, refetch } = useQuery<{
        favorites: FavoriteProduct[];
    }>(GET_MY_FAVORITES);

    const handleToggleFavorite = async (productId: string) => {
        await favorites.toggleFavorite(productId);
        // On refetch la liste après modification
        refetch();
    };

    const handleAddToCart = async (fav: FavoriteProduct) => {
        const alreadyInCart = isInCart(fav.product.id);
        if (alreadyInCart) await removeItem(fav.product.id);
        else await addItem(fav.product, 1);
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

    const favoritesList = data?.favorites ?? [];
    console.log("data", data);
    console.log("favoritesList", favoritesList);

    // favorites[0].product
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
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
                <EmptyList 
                    header="You have not added any favorites yet"
                    textContent="Browse guitars, synths, pedals and studio gear. Tap the heart icon on any listing you like."
                    buttonLabel="Explore gear"
                    handleClick={() => navigate("/products")}
                />
            )}

            <Grid container spacing={3}>
                {favoritesList.map(
                    (fav) => (
                        console.log("fav", fav),
                        (
                            <Grid size={{ xs: 12, md: 6 }} key={fav.product.id}>
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
                                    <Avatar
                                        variant="rounded"
                                        src={fav.product.images?.[0]?.url}
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: 2,
                                            flexShrink: 0,
                                        }}
                                    >
                                        <MusicNoteIcon />
                                    </Avatar>
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
                                                    {fav.product.name}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    noWrap
                                                >
                                                    Seller:{" "}
                                                    {
                                                        fav.product
                                                            .sellerProfile.user
                                                            .username
                                                    }
                                                </Typography>
                                            </Box>

                                            <IconButton
                                                onClick={() =>
                                                    handleToggleFavorite(
                                                        fav.product.id,
                                                    )
                                                }
                                                sx={{
                                                    bgcolor: "action.hover",
                                                    "&:hover": {
                                                        bgcolor:
                                                            "action.selected",
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
                                                label={`${fav.product.unitPrice} €`}
                                                color="primary"
                                                variant="outlined"
                                            />
                                            <Chip
                                                size="small"
                                                label={fav.product.condition
                                                    .toLowerCase()
                                                    .replace("_", " ")}
                                                sx={{
                                                    textTransform: "capitalize",
                                                }}
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
                                                onClick={() =>
                                                    handleAddToCart(fav)
                                                }
                                                sx={{ borderRadius: 999 }}
                                            >
                                                Add to cart
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="text"
                                                startIcon={<VisibilityIcon />}
                                                onClick={() =>
                                                    handleViewDetails(
                                                        fav.product.id,
                                                    )
                                                }
                                            >
                                                View
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Paper>
                            </Grid>
                        )
                    ),
                )}
            </Grid>
        </Container>
    );
};

export default FavoritesPage;
