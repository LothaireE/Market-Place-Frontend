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
    Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import { capitalizeFirstLetter } from "../../utils/textFormat";
import { API_URLS } from "../../config/env";
import { useApi } from "../../hooks/useApi";
import type {
    Category,
    NewImage,
    Product,
    ProductCondition,
} from "../../types/product.type";
import PriceInput from "../common/PriceInput";
import ColorSelector from "../common/ColorSelector";
import { CONDITIONS } from "../../constants/products";

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

type CreateProductFormProps = {
    onSuccess?: (product: Product) => void;
    registeredCategories?: { id: string; name: string }[];
};

const CreateProductForm = ({
    onSuccess,
    registeredCategories,
}: CreateProductFormProps) => {
    const { fetchWithAuth } = useApi();

    const [productName, setProductName] = useState("Fender Stratocaster");
    const [price, setPrice] = useState<number>(0);
    const [condition, setCondition] = useState<ProductCondition>("EXCELLENT");
    const [description, setDescription] = useState(
        "Great sounding guitar, recently set up. Includes gig bag."
    );
    const [size, setSize] = useState<string | null>(null);
    const [color, setColor] = useState<string | null>(null);
    const [accept, setAccept] = useState(false);
    const [newImages, setNewImages] = useState<NewImage[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>(
        []
    );
    const [categorySelectValue, setCategorySelectValue] = useState("");

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    useEffect(() => {
        // Clean preview URLs on unmount
        return () => {
            newImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
        };
    }, [newImages]);

    const requiredFieldErrors = {
        name: productName.trim().length === 0 ? "Required" : "",
        images:
            newImages.length === 0
                ? "Provide at least one picture of your article"
                : "",
        price: price <= 0 ? "You must set a price" : "",
        condition: !condition ? "Required" : "",
        accept: !accept ? "You must accept our terms and conditions" : "",
    };

    const isValid =
        !requiredFieldErrors.name &&
        !requiredFieldErrors.images &&
        !requiredFieldErrors.price &&
        !requiredFieldErrors.condition &&
        !requiredFieldErrors.accept;

    const handleChangeCondition = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = event.target.value as ProductCondition;
        setCondition(value);
    };

    const handleCategorySelect = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = event.target.value;

        if (!value) return;

        if (value === "clear" && selectedCategories.length)
            setSelectedCategories([]);

        const alreadySelected = selectedCategories.some(
            (cat) => cat.id === value
        );
        if (alreadySelected) return;

        const category = registeredCategories?.find((cat) => cat.id === value);
        if (category) {
            setSelectedCategories((prev) => [...prev, category]);
        }
    };

    const handleRemoveCategory = (catId: string) => {
        setSelectedCategories((prev) => prev.filter((cat) => cat.id !== catId));
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

    const handleSelectColor = (selectedColor: string) => {
        if (selectedColor === color) setColor(null);
        else setColor(selectedColor);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setInfo(null);
        setSubmitted(true);

        if (!isValid) {
            setError("Please fill all required fields.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();

            newImages.forEach((img) => formData.append("files", img.file));
            selectedCategories.forEach((cat) =>
                formData.append("categoryIds", cat.id)
            );
            formData.append("name", productName);
            formData.append("unitPrice", String(price));
            formData.append("condition", condition);
            formData.append("description", description);
            if (size) formData.append("size", size);
            if (color) formData.append("color", color);

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
        } catch (err) {
            if (err instanceof Error) {
                console.log({ err });
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
                        <strong>{productName}</strong> • {size} {color} •{" "}
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
                            error={
                                submitted && Boolean(requiredFieldErrors.name)
                            }
                        />

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                        >
                            <TextField
                                label="Size"
                                variant="standard"
                                value={size ?? ""}
                                onChange={(e) => setSize(e.target.value)}
                                fullWidth
                                id="size-input"
                                name="productSize"
                                helperText='Example: "100x45x12cm"'
                                autoComplete="off"
                            />

                            {/* color picker  */}
                        </Stack>
                        <Box id="color-pick" display="flex" flex={1}>
                            <ColorSelector
                                onSelectedColor={handleSelectColor}
                                selectedColor={color}
                            />
                            {color && (
                                <Chip
                                    label={color}
                                    sx={{
                                        borderRadius: 999,
                                        fontWeight: 500,
                                        ml: 1,
                                    }}
                                    variant="outlined"
                                    onDelete={() => setColor(null)}
                                    deleteIcon={<ClearIcon />}
                                />
                            )}
                        </Box>

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
                                {CONDITIONS.map((cond) => (
                                    <option key={cond} value={cond}>
                                        {capitalizeFirstLetter(
                                            cond.toLowerCase()
                                        )}
                                    </option>
                                ))}
                            </NativeSelect>
                        </Box>
                        <Box>
                            <InputLabel
                                variant="standard"
                                htmlFor="category-select"
                                required
                                sx={{ mb: 1 }}
                            >
                                Category
                            </InputLabel>
                            <NativeSelect
                                inputProps={{
                                    name: "category",
                                    id: "category-select",
                                }}
                                value={categorySelectValue}
                                onChange={(e) => {
                                    setCategorySelectValue(e.target.value);
                                    handleCategorySelect(e);
                                    // setCategorySelectValue(""); // reset après ajout
                                }}
                                sx={{
                                    maxWidth: 240,
                                    mr: 2,
                                    overflow: "hidden",
                                }}
                            >
                                <option value="clear">
                                    {selectedCategories.length
                                        ? "Clear"
                                        : "Select categories"}
                                </option>
                                {registeredCategories?.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {capitalizeFirstLetter(
                                            cat.name.toLowerCase()
                                        )}
                                    </option>
                                ))}
                            </NativeSelect>
                            {selectedCategories.map((cat) => (
                                <Chip
                                    key={cat.id}
                                    label={cat.name}
                                    sx={{
                                        borderRadius: 999,
                                        fontWeight: 500,
                                    }}
                                    onDelete={() =>
                                        handleRemoveCategory(cat.id)
                                    }
                                    deleteIcon={<ClearIcon />}
                                />
                            ))}
                        </Box>
                        <TextField
                            id="description-input"
                            label="Description"
                            multiline
                            minRows={3}
                            variant="standard"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            helperText="Mention wear and tear, service history, playability, noise issues, and included accessories (case, cables, pedals, etc.)."
                        />

                        {/* <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            sx={{ mb: 1 }}
                        >
                            Price
                        </Typography> */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <InputLabel
                                variant="standard"
                                htmlFor="price-input"
                                required
                            >
                                Price (€)
                            </InputLabel>
                            <PriceInput
                                price={price}
                                handleSetPrice={setPrice}
                                isDisabled={false}
                            />
                            {submitted && requiredFieldErrors.price && (
                                <Typography
                                    variant="caption"
                                    color="error"
                                    sx={{ display: "block", mt: 0.5 }}
                                >
                                    {requiredFieldErrors.price}
                                </Typography>
                            )}
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                id="subtext"
                            >
                                Set a fair price based on condition and current
                                market value.
                            </Typography>
                        </Box>

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
                            {submitted && requiredFieldErrors.images && (
                                <Typography
                                    variant="caption"
                                    color="error"
                                    sx={{ display: "block", mt: 0.5 }}
                                >
                                    {requiredFieldErrors.images}
                                </Typography>
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
                                    required
                                />
                            }
                            label="I accept the marketplace terms and conditions."
                        />
                        {submitted && requiredFieldErrors.accept && (
                            <Typography variant="caption" color="error">
                                {requiredFieldErrors.accept}
                            </Typography>
                        )}

                        {error && (
                            <Typography color="error" variant="body2">
                                ici {error}
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
                                disabled={loading || !isValid}
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
