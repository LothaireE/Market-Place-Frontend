import { useQuery, gql } from "@apollo/client";
import { useState } from "react";
import { useParams } from "react-router";
import { Box, Button, CircularProgress, Container } from "@mui/material";
import type { ProductCondition, ProductImage } from "../../types/product.type";
import UpdateProductForm from "../../components/products/UpdateProductForm";
import Toast from "../../components/common/Toast";

type ProductUpdateQueryResponse = {
    product: {
        id: string;
        name: string;
        condition: ProductCondition;
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

const SellerProductEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [editStatus, setEditStatus] = useState<"read" | "edit">("read");

    const { loading, error, data } = useQuery<ProductUpdateQueryResponse>(
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
    const toggleEditStatus = () => {
        if (editStatus === "read") {
            return setEditStatus("edit");
        }
        setEditStatus("read");
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
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
            <Button onClick={toggleEditStatus}>
                toggle edit: {editStatus}
            </Button>
            <Toast
                onOpen={openToast}
                onClose={() => setOpenToast(false)}
                message={toastMessage}
                severity="success"
            />
            <UpdateProductForm
                product={data?.product}
                onSuccess={handleSuccess}
                mode={editStatus}
            />
        </Container>
    );
};

export default SellerProductEditPage;
