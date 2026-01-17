import { useState } from "react";
import CreateProductForm from "../../components/forms/CreateProductForm";
import Toast from "../../components/common/Toast";
import type { Category, Product } from "../../types/product.type";
import { Container } from "@mui/material";
import { GET_CATEGORIES } from "../../library/graphql/queries/categories";
import { useQuery } from "@apollo/client";

const SellerProductFormPage = () => {
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    function handleCreateSuccess(data: { product: Product }) {
        setToastMessage(
            `product "${data?.product.name}" created successfully!`
        );
        setOpenToast(true);
    }

    // const { loading, error, data } = useQuery<{ categories: Category[] }>(
    const { data } = useQuery<{ categories: Category[] }>(GET_CATEGORIES);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Toast
                onOpen={openToast}
                onClose={() => setOpenToast(false)}
                message={toastMessage}
                severity="success"
            />
            <CreateProductForm
                onSuccess={handleCreateSuccess}
                registeredCategories={data?.categories}
            />
        </Container>
    );
};

export default SellerProductFormPage;
