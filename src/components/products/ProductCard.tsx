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
import { useNavigate } from "react-router";
import { useFavoritesContext } from "../../context/useAppContext";

const ProductCard = (product: Product) => {
    const { favorites, toggleFavorite } = useFavoritesContext();
    const navigate = useNavigate();

    const isFav = favorites?.includes(product.id);

    return (
        <Card
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                overflow: "hidden",
            }}
        >
            <Box sx={{ position: "relative" }}>
                <CardMedia
                    component="img"
                    height="220"
                    image={product?.images[0]?.url}
                    alt={product.name}
                />
                <IconButton
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: !isFav
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(255, 155, 155, 0.9)",
                        // bgcolor: isFav ? "rgba(255,255,255,0.9)" : "primary",
                        "&:hover": { bgcolor: "common.white" },
                    }}
                    size="small"
                    onClick={() => {
                        console.log("add to fav");
                        toggleFavorite(product.id);
                    }}
                >
                    <FavoriteBorderIcon fontSize="small" />
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
                <Typography variant="body2" color="text.secondary">
                    {/* {product.brand} • size {product.size} */}
                    brand • size {product.size}
                </Typography>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 1 }}>
                    {product.price}
                </Typography>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: 999 }}
                    onClick={() => navigate(`/product-details/${product.id}`)}
                >
                    See more
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard;
