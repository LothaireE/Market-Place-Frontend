import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
    Box,
    Button,
    Divider,
    Paper,
    Stack,
    Typography,
    Chip,
    CircularProgress,
} from "@mui/material";
import {
    CONFIRM_PAYMENT,
    CANCEL_ORDER,
    CANCEL_ALL_ORDERS,
} from "../../library/graphql/mutations/orders";
import { useCartContext } from "../../context/useAppContext";

type UserPendingOrderItem = {
    id: string;
    buyerId: string;
    sellerId: string;
    status: string;
    currency: string;
    totalAmount: number;
    orderItems: {
        id: string;
        product: {
            images: {
                url: string;
            }[];
            name: string;
        };
        unitPrice: number;
        currency: number;
    }[];
    sellerProfile: {
        user: {
            email: string;
            username: string;
        };
    };
    fulfillmentMethod: string;
    createdAt: string;
};
type UserPendingOrders = {
    userPendingOrders: {
        items: UserPendingOrderItem[];
        total: number;
    };
};

const USER_PENDING_ORDERS = gql`
    query userPendingOrders {
        userPendingOrders {
            items {
                id
                buyerId
                sellerId
                status
                currency
                totalAmount
                orderItems {
                    id
                    product {
                        images {
                            url
                        }
                        name
                    }
                    unitPrice
                    currency
                }
                sellerProfile {
                    user {
                        email
                        username
                    }
                }
                fulfillmentMethod
                createdAt
            }
            total
        }
    }
`;
export default function CheckoutPage() {
    const { removeItem } = useCartContext();
    const navigate = useNavigate();

    // const orders: CheckoutOrder[] = location.state?.orders ?? [];
    const [confirmPayment] = useMutation(CONFIRM_PAYMENT);
    const [cancelOrder] = useMutation(CANCEL_ORDER);
    const [cancelAllOrders] = useMutation(CANCEL_ALL_ORDERS);
    const [loadingOrderIds, setLoadingOrderIds] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const {
        data,
        loading: userOrdersLoading,
        error: userOrdersError,
    } = useQuery<UserPendingOrders>(USER_PENDING_ORDERS, {
        // variables: { ids: itemsIds },
        // skip: itemsIds.length === 0,
        fetchPolicy: "network-only", // prevents cache incohérences
    });

    const orders: UserPendingOrderItem[] = useMemo(
        () => data?.userPendingOrders?.items ?? [],
        [data],
    );

    if (userOrdersError)
        setError("Something went wrong, we could not load your orders");

    const ordersTotalAmount = useMemo(
        () => orders.reduce((sum: number, o) => sum + o.totalAmount, 0),
        [orders],
    );

    const currency = orders[0]?.currency ?? "EUR";
    const allOrdersIds = orders.map((o) => o.id);

    const setLoading = (orderId: string, isLoading: boolean) => {
        setLoadingOrderIds((prev) =>
            isLoading
                ? [...prev, orderId]
                : prev.filter((id) => id !== orderId),
        );
    };

    const handleCancelAllOrders = async () => {
        const allCancelled = await cancelAllOrders();
        if (allCancelled?.data) {
            console.log(allCancelled.data);
        }
    };

    const handlePayment = async (orderIds: string[] = allOrdersIds) => {
        setError(null);
        try {
            for (const oId of orderIds) {
                setLoading(oId, true);
                await confirmPayment({
                    variables: { orderId: oId },
                });
                setLoading(oId, false);
                removeItem(oId);
            }

            // navigate("orders");
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            setError(message ?? "Payment failed");
            setLoadingOrderIds([]);
        }
    };

    const cancelOne = async (orderId: string) => {
        setError(null);
        try {
            setLoading(orderId, true);
            await cancelOrder({ variables: { orderId } });
            setLoading(orderId, false);
            // simple: retour vers panier / orders
            navigate("account/orders");
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            setError(message ?? "Cancel failed");
            setLoading(orderId, false);
        }
    };

    return (
        <Box sx={{ maxWidth: 900, mx: "auto", p: 2 }}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography variant="h6">Checkout</Typography>
                <Chip label={`Total: ${ordersTotalAmount} ${currency}`} />
            </Stack>

            {error && (
                <Typography
                    variant="caption"
                    color="error"
                    sx={{ display: "block", mt: 1 }}
                >
                    {error}
                </Typography>
            )}

            <Stack spacing={1.5} sx={{ mt: 2 }}>
                {!orders.length && (
                    <Box sx={{ maxWidth: 900, mx: "auto", p: 2 }}>
                        <Typography>
                            No checkout data. Go back to cart.
                        </Typography>
                        <Button sx={{ mt: 1 }} onClick={() => navigate(-1)}>
                            Back to cart
                        </Button>
                    </Box>
                )}
                {orders.map((o) => {
                    // const orderTotal = o.items.reduce(
                    //     (s, it) => s + it.unitPrice,
                    //     0
                    // );
                    const isLoading = loadingOrderIds.includes(o.id);

                    return (
                        <Paper key={o.id} sx={{ p: 2 }}>
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                justifyContent="space-between"
                                alignItems={{ xs: "flex-start", sm: "center" }}
                                gap={1}
                            >
                                <Box>
                                    <Typography variant="subtitle1">
                                        Seller : {o.sellerProfile.user.username}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        Seller ID: {o.sellerId}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{ display: "block" }}
                                    >
                                        Order {o.id} • {o.status}
                                    </Typography>
                                </Box>

                                <Stack
                                    direction="row"
                                    gap={1}
                                    alignItems="center"
                                >
                                    <Chip
                                        label={`${o.totalAmount} ${currency}`}
                                    />
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => cancelOne(o.id)}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => handlePayment([o.id])}
                                        disabled={isLoading}
                                    >
                                        Pay one
                                    </Button>
                                </Stack>
                            </Stack>

                            <Divider sx={{ my: 1.5 }} />

                            <Stack spacing={0.75}>
                                {o.orderItems.map((it) => {
                                    return (
                                        <Stack
                                            key={it.id}
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Typography variant="body2">
                                                Product: {it.product.name}
                                            </Typography>
                                            <Typography variant="body2">
                                                {it.unitPrice} {it.currency}
                                            </Typography>
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        </Paper>
                    );
                })}
            </Stack>
            {userOrdersLoading && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        py: 4,
                    }}
                >
                    <CircularProgress />
                </Box>
            )}

            <Stack direction="row" gap={1} sx={{ mt: 2 }}>
                <Button
                    variant="contained"
                    onClick={() => handlePayment()}
                    disabled={loadingOrderIds.length > 0}
                >
                    Pay all (MVP)
                </Button>
                <Button variant="contained" onClick={handleCancelAllOrders}>
                    Cancel all
                </Button>
                <Button
                    variant="text"
                    onClick={() => navigate("/account/cart")}
                    disabled={loadingOrderIds.length > 0}
                >
                    Back to cart
                </Button>
            </Stack>
        </Box>
    );
}
