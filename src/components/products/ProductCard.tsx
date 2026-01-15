// import type { Product } from "../../../types/product.type";
import {
    Box,
    Typography,
    Button,
    Paper,
    Stack,
    Chip,
    IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import StorefrontIcon from "@mui/icons-material/Storefront";
import {
    useAuthContext,
    useFavoritesContext,
} from "../../context/useAppContext";
import type {
    Category,
    ProductCondition,
    ProductImage,
} from "../../types/product.type";
import Toast from "../common/Toast";
import { useState } from "react";
import { COMMON_MESSAGES } from "../../constants/messages";

type ProductCardProps = {
    product: Product;
    onClick: () => void;
    cardClick?: boolean;
};

type Product = {
    id: string;
    name: string;
    price: number;
    condition: ProductCondition;
    categories?: [Category];
    images: ProductImage[];
    sellerProfile: {
        user: { username: string };
    };
};

const ProductCard = ({
    product,
    onClick,
    cardClick = true,
}: ProductCardProps) => {
    const { isAuthenticated } = useAuthContext();
    const { toggleFavorite, isFavorite } = useFavoritesContext();
    const isFav = isFavorite(product.id);

    const [openToast, setOpenToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");

    const imgUrl = product.images?.[0]?.url;
    const conditionLabel = product.condition
        ? product.condition.toLowerCase().replace("_", " ")
        : "used";

    const handleCardClick = () => {
        if (!cardClick) return;
        onClick();
    };

    const handleToggleFavorite = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation();
        if (!isAuthenticated) {
            return (
                setOpenToast(true),
                setToastMessage(COMMON_MESSAGES.REQUIRE_AUTH)
            );
        } else {
            return toggleFavorite(product.id);
        }
    };

    // const handleSeeMore = (
    //     e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    // ) => {
    //     e.stopPropagation();
    //     onClick();
    // };
    // console.log("Render ProductCard:", product);

    return (
        <Paper
            elevation={1}
            sx={{
                p: 1.5,
                borderRadius: 0,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: cardClick ? "pointer" : "default",
                "&:hover": {
                    boxShadow: 4,
                },
            }}
            onClick={handleCardClick}
        >
            <Toast
                onOpen={openToast}
                onClose={() => setOpenToast(false)}
                message={toastMessage}
                severity="info"
            />
            {/* Image + bouton favoris */}
            <Box
                sx={{
                    // borderRadius: 2,
                    overflow: "hidden",
                    position: "relative",
                    mb: 1.5,
                    bgcolor: "background.default",
                    aspectRatio: "4 / 3",
                }}
            >
                {imgUrl ? (
                    <Box
                        component="img"
                        src={imgUrl}
                        alt={product.name}
                        sx={{
                            width: "100%",
                            height: "100%",
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
                        <MusicNoteIcon />
                    </Box>
                )}

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
                        <FavoriteIcon fontSize="small" color="error" />
                    ) : (
                        <FavoriteBorderIcon
                            fontSize="small"
                            sx={{
                                color: (theme) => theme.palette.grey[500],
                            }}
                        />
                    )}
                </IconButton>
            </Box>

            {/* Infos */}
            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    noWrap
                    sx={{ mb: 0.5 }}
                >
                    {product.name}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    sx={{ mb: 1 }}
                >
                    Seller: {product.sellerProfile?.user?.username ?? "Unknown"}
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
                        label={`${product.price} €`}
                        color="primary"
                        variant="outlined"
                    />
                    {product.condition && (
                        <Chip
                            size="small"
                            label={conditionLabel}
                            variant="outlined"
                            sx={{ textTransform: "capitalize" }}
                        />
                    )}
                </Stack>
            </Box>

            {/* Footer : bouton See more + catégorie */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                {product?.categories?.map((cat) => {
                    return (
                        <Typography
                            key={cat.id}
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                            }}
                        >
                            <StorefrontIcon fontSize="inherit" />
                            {cat.name}
                        </Typography>
                    );
                })}
            </Stack>

            {!cardClick && (
                <Button
                    // sx={{ display: cardClick ? "none" : "block" }}
                    disabled={cardClick}
                    onClick={onClick}
                >
                    See more
                </Button>
            )}
        </Paper>
    );
};

export default ProductCard;
