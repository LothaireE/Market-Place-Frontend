import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Stack,
    TextField,
    FormControlLabel,
    Typography,
    Checkbox,
    CircularProgress,
    NativeSelect,
    InputLabel,
    Divider,
    Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { capitalizeFirstLetter } from "../../utils/textFormat";
import { API_URLS } from "../../config/env";
import { useApi } from "../../hooks/useApi";
import { useNavigate } from "react-router";
import type { Product, ProductCondition } from "../../types/product.type";
import PriceInput from "../common/PriceInput";

type NewImage = {
    file: File;
    previewUrl: string;
};

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

const conditions: ProductCondition[] = [
    "EXCELLENT",
    "GOOD",
    "CORRECT",
    "USED",
    "DAMAGED",
];

type CreateProductFormProps = {
    onSuccess?: (data: { product: Product }) => void;
};

const CreateProductForm = ({ onSuccess }: CreateProductFormProps) => {
    const { fetchWithAuth } = useApi();
    const navigate = useNavigate();

    const [productName, setProductName] = useState("Fender Stratocaster");
    const [price, setPrice] = useState<number>(450);
    const [condition, setCondition] = useState<ProductCondition>("EXCELLENT");
    const [description, setDescription] = useState(
        "Great sounding guitar, recently set up. Includes gig bag."
    );
    const [brand, setBrand] = useState("Fender"); // stored in `size` field
    const [model, setModel] = useState("Stratocaster"); // stored in `color` field
    const [accept, setAccept] = useState(true);
    const [newImages, setNewImages] = useState<NewImage[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    useEffect(() => {
        // Clean preview URLs on unmount
        return () => {
            newImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
        };
    }, [newImages]);

    const handleChangeCondition = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = event.target.value as ProductCondition;
        setCondition(value);
    };

    const handleAddNewImages = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        if (!files.length) return;

        const mapped = files.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));

        setNewImages((prev) => [...prev, ...mapped]);

        event.target.value = ""; // reset input to select same file again
    };

    const handleRemoveNewImage = (index: number) => {
        setNewImages((prev) => {
            const clone = [...prev];
            const [removed] = clone.splice(index, 1);
            if (removed) URL.revokeObjectURL(removed.previewUrl);
            return clone;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setInfo(null);

        if (!accept) {
            setError(
                "You must accept the terms before publishing your listing."
            );
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();

            newImages.forEach((img) => formData.append("files", img.file));
            formData.append("name", productName);
            formData.append("price", String(price));
            formData.append("condition", condition);
            formData.append("description", description);
            formData.append("size", brand); // backend field reused for brand
            formData.append("color", model); // backend field reused for model

            const response = await fetchWithAuth(API_URLS.createProduct, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Failed to create listing."
                );
            }

            const data = await response.json();

            setInfo("Listing created successfully! Redirecting…");
            onSuccess?.(data.product ?? null);

            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (err) {
            if (err instanceof Error) {
                setError(
                    err.message || "An error occurred while creating listing."
                );
            } else {
                setError("An error occurred while creating listing.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 900, mx: "auto", mt: 3 }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
                    Want to make a few bucks out of your cellar?
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    Describe your instrument or gear as clearly as possible:
                    brand, model, year, condition and included accessories.
                </Typography>

                {/* small preview */}
                <Box
                    sx={{
                        mb: 3,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "background.default",
                        border: (theme) =>
                            `1px dashed ${theme.palette.divider}`,
                    }}
                >
                    <Typography variant="subtitle2" gutterBottom>
                        Preview
                    </Typography>
                    <Typography variant="body2">
                        <strong>{productName}</strong> • {brand} {model} •{" "}
                        {condition} • {price} €
                    </Typography>
                </Box>

                <Box
                    component="form"
                    noValidate
                    sx={{ mt: 1 }}
                    onSubmit={handleSubmit}
                >
                    <Stack spacing={3}>
                        <TextField
                            label="Instrument name"
                            variant="standard"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            fullWidth
                            required
                            helperText='Example: "Fender Stratocaster 1998", "Yamaha P-45 Digital Piano"'
                            id="product-name-input"
                            name="productName"
                        />

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                        >
                            <TextField
                                label="Brand"
                                variant="standard"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                fullWidth
                                id="brand-input"
                                name="productBrand"
                                helperText='Example: "Fender", "Yamaha", "Roland"'
                            />
                            <TextField
                                label="Model / Reference"
                                variant="standard"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                fullWidth
                                id="model-input"
                                name="productModel"
                                helperText='Example: "Stratocaster", "P-45", "TD-17KVX"'
                            />
                        </Stack>

                        <Box>
                            <InputLabel
                                variant="standard"
                                htmlFor="condition-select"
                                required
                                sx={{ mb: 1 }}
                            >
                                Condition
                            </InputLabel>
                            <NativeSelect
                                inputProps={{
                                    name: "condition",
                                    id: "condition-select",
                                }}
                                value={condition}
                                onChange={handleChangeCondition}
                                sx={{ maxWidth: 240 }}
                            >
                                {conditions.map((cond) => (
                                    <option key={cond} value={cond}>
                                        {capitalizeFirstLetter(
                                            cond.toLowerCase()
                                        )}
                                    </option>
                                ))}
                            </NativeSelect>
                        </Box>

                        <TextField
                            id="description-input"
                            label="Description"
                            multiline
                            minRows={3}
                            variant="standard"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            helperText="Mention the condition, how often it was used, if it has been serviced, and what is included (case, cables, pedals, etc.)."
                        />

                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            sx={{ mb: 1 }}
                        >
                            Price
                        </Typography>
                        <PriceInput price={price} handleSetPrice={setPrice} />

                        <Divider sx={{ my: 2 }} />

                        <Box>
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                                sx={{ maxWidth: 320 }}
                            >
                                Upload photos
                                <VisuallyHiddenInput
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAddNewImages}
                                    multiple
                                />
                            </Button>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ ml: 1 }}
                            >
                                Add clear photos of the instrument and any
                                accessories.
                            </Typography>

                            {newImages.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ mb: 1 }}
                                    >
                                        Selected photos
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        flexWrap="wrap"
                                        useFlexGap
                                    >
                                        {newImages.map((img, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    position: "relative",
                                                    width: 120,
                                                    height: 120,
                                                    borderRadius: 1,
                                                    overflow: "hidden",
                                                    border: "1px solid #ddd",
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={img.previewUrl}
                                                    alt={img.file.name}
                                                    sx={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        handleRemoveNewImage(
                                                            index
                                                        )
                                                    }
                                                    sx={{
                                                        position: "absolute",
                                                        top: 2,
                                                        right: 2,
                                                        bgcolor:
                                                            "rgba(0,0,0,0.4)",
                                                        "&:hover": {
                                                            bgcolor:
                                                                "rgba(0,0,0,0.6)",
                                                        },
                                                    }}
                                                >
                                                    <DeleteIcon
                                                        fontSize="small"
                                                        sx={{ color: "white" }}
                                                    />
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            )}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={accept}
                                    onChange={(e) =>
                                        setAccept(e.target.checked)
                                    }
                                    color="primary"
                                />
                            }
                            label="I accept the marketplace terms and conditions."
                        />

                        {error && (
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        )}
                        {info && (
                            <Typography color="primary" variant="body2">
                                {info}
                            </Typography>
                        )}

                        <Box
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading || !accept}
                                sx={{ maxWidth: 260 }}
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress
                                            size={20}
                                            sx={{ mr: 1 }}
                                        />{" "}
                                        Publishing…
                                    </>
                                ) : (
                                    "Publish listing"
                                )}
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
};

export default CreateProductForm;
