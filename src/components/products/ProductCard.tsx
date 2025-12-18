import type { Product } from "../../types/product.type";
import {
    Box,
    Typography,
    Button,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router";
import {
    useAuthContext,
    useFavoritesContext,
} from "../../context/useAppContext";

const ProductCard = (product: Product) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthContext();
    const { favorites, toggleFavorite } = useFavoritesContext();

    const isFav = favorites?.some((fav) => fav.product.id === product.id);

    const handleToggleFavorite = () => {
        if (!isAuthenticated) return;
        toggleFavorite(product.id);
    };

    return (
        <Card
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "none",
                border: (theme) => `1px solid ${theme.palette.divider}`,
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: (theme) => theme.shadows[2],
                },
            }}
        >
            <Box sx={{ position: "relative" }}>
                <CardMedia
                    component="img"
                    height="220"
                    image={product?.images[0]?.url}
                    alt={product.name}
                    sx={{
                        objectFit: "cover",
                        bgcolor: "grey.100",
                    }}
                />

                <IconButton
                    disabled={!isAuthenticated}
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(255,255,255,0.9)",
                        borderRadius: "999px",
                        boxShadow: (theme) => theme.shadows[1],
                        "&:hover": {
                            bgcolor: "common.white",
                        },
                        "&.Mui-disabled": {
                            bgcolor: "rgba(255,255,255,0.6)",
                        },
                    }}
                    size="small"
                    onClick={handleToggleFavorite}
                    aria-label={
                        isFav ? "Remove from favorites" : "Add to favorites"
                    }
                >
                    {isFav ? (
                        <FavoriteIcon
                            fontSize="small"
                            color="error" // rouge primaire
                        />
                    ) : (
                        <FavoriteBorderIcon
                            fontSize="small"
                            sx={{ color: (theme) => theme.palette.grey[500] }}
                        />
                    )}
                </IconButton>
            </Box>

            <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    noWrap
                    gutterBottom
                >
                    {product.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" noWrap>
                    Brand (TODO) • size {product.size}
                </Typography>

                <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 1 }}>
                    {product.price} €
                </Typography>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{
                        borderRadius: 999,
                        textTransform: "none",
                    }}
                    onClick={() => navigate(`/product-details/${product.id}`)}
                >
                    See more
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard;
