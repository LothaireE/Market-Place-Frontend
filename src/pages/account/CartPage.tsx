import { useMutation, useQuery, gql } from "@apollo/client";
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    Typography,
    Alert,
} from "@mui/material";
import { useNavigate } from "react-router";
import {
    CANCEL_ALL_ORDERS,
    CREATE_CHECKOUT,
} from "../../library/graphql/mutations/orders";
import { useCartContext } from "../../context/useAppContext";
import Toast from "../../components/common/Toast";
import { useMemo, useState } from "react";

const CART_PRODUCTS = gql`
    query ProductsByIds($ids: [ID!]!) {
        productsByIds(ids: $ids) {
            id
            name
            unitPrice
            currency
            status
            sellerProfile {
                id
                user {
                    username
                }
            }
            images {
                url
            }
        }
    }
`;

type CartPageProduct = {
    id: string;
    name: string;
    unitPrice: number;
    currency: string;
    status: string;
    sellerProfile: {
        id: string;
        user: { username: string };
    };
    images: {
        url: string;
    }[];
};

type ToastSeverity = "success" | "error" | "info" | "warning";

export default function CartPage() {
    const { cartItems, removeItem } = useCartContext();
    const navigate = useNavigate();

    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastSeverity, setToastSeverity] = useState<ToastSeverity>("info");

    const itemsIds = useMemo(
        () => cartItems.map((item) => item.productId),
        [cartItems],
    );

    const {
        data,
        loading: productsLoading,
        error: productsError,
    } = useQuery<{ productsByIds: CartPageProduct[] }>(CART_PRODUCTS, {
        variables: { ids: itemsIds },
        skip: itemsIds.length === 0,
        fetchPolicy: "network-only", // avoid cache issues when product availability changes
    });

    const [createCheckout, { loading: checkoutLoading, error: checkoutError }] =
        useMutation(CREATE_CHECKOUT);
    const [cancelAllOrders] = useMutation(CANCEL_ALL_ORDERS);

    const handleCancelAllOrders = async () => {
        const allCancelled = await cancelAllOrders();
        if (allCancelled?.data) {
            console.log(allCancelled.data);
        }
    };

    const products = useMemo(
        () => data?.productsByIds ?? [],
        [data?.productsByIds],
    );

    const totalAmount = useMemo(
        () => products.reduce((sum, p) => sum + Number(p.unitPrice), 0),
        [products],
    );

    const currency = products[0]?.currency ?? "EUR";

    const unavailable = products.filter(
        (p) => p.status && p.status !== "AVAILABLE",
    );

    const canCheckout = unavailable.length === 0 && products.length > 0;

    const sellers = useMemo(() => {
        return Array.from(
            new Map(
                products.map((p) => [p.sellerProfile.id, p.sellerProfile]),
            ).values(),
        );
    }, [products]);

    const productsBySeller = useMemo(() => {
        return sellers.map((seller) => {
            const sellerProducts = products.filter(
                (p) => p.sellerProfile.id === seller.id,
            );
            const amountPerSeller = sellerProducts.reduce(
                (sum, sp) => sum + Number(sp.unitPrice),
                0,
            );

            return {
                sellerId: seller.id,
                sellerUsername: seller.user.username,
                sellerProducts,
                amountPerSeller,
            };
        });
    }, [products, sellers]);

    const handleCheckout = async () => {
        try {
            if (!canCheckout) {
                setToastSeverity("warning");
                setToastMessage("Some items are no longer available.");
                setOpenToast(true);
                return;
            }

            const response = await createCheckout({
                variables: {
                    productIds: itemsIds,
                    fulfillmentMethod: "MEETUP",
                },
            });

            setToastSeverity("success");
            setToastMessage("Checkout created successfully.");
            setOpenToast(true);

            const { orders, paymentUrl, stripePublicKey, clientSecret } =
                await response.data.createCheckout;

            if (orders)
                navigate("/account/confirm-checkout", {
                    state: {
                        orders,
                        paymentUrl,
                        stripePublicKey,
                        clientSecret,
                    },
                });
        } catch (err) {
            console.log("Cart error:", err);
            setToastSeverity("error");
            setToastMessage("Something went wrong while placing orders.");
            setOpenToast(true);
        }
    };

    // const goToCreateCheckout = () => {
    //     navigate("/account/create-checkout", {
    //         state: { products },
    //     });
    // };
    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Cart
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                    mb: 2,
                }}
            >
                <Box
                    sx={{
                        flexGrow: 1,
                        p: 1.5,
                        bgcolor: "background.default",
                        border: (theme) =>
                            `1px dashed ${theme.palette.divider}`,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="subtitle2" gutterBottom>
                        You have {cartItems.length} item(s) in your cart
                    </Typography>

                    <Typography variant="body2">
                        • Estimated amount <strong>{totalAmount}</strong>{" "}
                        {currency}
                    </Typography>

                    {!canCheckout && unavailable.length > 0 && (
                        <Alert severity="warning" sx={{ mt: 1 }}>
                            Some items are no longer available. Please remove
                            them before checkout.
                        </Alert>
                    )}
                </Box>

                <Button
                    variant="contained"
                    onClick={handleCheckout}
                    // onClick={goToCreateCheckout}
                    disabled={checkoutLoading || !canCheckout}
                >
                    {checkoutLoading ? "Processing..." : "Checkout"}
                </Button>

                <Button variant="contained"
                disabled={checkoutLoading || !canCheckout}
                onClick={handleCancelAllOrders}>
                    Cancel all
                </Button>
            </Box>

            <Toast
                onOpen={openToast}
                onClose={() => setOpenToast(false)}
                message={toastMessage}
                severity={toastSeverity}
            />

            {productsLoading && (
                <Box
                    sx={{
                        minHeight: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CircularProgress />
                </Box>
            )}

            {productsError && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {productsError.message}
                </Typography>
            )}

            {!productsLoading && !productsError && (
                <Stack spacing={1}>
                    <Paper sx={{ p: 1.5 }} variant="outlined">
                        {products.length === 0 ? (
                            <Box sx={{ py: 6, textAlign: "center" }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Your cart is currently empty.
                                </Typography>

                                <Button
                                    sx={{ mt: 3 }}
                                    variant="contained"
                                    onClick={() => navigate("/products")}
                                >
                                    Continue shopping
                                </Button>
                            </Box>
                        ) : (
                            productsBySeller.map((pbs) => (
                                <Box key={pbs.sellerId} sx={{ p: 1.5 }}>
                                    <Typography variant="subtitle1">
                                        Seller: {pbs.sellerUsername}
                                    </Typography>
                                    <Typography variant="caption">
                                        Estimated amount: {pbs.amountPerSeller}{" "}
                                        {currency}
                                    </Typography>

                                    {pbs.sellerProducts.map((p, idx) => (
                                        <Box key={p.id} sx={{ pt: 1.5 }}>
                                            <Typography>
                                                {p.name} — {p.unitPrice}{" "}
                                                {p.currency}{" "}
                                                {p.status !== "AVAILABLE"
                                                    ? `(${p.status})`
                                                    : ""}
                                            </Typography>

                                            <Button
                                                size="small"
                                                onClick={() => removeItem(p.id)}
                                            >
                                                Remove
                                            </Button>

                                            {idx !==
                                                pbs.sellerProducts.length -
                                                    1 && (
                                                <Divider sx={{ my: 2 }} />
                                            )}
                                        </Box>
                                    ))}

                                    <Divider sx={{ my: 2 }} />
                                </Box>
                            ))
                        )}
                    </Paper>
                </Stack>
            )}

            {checkoutError && (
                <Typography
                    color="error"
                    variant="caption"
                    sx={{ mt: 2, display: "block" }}
                >
                    {checkoutError.message}
                </Typography>
            )}
        </Box>
    );

    // return (
    //     <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
    //         <Typography variant="h6" gutterBottom>
    //             Cart
    //         </Typography>

    //         <Box
    //             sx={{
    //                 display: "flex",
    //                 justifyContent: "space-between",
    //                 alignItems: "flex-start",
    //                 gap: 2,
    //                 mb: 2,
    //             }}
    //         >
    //             <Box
    //                 sx={{
    //                     flexGrow: 1,
    //                     p: 1.5,
    //                     bgcolor: "background.default",
    //                     border: (theme) =>
    //                         `1px dashed ${theme.palette.divider}`,
    //                     borderRadius: 2,
    //                 }}
    //             >
    //                 <Typography variant="subtitle2" gutterBottom>
    //                     You have {products.length} item(s) in your cart
    //                 </Typography>

    //                 <Typography variant="body2">
    //                     • Estimated amount <strong>{totalAmount}</strong>{" "}
    //                     {currency}
    //                 </Typography>

    //                 {!canCheckout && unavailable.length > 0 && (
    //                     <Alert severity="warning" sx={{ mt: 1 }}>
    //                         Some items are no longer available. Please remove
    //                         them before checkout.
    //                     </Alert>
    //                 )}
    //             </Box>
    //             <Button
    //                 variant="contained"
    //                 onClick={handleCheckout}
    //                 disabled={checkoutLoading || !canCheckout}
    //             >
    //                 {checkoutLoading
    //                     ? "Processing..."
    //                     : sellers.length > 1
    //                     ? "Confirm orders (createCheckout)"
    //                     : "Confirm order (createCheckout)"}
    //             </Button>
    //             <Button
    //                 variant="contained"
    //                 onClick={handleCancelAllOrders}
    //                 // disabled={checkoutLoading || !canCheckout}
    //             >
    //                 Cancel all
    //             </Button>
    //         </Box>

    //         <Toast
    //             onOpen={openToast}
    //             onClose={() => setOpenToast(false)}
    //             message={toastMessage}
    //             severity={toastSeverity}
    //         />

    //         {productsLoading && (
    //             <Box
    //                 sx={{
    //                     minHeight: 200,
    //                     display: "flex",
    //                     alignItems: "center",
    //                     justifyContent: "center",
    //                 }}
    //             >
    //                 <CircularProgress />
    //             </Box>
    //         )}

    //         {productsError && (
    //             <Typography color="error" variant="body2" sx={{ mb: 2 }}>
    //                 {productsError.message}
    //             </Typography>
    //         )}

    //         <Stack spacing={1}>
    //             <Paper sx={{ p: 1.5 }} variant="outlined">
    //                 {productsBySeller.map((pbs) => (
    //                     <Box key={pbs.sellerId} sx={{ p: 1.5 }}>
    //                         <Typography variant="subtitle1">
    //                             Seller: {pbs.sellerUsername}
    //                         </Typography>
    //                         <Typography variant="caption">
    //                             Estimated amount: {pbs.amountPerSeller}{" "}
    //                             {currency}
    //                         </Typography>

    //                         {pbs.sellerProducts.map((p, idx) => (
    //                             <Box key={p.id} sx={{ pt: 1.5 }}>
    //                                 <Typography>
    //                                     {p.name} — {p.unitPrice} {p.currency}{" "}
    //                                     {p.status !== "AVAILABLE"
    //                                         ? `(${p.status})`
    //                                         : ""}
    //                                 </Typography>

    //                                 <Button
    //                                     size="small"
    //                                     onClick={() => removeItem(p.id)}
    //                                 >
    //                                     Remove
    //                                 </Button>

    //                                 {idx !== pbs.sellerProducts.length - 1 && (
    //                                     <Divider sx={{ my: 2 }} />
    //                                 )}
    //                             </Box>
    //                         ))}

    //                         <Divider sx={{ my: 2 }} />
    //                     </Box>
    //                 ))}
    //             </Paper>
    //         </Stack>

    //         {checkoutError && (
    //             <Typography
    //                 color="error"
    //                 variant="caption"
    //                 sx={{ mt: 2, display: "block" }}
    //             >
    //                 {checkoutError.message}
    //             </Typography>
    //         )}
    //     </Box>
    // );
}
