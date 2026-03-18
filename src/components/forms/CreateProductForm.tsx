import { useEffect, useMemo, useState } from "react";
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
import ColorSelector from "./shared/ColorSelector";
import {
    CONDITIONS,
    ALLOWED_IMAGE_TYPES,
    MAX_FILE_SIZE_BYTES,
    MAX_FILE_SIZE_MB,
    MAX_FILES,
} from "../../constants/products";
import ClearIcon from "@mui/icons-material/Clear";
import ProductFormPreview from "./shared/ProductFormPreview";
import CategorySelectorField from "./shared/CategorySelectorField";
import NewImagesField from "./shared/NewImagesField";
import FormStatusMessage from "./shared/FormStatusMessage";


type CreateProductFormProps = {
    onSuccess?: (product: Product | null) => void;
    registeredCategories?: { id: string; name: string }[];
};

const CreateProductForm = ({
    onSuccess,
    registeredCategories = [],
}: CreateProductFormProps) => {
    const { fetchWithAuth } = useApi();

    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [condition, setCondition] = useState<ProductCondition | "">("");
    const [description, setDescription] = useState("");
    const [size, setSize] = useState("");
    const [color, setColor] = useState<string | null>(null);
    const [accept, setAccept] = useState(false);
    const [newImages, setNewImages] = useState<NewImage[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>(
        [],
    );
    const [categorySelectValue, setCategorySelectValue] = useState("");

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            newImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
        };
    }, [newImages]);

    const requiredFieldErrors = useMemo(
        () => ({
            name: productName.trim().length === 0 ? "Required" : "",
            images:
                newImages.length === 0
                    ? "Provide at least one picture of your article."
                    : "",
            price: price <= 0 ? "You must set a price." : "",
            condition:
                condition === "" ||
                !CONDITIONS.includes(condition as ProductCondition)
                    ? "Required"
                    : "",
            categories: selectedCategories.length === 0 ? "Required" : "",
            accept: !accept ? "You must accept our terms and conditions." : "",
        }),
        [
            productName,
            newImages.length,
            price,
            condition,
            selectedCategories.length,
            accept,
        ],
    );

    const isValid =
        !requiredFieldErrors.name &&
        !requiredFieldErrors.images &&
        !requiredFieldErrors.price &&
        !requiredFieldErrors.condition &&
        !requiredFieldErrors.categories &&
        !requiredFieldErrors.accept;

    const handleChangeCondition = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setCondition(event.target.value as ProductCondition);
    };

    const handleCategorySelect = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const value = event.target.value;

        if (!value) return;

        if (value === "clear") {
            setSelectedCategories([]);
            setCategorySelectValue("");
            return;
        }

        const alreadySelected = selectedCategories.some(
            (cat) => cat.id === value,
        );

        if (alreadySelected) {
            setCategorySelectValue("");
            return;
        }

        const category = registeredCategories.find((cat) => cat.id === value);

        if (category) {
            setSelectedCategories((prev) => [...prev, category]);
            setCategorySelectValue("");
        }
    };

    const handleRemoveCategory = (catId: string) => {
        setSelectedCategories((prev) => prev.filter((cat) => cat.id !== catId));
    };

    const handleAddNewImages = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        if (!files.length) return;

        setError(null);

        const remainingSlots = MAX_FILES - newImages.length;

        if (remainingSlots <= 0) {
            setError(`You can upload up to ${MAX_FILES} images.`);
            event.target.value = "";
            return;
        }

        const filesToProcess = files.slice(0, remainingSlots);
        const rejectedMessages: string[] = [];

        const isDuplicate = (file: File) =>
            newImages.some(
                (img) =>
                    img.file.name === file.name &&
                    img.file.size === file.size &&
                    img.file.lastModified === file.lastModified,
            );

        const validFiles = filesToProcess.filter((file) => {
            if (isDuplicate(file)) {
                rejectedMessages.push(`${file.name} has already been added.`);
                return false;
            }

            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                rejectedMessages.push(
                    `${file.name}: unsupported format (JPG, PNG, WEBP only).`,
                );
                return false;
            }

            if (file.size > MAX_FILE_SIZE_BYTES) {
                rejectedMessages.push(
                    `${file.name}: file is too large (max ${MAX_FILE_SIZE_MB} MB).`,
                );
                return false;
            }

            return true;
        });

        if (files.length > remainingSlots) {
            rejectedMessages.push(
                `Only ${remainingSlots} more image(s) can be added.`,
            );
        }

        const mapped = validFiles.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));

        if (mapped.length > 0) {
            setNewImages((prev) => [...prev, ...mapped]);
        }

        if (rejectedMessages.length > 0) {
            setError(rejectedMessages.join(" "));
        }

        event.target.value = "";
    };

    const handleRemoveNewImage = (index: number) => {
        setNewImages((prev) => {
            const clone = [...prev];
            const [removed] = clone.splice(index, 1);

            if (removed) {
                URL.revokeObjectURL(removed.previewUrl);
            }

            return clone;
        });
    };

    const handleSelectColor = (selectedColor: string) => {
        setColor((prev) => (prev === selectedColor ? null : selectedColor));
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
                formData.append("categoryIds", cat.id),
            );
            formData.append("name", productName);
            formData.append("unitPrice", String(price));
            formData.append("condition", condition);
            formData.append("description", description);

            if (size.trim()) formData.append("size", size.trim());
            if (color) formData.append("color", color);

            const response = await fetchWithAuth(API_URLS.createProduct, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                let errorMessage = "Failed to create listing.";

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    // consolge.log(errorMessage)
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();

            const infoMessage = data.product ? "Listing created successfully." : "Something went wrong, please retry later."
            setInfo(infoMessage);
            onSuccess?.(data.product ?? null);
        } catch (err) {
            if (err instanceof Error) {
                setError(
                    err.message || "An error occurred while creating listing.",
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

                <ProductFormPreview
                    productName={productName}
                    size={size}
                    color={color}
                    condition={condition}
                    price={price}
                    title="Preview"
                />

                <Box
                    component="form"
                    noValidate
                    sx={{ mt: 1 }}
                    onSubmit={handleSubmit}
                >
                    <Stack spacing={3}>
                        <TextField
                            label="Name"
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
                                label="Dimensions"
                                variant="standard"
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                fullWidth
                                id="size-input"
                                name="productSize"
                                helperText='Example: "100x45x12cm"'
                                autoComplete="off"
                            />
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
                                <option disabled value=""></option>
                                {CONDITIONS.map((cond) => (
                                    <option key={cond} value={cond}>
                                        {capitalizeFirstLetter(
                                            cond.toLowerCase(),
                                        )}
                                    </option>
                                ))}
                            </NativeSelect>
                            {submitted && requiredFieldErrors.condition && (
                                <Typography
                                    variant="caption"
                                    color="error"
                                    sx={{ display: "block", mt: 0.5 }}
                                >
                                    {requiredFieldErrors.condition}
                                </Typography>
                            )}
                        </Box>

                        <CategorySelectorField
                            registeredCategories={registeredCategories ?? []}
                            selectedCategories={selectedCategories}
                            categorySelectValue={categorySelectValue}
                            onCategorySelect={(e) => {
                                setCategorySelectValue(e.target.value);
                                handleCategorySelect(e);
                            }}
                            onRemoveCategory={handleRemoveCategory}
                            hasError={submitted && Boolean(requiredFieldErrors.categories)}
                            errorMessage={requiredFieldErrors.categories}
                        />

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

                        <Box sx={{ display: "flex", flexDirection: "column" }}>
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

                        <NewImagesField
                            images={newImages}
                            onAddImages={handleAddNewImages}
                            onRemoveImage={handleRemoveNewImage}
                            hasError={submitted && Boolean(requiredFieldErrors.images)}
                            errorMessage={requiredFieldErrors.images}
                            buttonLabel="Upload photos"
                            helperText="Up to 6 images. JPG, PNG or WEBP. Max 5 MB each."
                            selectedTitle="Selected photos"
                            accept="image/jpeg,image/png,image/webp"
                        />

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

                        <FormStatusMessage error={error} info={info} />

                        <Box
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                sx={{ maxWidth: 260 }}
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress
                                            size={20}
                                            sx={{ mr: 1 }}
                                        />
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
