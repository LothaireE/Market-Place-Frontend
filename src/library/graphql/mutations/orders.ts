import { gql } from "@apollo/client";

export const CONFIRM_PAYMENT = gql`
    mutation ConfirmPayment($orderIds: [ID!]) {
        confirmPayment(orderIds: $orderIds) {
            orderIds
            orderStatus
            productIds
            productStatus
        }
    }
`;

export const CANCEL_ORDER = gql`
    mutation CancelOrder($orderId: ID!) {
        cancelOrder(orderId: $orderId) {
            orderId
            orderStatus
            productIds
        }
    }
`;

export const CANCEL_ALL_ORDERS = gql`
    mutation CancelAllOrders {
        cancelAllOrders {
            cancelledOrders
            releasedProducts
            productIds
        }
    }
`;

export const CREATE_CHECKOUT = gql`
    mutation CreateCheckout(
        $productIds: [String!]!
        $fulfillmentMethod: FulfillmentMethod!
    ) {
        createCheckout(
            productIds: $productIds
            fulfillmentMethod: $fulfillmentMethod
        ) {
            orders {
                id
                buyerId
                sellerId
                sellerProfile {
                    user {
                        username
                    }
                }
                currency
                status
                fulfillmentMethod
                totalAmount
                createdAt
                orderItems {
                    id
                    productId
                    unitPrice
                    currency
                    product {
                        id
                        name
                        unitPrice
                    }
                }
            }
            stripePublicKey
            clientSecret
        }
    }
`;
