// import { useLocation, useNavigate } from "react-router";
// import { useLocation } from "react-router";
import { useLocation } from "react-router";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Stack,
    Divider,
    Chip,
    Alert,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { gql, useMutation } from "@apollo/client";
// import { useCartContext } from "../../context/useAppContext";
// import RouterLinkButton from "../../components/common/RouterLinkButton";
import CheckoutForm from "../../components/forms/CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import type { PaymentIntent } from "@stripe/stripe-js";
import { useCartContext } from "../../context/useAppContext";
import GoBackButton from "../../components/common/GoBackButton";
import { useLeaveConfirm } from "../../hooks/useLeaveConfirm";

type Order = {
    id: string;
    buyerId: string;
    sellerId: string;
    sellerProfile: {
        user: {
            username: string;
        };
    };
    currency: string;
    status: string;
    fulfillmentMethod: "MEETUP" | "SHIPPING";
    totalAmount: number;
    createdAt: string;
    orderItems: [OrderItem];
};

type OrderItem = {
    id: string;
    productId: string;
    unitPrice: string;
    currency: string;
    product: {
        id: string;
        name: string;
        unitPrice: number;
    };
};

const CONFIRM_PAYMENT = gql`
    mutation ConfirmPayment($orderIds: [ID!], $paymentIntentId: String) {
        confirmPayment(orderIds: $orderIds, paymentIntentId: $paymentIntentId) {
            orderIds
            orderStatus
            productIds
            productStatus
        }
    }
`;

const CANCEL_MULTIPLE_ORDERS = gql`
    mutation CancelMultipleOrders($orderIds: [ID!]) {
        cancelMultipleOrders(orderIds: $orderIds) {
            cancelledOrders
            releasedProducts
            productIds
        }
    }
`;

type ConfirmPaymentPayloads = {
    orderIds: string[];
    orderStatus: "PAID" | "FAILED" | "CANCELLED" | "COMPLETED";
    productIds: string[];
    productStatus: "AVAILABLE" | "RESERVED" | "SOLD";
};

// async function cleanupOnLeave(orderIds : string[]) {
//     const [cancelMultipleOrders] = useMutation(CANCEL_MULTIPLE_ORDERS);

//      await cancelMultipleOrders({
//             variables: {
//                 orderIds,
//             },
//         });
//   // ex:
//   // await api.cancelMultipleOrders(...)
//   // await api.releaseReservation(...)
//   // localStorage.removeItem("draftPayment")
// }

export default function ConfirmPaymentPage() {
    // const navigate = useNavigate();

    const { removeMultipleItems } = useCartContext(); // remove item should receive an array now
    const { state } = useLocation();
    const orders: Order[] = useMemo(() => state?.orders ?? [], [state]);

    const [isProcessing, setIsProcessing] = useState(false);
    const [backendConfirmation, setBackendConfirmation] = useState(false);
    const [finalizing, setFinalizing] = useState(false);

    const stripePublicKey: string | null = useMemo(
        () => state?.stripePublicKey ?? null,
        [state],
    );
    const clientSecret: string | null = useMemo(
        () => state?.clientSecret ?? null,
        [state],
    );

    const stripePromise = useMemo(() => {
        return stripePublicKey ? loadStripe(stripePublicKey) : null;
    }, [stripePublicKey]);

    const [confirmPayment] = useMutation<{
        confirmPayment: ConfirmPaymentPayloads;
    }>(CONFIRM_PAYMENT);

    const [cancelMultipleOrders] = useMutation(CANCEL_MULTIPLE_ORDERS);

    const orderIds: string[] = useMemo(() => orders.map((o) => o.id), [orders]);

    const currency = orders[0]?.currency ?? "EUR";

    const fulfillmentMethods = useMemo(
        () => Array.from(new Set(orders.map((o) => o.fulfillmentMethod))),
        [orders],
    );

    const shippingOrders = orders.filter(
        (o) => o.fulfillmentMethod === "SHIPPING",
    );
    const hasShipping = shippingOrders.length > 0;

    const ordersTotal = useMemo(
        () => orders.reduce((sum: number, o) => sum + o.totalAmount, 0),
        [orders],
    );

    // Exemple de fee
    const shippingFee = hasShipping ? shippingOrders.length * 2.99 : 0;
    const grandTotal = ordersTotal + shippingFee;

    // const removeMultipleItems = (productIds: string[]) => {
    //     for (const pId of productIds) removeItem(pId);
    // };

    const cleanupOnLeave = async () => {
        await cancelMultipleOrders({
            variables: {
                orderIds,
            },
        });
    };

    useLeaveConfirm({
        when: isProcessing || finalizing || !backendConfirmation,
        message: isProcessing
            ? "Payment in progress, leaving the page now may trigger an error."
            : "If you leave this page, your items/orders will be released.",
        onConfirm: async () => await cleanupOnLeave(),
    });

    // const handleSuccess = useCallback<PaymentIntentHandler>(async (successData: PaymentIntent) => {
    const handleSuccess = useCallback(
        async (successData: PaymentIntent) => {
            setFinalizing(true); // stripe successful now awaiting backend confirmation, finalizing
            try {
                const response = await confirmPayment({
                    variables: {
                        orderIds: orderIds,
                        paymentIntentId: successData.id,
                    },
                });
                const productIds =
                    response.data?.confirmPayment?.productIds ?? [];
                if (productIds.length > 0) removeMultipleItems(productIds);
                setBackendConfirmation(true);
            } catch (err) {
                //TODO : handle errror with a cleanup
                const message =
                    err instanceof Error ? err.message : String(err);
                console.log("error message" + message);
            } finally {
                setFinalizing(false);
            }
        },
        [confirmPayment, orderIds, removeMultipleItems],
    );

    useEffect(() => {
        if (!(isProcessing || finalizing || !backendConfirmation)) return;

        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = ""; // legacy feature, and best practice is to trigger the dialog by invoking Event.preventDefault() on the BeforeUnloadEvent object, while also setting returnValue to support legacy cases.
        };

        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isProcessing, finalizing, backendConfirmation]);

    if (!orders || orders.length === 0) {
        return (
            <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
                <Alert severity="error">
                    No orders found. Please return to your cart.
                </Alert>
            </Box>
        );
    }
    return (
        <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
            <GoBackButton />
            <Typography variant="h5" fontWeight={700} gutterBottom>
                Confirm payment
            </Typography>
            {stripePromise && clientSecret && (
                <Stack spacing={3}>
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                        <Elements
                            stripe={stripePromise}
                            options={{ clientSecret }}
                        >
                            <CheckoutForm
                                onSuccess={handleSuccess}
                                onProcessingChange={setIsProcessing}
                            />
                        </Elements>
                    </Paper>
                </Stack>
            )}

            <Stack spacing={3}>
                {/* ORDERS */}
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Orders
                    </Typography>

                    <Stack spacing={2}>
                        {orders.map((o) => (
                            <Paper key={o.id} variant="outlined" sx={{ p: 2 }}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                    mb={1}
                                >
                                    <Box>
                                        <Typography fontWeight={700}>
                                            Seller:{" "}
                                            {o.sellerProfile?.user?.username ??
                                                o.sellerId}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Order ID: {o.id.slice(0, 8)}
                                        </Typography>
                                    </Box>

                                    <Chip
                                        size="small"
                                        icon={
                                            o.fulfillmentMethod ===
                                            "SHIPPING" ? (
                                                <LocalShippingIcon />
                                            ) : (
                                                <StorefrontIcon />
                                            )
                                        }
                                        label={o.fulfillmentMethod}
                                        variant="outlined"
                                    />
                                </Stack>

                                <Divider sx={{ my: 1 }} />

                                <Stack spacing={1}>
                                    {o.orderItems.map((it) => (
                                        <Box
                                            key={it.id}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                gap: 2,
                                            }}
                                        >
                                            <Typography>
                                                {it.product?.name ??
                                                    it.productId}
                                            </Typography>
                                            <Typography fontWeight={600}>
                                                {it.unitPrice} {it.currency}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>

                                <Divider sx={{ my: 1 }} />

                                <Typography fontWeight={700}>
                                    Total: {o.totalAmount} {o.currency}
                                </Typography>
                            </Paper>
                        ))}
                    </Stack>
                </Paper>

                {/* DELIVERY */}
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Delivery
                    </Typography>

                    <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                        {fulfillmentMethods.map((m, idx) => {
                            return (
                                <Chip
                                    key={m ?? idx}
                                    icon={
                                        m === "SHIPPING" ? (
                                            <LocalShippingIcon />
                                        ) : (
                                            <StorefrontIcon />
                                        )
                                    }
                                    label={m ?? idx}
                                    variant="outlined"
                                />
                            );
                        })}
                    </Stack>

                    {hasShipping ? (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                gutterBottom
                            >
                                Shipping address
                            </Typography>
                        </>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Meetup selected — no shipping address required.
                        </Typography>
                    )}
                </Paper>

                {/* SUMMARY */}
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Summary
                    </Typography>

                    <Stack spacing={1}>
                        <SummaryRow
                            label={`Orders (${orders.length})`}
                            value={`${ordersTotal} ${currency}`}
                        />
                        <SummaryRow
                            label={
                                hasShipping
                                    ? `Shipping (${shippingOrders.length})`
                                    : "Meetup"
                            }
                            value={`${shippingFee} ${currency}`}
                        />
                        <Divider />
                        <SummaryRow
                            label="Total"
                            value={`${grandTotal} ${currency}`}
                            bold
                        />
                    </Stack>
                    {/* {paymentUrl && (
                        <RouterLinkButton
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2 }}
                            disabled={!canSubmit || !paymentUrl}
                            to={paymentUrl}
                        >
                            Confirm & pay
                        </RouterLinkButton>
                    )} */}

                    {/* <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2 }}
                        disabled={!canSubmit || !paymentUrl}
                        onClick={() => {
                            // TODO: payment / confirmation
                            handlePayment();
                            // navigate("/account");
                        }}
                    >
                        Confirm & pay
                    </Button> */}
                </Paper>
            </Stack>
        </Box>
    );
}

function SummaryRow({
    label,
    value,
    bold,
}: {
    label: string;
    value: string;
    bold?: boolean;
}) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: bold ? 700 : 400,
            }}
        >
            <Typography>{label}</Typography>
            <Typography>{value}</Typography>
        </Box>
    );
}
