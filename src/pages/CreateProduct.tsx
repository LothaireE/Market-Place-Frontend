import { useState } from "react";
import CreateProductForm from "../components/products/CreateProductForm";
import Toast from "../components/Toast";
import type { ProductDetail } from "./Details";

const CreateProduct = () => {
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    function handleCreateSuccess(data: ProductDetail) {
        setToastMessage(`product "${data?.name}" created successfully!`);
        setOpenToast(true);
    }

    return (
        <div>
            <Toast
                onOpen={openToast}
                onClose={() => setOpenToast(false)}
                message={toastMessage}
                severity="success"
            />
            <CreateProductForm onSuccess={handleCreateSuccess} />
        </div>
    );
};

export default CreateProduct;
