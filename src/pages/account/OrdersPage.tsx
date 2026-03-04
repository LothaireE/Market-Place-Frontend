import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
    Box,
    Chip,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography,
    Button,
    Avatar,
} from "@mui/material";
import { CANCEL_ORDER } from "../../library/graphql/mutations/orders";
import { USER_ORDERS } from "../../library/graphql/queries/orders";
import type { OrderStatus } from "../../types/order.type";
import { useNavigate } from "react-router";

type UserOrdersResponse = {
    userOrders: {
        total: number;
        items: Array<{
            id: string;
            sellerId: string;
            status: OrderStatus;
            createdAt: string;
            currency: string;
            totalAmount: number;
            sellerProfile?: { user?: { username?: string } };
            orderItems: Array<{
                id: string;
                productId: string;
                currency: string;
                createdAt: string;
                unitPrice: number;
                product?: { name?: string; images?: Array<{ url?: string }> };
            }>;
        }>;
    };
};

// function safeFirstImage(images?: string[] | null) {
//     if (!images || images.length === 0) return null;
//     return images[0] ?? null;
// }

export default function OrdersPage() {
    const navigate = useNavigate();
    const { data, loading, error, refetch } = useQuery<UserOrdersResponse>(
        USER_ORDERS,
        {
            fetchPolicy: "cache-and-network",
        },
    );

    const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>(
        "ALL",
    );

    // optionnel: si tu as cancelOrder
    const [cancelOrder, { loading: cancelling }] = useMutation(CANCEL_ORDER);

    // const orders = data?.userOrders?.items ?? [];
    const orders = useMemo(() => data?.userOrders?.items ?? [], [data]);
    const total = data?.userOrders?.total ?? 0;

    const filteredOrders = useMemo(() => {
        if (statusFilter === "ALL") return orders;
        return orders.filter((o) => o.status === statusFilter);
    }, [orders, statusFilter]);

    const handleCancel = async (orderId: string) => {
        await cancelOrder({ variables: { orderId } });
        await refetch();
    };

    const goToProduct = (productId: string) => {
        navigate(`/products/${productId}`);
    };

    if (loading && !data) return <Box sx={{ p: 2 }}>Loading…</Box>;
    if (error)
        return <Box sx={{ p: 2, color: "crimson" }}>{error.message}</Box>;

    return (
        <Box sx={{ maxWidth: 980, mx: "auto", p: 2 }}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                gap={1}
            >
                <Typography variant="h6">Dashboard • Orders</Typography>

                <Stack direction="row" gap={1} alignItems="center">
                    <Chip label={`${total} total`} />
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            label="Status"
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value as "ALL" | OrderStatus,
                                )
                            }
                        >
                            <MenuItem value="ALL">All</MenuItem>
                            <MenuItem value="PENDING">PENDING</MenuItem>
                            <MenuItem value="PAID">PAID</MenuItem>
                            <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                            <MenuItem value="FAILED">FAILED</MenuItem>
                            <MenuItem value="COMPLETE">COMPLETE</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Stack>

            <Stack spacing={1.5} sx={{ mt: 2 }}>
                {filteredOrders.map((o) => {
                    const sellerUsername =
                        o.sellerProfile?.user?.username ?? o.sellerId;

                    return (
                        <Paper key={o.id} sx={{ p: 2 }}>
                            {/* Header */}
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                justifyContent="space-between"
                                alignItems={{ xs: "flex-start", sm: "center" }}
                                gap={1}
                            >
                                <Box>
                                    <Typography variant="subtitle1">
                                        Order {o.id}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{ display: "block" }}
                                    >
                                        Seller: {sellerUsername}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{ display: "block" }}
                                    >
                                        Created:{" "}
                                        {new Date(o.createdAt).toLocaleString()}
                                    </Typography>
                                </Box>

                                <Stack
                                    direction="row"
                                    gap={1}
                                    alignItems="center"
                                >
                                    <Chip label={o.status} />
                                    <Chip
                                        label={`${o.totalAmount} ${o.currency}`}
                                    />
                                    {o.status === "PENDING" && (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => handleCancel(o.id)}
                                            disabled={cancelling}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </Stack>
                            </Stack>

                            <Divider sx={{ my: 1.5 }} />

                            {/* Items */}
                            <Stack spacing={1}>
                                {o.orderItems.map((orderItem) => {
                                    const name =
                                        orderItem.product?.name ??
                                        orderItem.productId;
                                    const img =
                                        orderItem.product?.images?.[0]?.url ??
                                        null;

                                    return (
                                        <Stack
                                            key={orderItem.id}
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            sx={{
                                                gap: 1,
                                                p: 1,
                                                borderRadius: 1,
                                                cursor: "pointer",
                                                "&:hover": {
                                                    bgcolor: "action.hover",
                                                },
                                            }}
                                            onClick={() =>
                                                goToProduct(orderItem.productId)
                                            }
                                        >
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                gap={1}
                                            >
                                                <Avatar
                                                    variant="rounded"
                                                    src={img ?? undefined}
                                                    sx={{
                                                        width: 44,
                                                        height: 44,
                                                    }}
                                                >
                                                    {/* fallback simple */}
                                                    {name?.[0]?.toUpperCase() ??
                                                        "P"}
                                                </Avatar>

                                                <Box>
                                                    <Typography variant="body2">
                                                        {name}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            display: "block",
                                                        }}
                                                    >
                                                        Product:{" "}
                                                        {orderItem.productId}
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            <Typography variant="body2">
                                                {orderItem.unitPrice}{" "}
                                                {orderItem.currency}
                                            </Typography>
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        </Paper>
                    );
                })}

                {!filteredOrders.length && (
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        No orders for this filter.
                    </Typography>
                )}
            </Stack>
        </Box>
    );
}
