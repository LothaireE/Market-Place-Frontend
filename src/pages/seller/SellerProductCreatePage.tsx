import { useState } from "react";
import CreateProductForm from "../../components/products/CreateProductForm";
import Toast from "../../components/common/Toast";
import type { Product } from "../../types/product.type";
import { Container } from "@mui/material";

const SellerProductFormPage = () => {
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    function handleCreateSuccess(data: { product: Product }) {
        setToastMessage(
            `product "${data?.product.name}" created successfully!`
        );
        setOpenToast(true);
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Toast
                onOpen={openToast}
                onClose={() => setOpenToast(false)}
                message={toastMessage}
                severity="success"
            />
            <CreateProductForm onSuccess={handleCreateSuccess} />
        </Container>
    );
};

export default SellerProductFormPage;
