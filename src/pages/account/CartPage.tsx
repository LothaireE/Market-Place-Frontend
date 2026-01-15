import {
    Avatar,
    Box,
    Button,
    Container,
    Divider,
    Grid,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import EuroIcon from "@mui/icons-material/Euro";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RouterLinkButton from "../../components/common/RouterLinkButton";
import { useCartContext } from "../../context/useAppContext";
import type { CartItem } from "../../types/cart.type";

const CartPage = () => {
    const { cartItems, addItem, removeItem, clearCart } = useCartContext();

    const items: CartItem[] = cartItems ?? [];

    const subtotal = items.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
    );

    // to replace with reel fee operation from back
    const fees = Math.round(subtotal * 0.05); // 5% service & payment fees
    // const shippingEstimate = items.length > 0 ? 12 : 0; // flat estimate
    const shippingEstimate = items.length > 0 ? 12 : 0; // flat estimate
    const total = subtotal + fees + shippingEstimate;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <ShoppingCartIcon color="primary" />
                    <Typography variant="h4" fontWeight={600}>
                        Your cart
                    </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                    Review the instruments and music gear you are about to buy.
                </Typography>
            </Box>

            {items.length === 0 && (
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
                        Your cart is empty
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        Browse guitars, synths, pedals and studio gear, then add
                        them to your cart when you are ready.
                    </Typography>

                    <RouterLinkButton
                        variant="contained"
                        startIcon={<MusicNoteIcon />}
                        sx={{ borderRadius: 999 }}
                        to={"/products"}
                    >
                        Browse instruments
                    </RouterLinkButton>
                </Paper>
            )}

            {items.length > 0 && (
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Stack spacing={2.5}>
                            {items.map((item) => {
                                const product = item.product;
                                const imgUrl = product.images?.[0]?.url;

                                return (
                                    <Paper
                                        key={product.id}
                                        elevation={1}
                                        sx={{
                                            p: 2,
                                            borderRadius: 3,
                                            display: "flex",
                                            gap: 2,
                                            alignItems: "flex-start",
                                        }}
                                    >
                                        <Avatar
                                            variant="rounded"
                                            src={imgUrl}
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: 2,
                                                flexShrink: 0,
                                            }}
                                        >
                                            <MusicNoteIcon />
                                        </Avatar>

                                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight={600}
                                                noWrap
                                            >
                                                {product.name}
                                            </Typography>
                                            {product.sellerProfile && (
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Seller:{" "}
                                                    {
                                                        product.sellerProfile
                                                            .user.username
                                                    }
                                                </Typography>
                                            )}

                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                                sx={{ mt: 1 }}
                                            >
                                                <EuroIcon
                                                    fontSize="small"
                                                    color="action"
                                                />
                                                <Typography variant="body2">
                                                    {product.price.toFixed(2)} €
                                                </Typography>
                                            </Stack>
                                        </Box>

                                        <Stack
                                            spacing={1}
                                            alignItems="flex-end"
                                            sx={{ minWidth: 140 }}
                                        >
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                            >
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        removeItem?.(
                                                            item.product.id
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
                                                    <RemoveIcon fontSize="small" />
                                                </IconButton>
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={item.quantity}
                                                    inputProps={{
                                                        min: 1,
                                                        style: {
                                                            textAlign: "center",
                                                            width: 50,
                                                        },
                                                    }}
                                                    onChange={() => {
                                                        addItem?.(product);
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        addItem?.(item.product)
                                                    }
                                                    sx={{
                                                        bgcolor: "action.hover",
                                                        "&:hover": {
                                                            bgcolor:
                                                                "action.selected",
                                                        },
                                                    }}
                                                >
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>

                                            <Typography
                                                variant="subtitle2"
                                                fontWeight={600}
                                            >
                                                {(
                                                    product.price *
                                                    item.quantity
                                                ).toFixed(2)}{" "}
                                                €
                                            </Typography>

                                            <Button
                                                size="small"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() =>
                                                    removeItem?.(product.id)
                                                }
                                            >
                                                Remove
                                            </Button>
                                        </Stack>
                                    </Paper>
                                );
                            })}

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <Button
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    startIcon={<DeleteIcon />}
                                    onClick={clearCart}
                                >
                                    Clear cart
                                </Button>
                            </Box>
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                position: { md: "sticky" },
                                top: { md: 88 },
                            }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight={600}
                                sx={{ mb: 2 }}
                            >
                                Order summary
                            </Typography>

                            <Stack spacing={1.5} sx={{ mb: 2 }}>
                                <SummaryRow
                                    label="Items subtotal"
                                    value={`${subtotal.toFixed(2)} €`}
                                />
                                <SummaryRow
                                    label="Service & payment fees"
                                    value={`${fees.toFixed(2)} €`}
                                />
                                <SummaryRow
                                    label="Estimated shipping"
                                    value={
                                        shippingEstimate > 0
                                            ? `${shippingEstimate.toFixed(2)} €`
                                            : "-"
                                    }
                                />
                            </Stack>

                            <Divider sx={{ my: 1.5 }} />

                            <SummaryRow
                                label="Total"
                                value={`${total.toFixed(2)} €`}
                                strong
                            />

                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block", mt: 1.5 }}
                            >
                                Final shipping cost and taxes may vary depending
                                on the seller's location and your delivery
                                address.
                            </Typography>

                            <RouterLinkButton
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 3, borderRadius: 999 }}
                                to={"/checkout"}
                            >
                                Go to checkout
                            </RouterLinkButton>

                            <RouterLinkButton
                                variant="text"
                                fullWidth
                                sx={{ mt: 1 }}
                                to={"/products"}
                            >
                                Continue browsing
                            </RouterLinkButton>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

type SummaryRowProps = {
    label: string;
    value: string;
    strong?: boolean;
};

const SummaryRow = ({ label, value, strong }: SummaryRowProps) => {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
        >
            <Typography
                variant="body2"
                color={strong ? "text.primary" : "text.secondary"}
            >
                {label}
            </Typography>
            <Typography
                variant={strong ? "subtitle1" : "body2"}
                fontWeight={strong ? 600 : 400}
            >
                {value}
            </Typography>
        </Stack>
    );
};

export default CartPage;
