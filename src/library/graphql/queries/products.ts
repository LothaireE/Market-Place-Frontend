import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
    query Products($pagination: PaginationInput!) {
        products(pagination: $pagination) {
            items {
                id
                name
                sellerProfile {
                    user {
                        username
                    }
                }
                unitPrice
                images {
                    publicId
                    url
                    width
                    height
                    bytes
                    format
                    name
                }
                status
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
            unitPrice
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
                categories {
                    name
                }
                condition
                createdAt
                images {
                    bytes
                    format
                    height
                    name
                    publicId
                    url
                    width
                }
                unitPrice
                status
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
            unitPrice
            size
            updatedAt
        }
    }
`;

// export const SEARCH_PRODUCT_BY_NAME = gql`
export const SEARCH_PRODUCT_BY_NAME = gql`
    # and descriptio too
    query Products($pagination: PaginationInput!, $filter: ProductFilterInput) {
        products(pagination: $pagination, filter: $filter) {
            items {
                id
                name
                categories {
                    name
                }
                condition
                createdAt
                images {
                    url
                    bytes
                    publicId
                    height
                    width
                    format
                    name
                }
                unitPrice
                sellerProfile {
                    user {
                        id
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

export const GET_PRODUCTS_LIST_PAGE = gql`
    query Products($filter: ProductFilterInput, $pagination: PaginationInput) {
        products(filter: $filter, pagination: $pagination) {
            items {
                id
                name
                categories {
                    name
                }
                condition
                createdAt
                images {
                    url
                    bytes
                    publicId
                    height
                    width
                    format
                    name
                }
                unitPrice
                status
                sellerProfile {
                    user {
                        id
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
