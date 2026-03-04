import { gql } from "@apollo/client";

export const GET_FAVORITES = gql`
    query UserFavorites {
        favorites {
            product {
                id
                name
                unitPrice
                condition
                images {
                    name
                    url
                    bytes
                    format
                    height
                    width
                }
                sellerProfile {
                    user {
                        username
                    }
                }
            }
        }
    }
`;
