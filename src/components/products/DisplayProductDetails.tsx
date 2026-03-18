import {
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    ImageList,
    ImageListItem,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import {
    useAuthContext,
    useCartContext,
    useFavoritesContext,
} from "../../context/useAppContext";
import type { ProductDetail } from "../../pages/products/ProductDetailPage";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShieldIcon from "@mui/icons-material/Shield";
import { useState } from "react";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { handleDateFormat } from "../../utils/textFormat";

const DetailRow = ({
    label,
    value,
}: {
    label: string;
    value?: string | number | null;
}) => {
    if (!value && value !== 0) return null;
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ py: 0.25 }}
        >
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="caption" fontWeight={500}>
                {value}
            </Typography>
        </Stack>
    );
};

const DisplayProductDetails = (product: ProductDetail) => {
    const { isAuthenticated } = useAuthContext();
    const cart = useCartContext();
    const favorites = useFavoritesContext();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const isFav = favorites.isFavorite(product.id);

    const handleToggleFavorite = async () => {
        if (!product || !isAuthenticated) return;
        await favorites.toggleFavorite(product.id);
    };

    const handleAddToCart = async () => {
        if (!product) return;
        await cart.addItem(product, 1);
    };

    const removeItem = async () => {
        if (!product) return;
        await cart.removeItem(product.id);
    };

    const isInCart = cart.isInCart(product.id);

    const handleToggleCartItem = async () => {
        if (!product) return;
        if (isInCart) {
            await removeItem();
        } else {
            await handleAddToCart();
        }
    };

    const toggleCartLabel = isInCart ? "Remove from cart" : "Add to cart";

    const conditionLabel = product?.condition
        ? product.condition.toLowerCase().replace("_", " ")
        : "";

    // TODO this is also ugly and needs a proper fix
    const mainImageUrl = selectedImage || product?.images?.[0]?.url || null;

    const createdAtToFormat = handleDateFormat(product?.createdAt ?? "");

    const flatCategories = product.categories?.length
        ? product.categories?.map((cat) => cat.name).join(", ")
        : null;

    return (
        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 0 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box
                        sx={{
                            borderRadius: 0,
                            overflow: "hidden",
                            mb: 2,
                            bgcolor: "background.default",
                            aspectRatio: "4 / 3",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {mainImageUrl ? (
                            <Box
                                component="img"
                                src={mainImageUrl}
                                alt={product.name}
                                sx={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "text.secondary",
                                }}
                            >
                                <MusicNoteIcon sx={{ fontSize: 48 }} />
                            </Box>
                        )}
                    </Box>

                    {product.images.length > 1 && (
                        <ImageList cols={4} gap={8} sx={{ maxHeight: 120 }}>
                            {product.images.map((img) => {
                                const isSelected = selectedImage === img.url;
                                return (
                                    <ImageListItem
                                        key={img.publicId}
                                        onClick={() =>
                                            setSelectedImage(img.url)
                                        }
                                        sx={{
                                            cursor: "pointer",
                                            overflow: "hidden",
                                            border: isSelected
                                                ? (theme) =>
                                                      `2px solid ${theme.palette.primary.main}`
                                                : "none",
                                        }}
                                    >
                                        <img
                                            src={`${img.url}?w=120&h=120&fit=crop`}
                                            alt={product.name}
                                            loading="lazy"
                                        />
                                    </ImageListItem>
                                );
                            })}
                        </ImageList>
                    )}
                </Grid>

                {/* Right: main info + actions */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            {product.name}
                        </Typography>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 1 }}
                        >
                            <Chip
                                size="small"
                                // icon={<EuroIcon />}
                                label={`${product.unitPrice} €`}
                                color="primary"
                                variant="filled"
                            />
                            <Chip
                                size="small"
                                label={conditionLabel}
                                variant="outlined"
                                sx={{
                                    textTransform: "capitalize",
                                }}
                            />
                            {product.categories?.map((category) => (
                                <Chip
                                    key={category.id + category.name}
                                    size="small"
                                    label={category.name}
                                    variant="outlined"
                                />
                            ))}
                        </Stack>

                        {product.createdAt && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Listed on {createdAtToFormat}
                                {/* {new Date(
                                        product.createdAt
                                    ).toLocaleDateString()} */}
                            </Typography>
                        )}
                    </Box>

                    {/* Price / actions card */}
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            border: (theme) =>
                                `1px solid ${theme.palette.divider}`,
                            mb: 3,
                        }}
                    >
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{ mb: 1 }}
                        >
                            {product.unitPrice} €
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            Secure checkout and buyer protection for second-hand
                            instruments.
                        </Typography>

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1.5}
                        >
                            <Button
                                variant="contained"
                                fullWidth
                                // onClick={handleAddToCart}
                                onClick={handleToggleCartItem}
                                startIcon={<ShoppingBasketIcon />}
                            >
                                {toggleCartLabel}
                            </Button>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={handleToggleFavorite}
                                startIcon={
                                    isFav ? (
                                        <FavoriteIcon color="error" />
                                    ) : (
                                        <FavoriteBorderIcon />
                                    )
                                }
                                disabled={!isAuthenticated}
                            >
                                {isFav ? "Saved" : "Save"}
                            </Button>
                        </Stack>

                        {!isAuthenticated && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ mt: 1, display: "block" }}
                            >
                                Log in to save favorites and track your
                                watchlist.
                            </Typography>
                        )}
                    </Box>

                    {/* Seller info */}
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "background.default",
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                            sx={{ mb: 1 }}
                        >
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    bgcolor: "primary.main",
                                    color: "primary.contrastText",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 600,
                                }}
                            >
                                {product.sellerProfile.user.username
                                    .charAt(0)
                                    .toUpperCase()}
                            </Box>
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                >
                                    {product.sellerProfile.user.username}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {product.sellerProfile.city &&
                                    product.sellerProfile.country
                                        ? `${product.sellerProfile.city}, ${product.sellerProfile.country}`
                                        : "Private seller"}
                                </Typography>
                            </Box>
                        </Stack>

                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                        >
                            <Stack
                                direction="row"
                                spacing={0.5}
                                alignItems="center"
                            >
                                <LocalShippingIcon
                                    fontSize="small"
                                    color="action"
                                />
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Ships within a few days
                                </Typography>
                            </Stack>
                            <Stack
                                direction="row"
                                spacing={0.5}
                                alignItems="center"
                            >
                                <ShieldIcon fontSize="small" color="action" />
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Buyer protection
                                </Typography>
                            </Stack>
                        </Stack>
                    </Box>
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Description & details */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Description
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ whiteSpace: "pre-line" }}
                    >
                        {product.description ||
                            "No description provided. Feel free to ask the seller for more details about the instrument, its condition and any modifications."}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Infos
                    </Typography>
                    <Stack spacing={0.5}>
                        <DetailRow
                            label="Categories"
                            value={flatCategories || "N/A"}
                        />
                        <DetailRow label="Condition" value={conditionLabel} />
                        <DetailRow label="Listed" value={createdAtToFormat} />
                    </Stack>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default DisplayProductDetails;
