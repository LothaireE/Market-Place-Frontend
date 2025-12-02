import { useQuery, gql } from "@apollo/client";
import Toast from "../components/Toast";
import { useState } from "react";

import { useParams } from "react-router";
import { Box, CircularProgress } from "@mui/material";
import UpdateProductForm from "../components/products/UpdateProductForm";

export type ProductImage = {
    publicId: string;
    url: string;
    width: number;
    height: number;
    bytes: number;
    format: string;
    name: string;
};
export type ProductDetail = {
    id: string;
    name: string;
    condition: "EXCELLENT" | "GOOD" | "CORRECT" | "USED" | "DAMAGED";
    description: string;
    price: number;
    sellerProfile: {
        user: {
            username: string;
            email: string;
        };
    };
    images: [ProductImage];
};

export type ProductDetailQueryResponse = {
    product: ProductDetail;
};

const GET_PRODUCT_BY_ID = gql`
    query Product($id: ID!) {
        product(id: $id) {
            id
            name
            description
            price
            condition
            sellerProfile {
                user {
                    username
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
const UpdateProduct = () => {
    const { id } = useParams<{ id: string }>();
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const { loading, error, data } = useQuery<ProductDetailQueryResponse>(
        GET_PRODUCT_BY_ID,
        { variables: { id } }
    );
    const handleSuccess = () => {
        alert("Product updated successfully!");
        setOpenToast(true);
        setToastMessage(
            `Product "${data?.product.name}" updated successfully!`
        );
    };
    if (error) return <p>Error loading product: {error.message}</p>;
    if (!data?.product) return <p>Product not found</p>;

    return (
        <div>
            {loading && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "50vh",
                    }}
                >
                    <CircularProgress />
                </Box>
            )}

            {!data?.product && <p>Product not found</p>}

            <h1>Update Product {id}</h1>
            <Toast
                onOpen={openToast}
                onClose={() => setOpenToast(false)}
                message={toastMessage}
                severity="success"
            />
            <UpdateProductForm
                product={data?.product}
                onSuccess={handleSuccess}
            />
        </div>
    );
};

export default UpdateProduct;
