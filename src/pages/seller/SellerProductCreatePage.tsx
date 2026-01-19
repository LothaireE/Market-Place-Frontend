import { useState } from "react";
import CreateProductForm from "../../components/forms/CreateProductForm";
import Toast from "../../components/common/Toast";
import type { Category, Product } from "../../types/product.type";
import { Container } from "@mui/material";
import { GET_CATEGORIES } from "../../library/graphql/queries/categories";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router";

const SellerProductFormPage = () => {
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const navigate = useNavigate();

    function handleCreateSuccess(newProduct: Product | null) {
        setToastMessage(`product "${newProduct?.name}" created successfully!`);
        setOpenToast(true);
        setTimeout(() => {
            navigate("/products/" + newProduct?.id);
        }, 2000);
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
