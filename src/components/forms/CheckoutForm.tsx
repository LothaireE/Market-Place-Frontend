import { PaymentElement } from "@stripe/react-stripe-js";
import { useEffect, useRef, useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, Typography } from "@mui/material";
import { CLIENT_URL } from "../../config/env";
import type { PaymentIntent } from "@stripe/stripe-js";

type CheckoutFormProps = {
    onSuccess?: (data: PaymentIntent) => void;
    onProcessingChange?: (value: boolean) => void;
};

export default function CheckoutForm({
    onSuccess,
    onProcessingChange,
}: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [isProcessing, setIsProcessing] = useState(false);
    const [succeeded, setSucceeded] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const unmountedRef = useRef(false);

    useEffect(() => {
        // only task is too watch comp unmount
        unmountedRef.current = false;
        return () => {
            unmountedRef.current = true;
        };
    }, []);

    useEffect(() => {
        // tell parent component whether payment is processing
        onProcessingChange?.(isProcessing);
    }, [isProcessing, onProcessingChange]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${CLIENT_URL}/account/orders`,
                },
                redirect: "if_required",
            });

            if (unmountedRef.current) return;

            if (
                error?.type === "card_error" ||
                error?.type === "validation_error"
            ) {
                setMessage(error.message as string);
                return;
            }

            if (paymentIntent && paymentIntent.status === "succeeded") {
                setSucceeded(true);
                setMessage("Payment status: " + paymentIntent.status);
                onSuccess?.(paymentIntent);
                return;
            }
            setMessage(`Payment status: ${paymentIntent?.status ?? "unknown"}`);
        } catch (err) {
            console.error(err);
            if (!unmountedRef.current)
                setMessage("An unexpected error occured.");
        } finally {
            if (!unmountedRef.current) setIsProcessing(false);
        }
    };
    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <Button
                type="submit"
                sx={{ width: "100%", mt: 2, mx: "auto" }}
                variant="contained"
                disabled={isProcessing || !stripe || !elements || succeeded}
                id="submit"
            >
                <Typography id="button-text">
                    {isProcessing ? "Processing ... " : "Pay now"}
                </Typography>
            </Button>
            {/* Show any error or success messages */}
            {message && <div id="payment-message">{message}</div>}
        </form>
    );
}

// const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!stripe || !elements) return;

//         setIsProcessing(true);
//         setError(null);

//         const { error, paymentIntent } = await stripe.confirmPayment({
//             elements,
//             confirmParams: {
//                 return_url: `${CLIENT_URL}/account/orders`,
//             },
//             redirect: "if_required",
//         });

//         if (unmountedRef.current) return;

//         if (
//             error?.type === "card_error" ||
//             error?.type === "validation_error"
//         ) {
//             setMessage(error.message as string);
//         } else if (paymentIntent && paymentIntent.status === "succeeded") {
//             setSucceeded(true);
//             onSuccess?.(paymentIntent);
//             setMessage("Payment status: " + paymentIntent.status);
//         } else {
//             setMessage("An unexpected error occured.");
//         }

//         if (!unmountedRef.current) setIsProcessing(false);

//     };
