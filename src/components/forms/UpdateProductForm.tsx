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
import ClearIcon from "@mui/icons-material/Clear";
import { capitalizeFirstLetter } from "../../utils/textFormat";
import { API_URLS } from "../../config/env";
import { useApi } from "../../hooks/useApi";
import type {
    NewImage,
    ProductCondition,
    ProductImage,
    Category,
} from "../../types/product.type";
import PriceInput from "../common/PriceInput";
import ColorSelector from "./shared/ColorSelector";
import { CONDITIONS } from "../../constants/products";
import ProductFormPreview from "./shared/ProductFormPreview";
import CategorySelectorField from "./shared/CategorySelectorField";
import ExistingImagesField from "./shared/ExistingImagesField";
import NewImagesField from "./shared/NewImagesField";
import FormStatusMessage from "./shared/FormStatusMessage";


type UpdateProductFormProps = {
    product: {
        id: string;
        name: string;
        condition: ProductCondition;
        description: string;
        unitPrice: number;
        sellerProfile: {
            user: {
                username: string;
                email: string;
            };
        };
        images: ProductImage[];
        categories: Category[];
        size?: string | null;
        color?: string | null;
    };
    onSuccess?: (data: unknown) => void;
    mode: "read" | "edit" | "create";
    registeredCategories?: Category[];
};

const UpdateProductForm = ({
    product,
    onSuccess,
    mode,
    registeredCategories = [],
}: UpdateProductFormProps) => {
    const isReadOnly = mode === "read";
    const { fetchWithAuth } = useApi();

    const [productName, setProductName] = useState(product.name);
    const [price, setPrice] = useState<number>(product.unitPrice ?? 0);
    const [condition, setCondition] = useState<ProductCondition>(
        product.condition as ProductCondition,
    );
    const [description, setDescription] = useState(product.description ?? "");
    const [size, setSize] = useState(product.size ?? "");
    const [color, setColor] = useState<string | null>(product.color ?? null);
    const [accept, setAccept] = useState(true);

    const [existingImages, setExistingImages] = useState<ProductImage[]>(
        product.images ?? [],
    );
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<NewImage[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>(
        product.categories ?? [],
    );
    const [categorySelectValue, setCategorySelectValue] = useState("");

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    useEffect(() => {
        setProductName(product.name);
        setPrice(product.unitPrice ?? 0);
        setCondition(product.condition as ProductCondition);
        setDescription(product.description ?? "");
        setExistingImages(product.images ?? []);
        setSelectedCategories(product.categories ?? []);
        setColor(product.color ?? null);
        setSize(product.size ?? "");
        setImagesToDelete([]);
        setNewImages([]);
        setCategorySelectValue("");
        setSubmitted(false);
        setError(null);
        setInfo(null);
    }, [product]);

    useEffect(() => {
        return () => {
            newImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
        };
    }, [newImages]);

    const remainingExistingImages = useMemo(
        () =>
            existingImages.filter(
                (img) => !imagesToDelete.includes(img.publicId),
            ),
        [existingImages, imagesToDelete],
    );

    const requiredFieldErrors = useMemo(
        () => ({
            name: productName.trim().length === 0 ? "Required" : "",
            images:
                remainingExistingImages.length + newImages.length === 0
                    ? "Provide at least one picture of your article."
                    : "",
            price: price <= 0 ? "You must set a price." : "",
            condition: !condition ? "Required" : "",
            categories:
                selectedCategories.length === 0 ? "Required" : "",
            accept: !accept
                ? "You must accept our terms and conditions."
                : "",
        }),
        [
            productName,
            remainingExistingImages.length,
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

    const toggleDeleteExistingImage = (publicId: string) => {
        if (isReadOnly) return;

        setImagesToDelete((prev) =>
            prev.includes(publicId)
                ? prev.filter((id) => id !== publicId)
                : [...prev, publicId],
        );
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
        if (isReadOnly) return;
        setSelectedCategories((prev) => prev.filter((cat) => cat.id !== catId));
    };

    const handleAddNewImages = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isReadOnly) return;

        const files = Array.from(event.target.files ?? []);
        if (!files.length) return;

        const mapped = files.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));

        setNewImages((prev) => [...prev, ...mapped]);
        event.target.value = "";
    };

    const handleRemoveNewImage = (index: number) => {
        if (isReadOnly) return;

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
        if (isReadOnly) return;
        setColor((prev) => (prev === selectedColor ? null : selectedColor));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isReadOnly) return;

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
            formData.append("id", product.id);

            newImages.forEach((img) => {
                formData.append("files", img.file);
            });

            imagesToDelete.forEach((publicId) => {
                formData.append("imagesToRemove", publicId);
            });

            selectedCategories.forEach((cat) => {
                formData.append("categoryIds", cat.id);
            });

            formData.append("name", productName);
            formData.append("unitPrice", String(price));
            formData.append("condition", condition);
            formData.append("description", description);

            if (size.trim()) formData.append("size", size.trim());
            if (color) formData.append("color", color);

            const response = await fetchWithAuth(API_URLS.updateProduct, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                let errorMessage = "Failed to update listing.";

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    // console.log(errorMessage)
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            const infoMessage = data.product ? "Listing successfully updated." : "Something went wrong, please retry later."
            setInfo(infoMessage);
            onSuccess?.(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || "An error occurred during update.");
            } else {
                setError("An error occurred during update.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 900, mx: "auto", mt: 3 }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
                    Update your listing
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    Edit the details of your gear so buyers have the most accurate information.
                </Typography>

                <ProductFormPreview
                    productName={productName}
                    size={size}
                    color={color}
                    condition={condition}
                    price={price}
                    title="Listing preview"
                />

                <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            label="Item name"
                            variant="standard"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            fullWidth
                            required
                            helperText='Example: "Gibson Les Paul Studio", "Roland FP-10 Digital Piano"'
                            id="product-name-input"
                            name="productName"
                            slotProps={{
                                input: {
                                    readOnly: isReadOnly,
                                },
                            }}
                            error={submitted && Boolean(requiredFieldErrors.name)}
                        />

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
                            slotProps={{
                                input: {
                                    readOnly: isReadOnly,
                                },
                            }}
                            disabled={isReadOnly}
                        />

                        <Box id="color-pick" display="flex" flex={1}>
                            <ColorSelector
                                onSelectedColor={handleSelectColor}
                                selectedColor={color}
                                disabled={isReadOnly}
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
                                    disabled={isReadOnly}
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
                                disabled={isReadOnly}
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
                                        {capitalizeFirstLetter(cond.toLowerCase())}
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
                            disabled={isReadOnly}
                        />

                        <TextField
                            id="product-description-input"
                            label="Description"
                            multiline
                            minRows={3}
                            variant="standard"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            helperText="Mention wear and tear, service history, playability, noise issues, and included accessories (case, cables, pedals, etc.)."
                            slotProps={{
                                input: {
                                    readOnly: isReadOnly,
                                },
                            }}
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
                                isDisabled={isReadOnly}
                                handleSetPrice={setPrice}
                                price={price}
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
                                Set a fair price based on condition and current market value.
                            </Typography>
                        </Box>

                        <ExistingImagesField
                            images={existingImages}
                            imagesToDelete={imagesToDelete}
                            onToggleDelete={toggleDeleteExistingImage}
                            disabled={isReadOnly}
                            title="Current photos"
                        />

                        <NewImagesField
                            images={newImages}
                            onAddImages={handleAddNewImages}
                            onRemoveImage={handleRemoveNewImage}
                            disabled={isReadOnly}
                            buttonLabel="Upload new photos"
                            helperText="Add additional photos if needed."
                            selectedTitle="New photos"
                        />

                        {submitted && requiredFieldErrors.images && (
                            <Typography variant="caption" color="error">
                                {requiredFieldErrors.images}
                            </Typography>
                        )}

                        <Divider sx={{ mb: 2 }} />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={accept}
                                    onChange={(e) => setAccept(e.target.checked)}
                                    color="primary"
                                    disabled={isReadOnly}
                                />
                            }
                            label="I confirm that these details are accurate and accept the marketplace terms."
                        />

                        {submitted && requiredFieldErrors.accept && (
                            <Typography variant="caption" color="error">
                                {requiredFieldErrors.accept}
                            </Typography>
                        )}

                        <FormStatusMessage error={error} info={info} />

                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={isReadOnly || loading}
                                sx={{
                                    maxWidth: 260,
                                    mt: 1,
                                }}
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress size={20} sx={{ mr: 1 }} />
                                        Saving…
                                    </>
                                ) : (
                                    "Save changes"
                                )}
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
};

export default UpdateProductForm;
