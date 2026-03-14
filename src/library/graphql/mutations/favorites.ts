import { gql } from "@apollo/client";

export const ADD_TO_FAVORITES = gql`
    mutation AddToFavorites($productId: String!) {
        addToFavorites(productId: $productId) {
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

export const REMOVE_FROM_FAVORITES = gql`
    mutation RemoveFromFavorites($productId: String!) {
        removeFromFavorites(productId: $productId) {
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

export const CLEAR_FAVORITE = gql`
    mutation clearFavorites {
        clearFavorites {
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
// favorites {
//             product {
//                 id
//                 name
//                 unitPrice
//                 condition
//                 images {
//                     name
//                     url
//                     bytes
//                     format
//                     height
//                     width
//                 }
//                 sellerProfile {
//                     user {
//                         username
//                     }
//                 }
//             }
//         }
