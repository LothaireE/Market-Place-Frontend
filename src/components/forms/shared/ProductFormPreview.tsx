import { Box, Typography } from "@mui/material";
import { capitalizeFirstLetter } from "../../../utils/textFormat";
import type { ProductCondition } from "../../../types/product.type";

type ProductFormPreviewProps = {
    productName: string;
    size?: string | null;
    color?: string | null;
    condition?: ProductCondition | "";
    price: number;
    title?: string;
};

const ProductFormPreview = ({
    productName,
    size,
    color,
    condition,
    price,
    title = "Preview",
}: ProductFormPreviewProps) => {
    const parts = [
        productName.trim() || "Your listing title",
        [size, color].filter(Boolean).join(" "),
        condition
            ? capitalizeFirstLetter(String(condition).toLowerCase())
            : "Condition not set",
        price > 0 ? `${price} €` : "No price yet",
    ].filter(Boolean);

    return (
        <Box
            sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: "background.default",
                border: (theme) => `1px dashed ${theme.palette.divider}`,
            }}
        >
            <Typography variant="subtitle2" gutterBottom>
                {title}
            </Typography>

            <Typography variant="body2">
                {parts.map((part, index) => (
                    <span key={`${part}-${index}`}>
                        {index === 0 ? <strong>{part}</strong> : part}
                        {index < parts.length - 1 ? " • " : ""}
                    </span>
                ))}
            </Typography>
        </Box>
    );
};

export default ProductFormPreview;
