import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
    query Products($pagination: PaginationInput!) {
        products(pagination: $pagination) {
            items {
                id
                name
                sellerProfile {
                    user {
                        #   id
                        username
                        email
                    }
                }
            }
            totalPages
            totalProducts
            currentPage
        }
    }
`;

export const GET_PRODUCT_BY_ID = gql`
    query Product($id: ID!) {
        product(id: $id) {
            id
            name
            description
            price
            condition
            # imagesUrl
            sellerProfile {
                user {
                    username
                    # email
                }
            }
            images {
                publicId
                url
                width
                height
                bytes
                format
                name
            }
        }
    }
`;

export const GET_PRODUCTS_HOMEPAGE = gql`
    query Products($pagination: PaginationInput!) {
        products(pagination: $pagination) {
            items {
                name
                id
                price
                description
                condition
                images {
                    bytes
                    format
                    height
                    name
                    publicId
                    url
                    width
                }
                sellerProfile {
                    user {
                        username
                    }
                }
            }
            totalPages
            totalProducts
            currentPage
        }
    }
`;

export const GET_SELLER_PRODUCTS = gql`
    query SellerProducts($pagination: PaginationInput) {
        sellerProducts(pagination: $pagination) {
            name
            id
            color
            condition
            createdAt
            description
            images {
                url
                name
            }
            price
            size
            updatedAt
        }
    }
`;
