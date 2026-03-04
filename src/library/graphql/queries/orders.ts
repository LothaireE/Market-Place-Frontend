import { gql } from "@apollo/client";

export const USER_ORDERS = gql`
    query userOrders {
        userOrders {
            items {
                id
                sellerId
                status
                createdAt
                sellerProfile {
                    user {
                        username
                    }
                }
                currency
                totalAmount
                orderItems {
                    id
                    productId
                    currency
                    createdAt
                    unitPrice

                    product {
                        name
                        images {
                            url
                        }
                    }
                }
            }
            total
        }
    }
`;
