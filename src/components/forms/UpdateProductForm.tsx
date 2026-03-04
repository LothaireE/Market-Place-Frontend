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
    IconButton,
    Paper,
    Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { capitalizeFirstLetter } from "../../utils/textFormat";
import { API_URLS } from "../../config/env";
import { useApi } from "../../hooks/useApi";
import type {
    NewImage,
    ProductCondition,
    ProductImage,
} from "../../types/product.type";
import PriceInput from "../common/PriceInput";
import CustomAccordion from "../common/CustomAccordion";
import ClearIcon from "@mui/icons-material/Clear";
import type { Category } from "../../types/product.type";
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
        images: [ProductImage];
        categories: [Category];
        size?: string | null;
        color?: string | null;
    };
    onSuccess?: (data: unknown) => void;
    mode: "read" | "edit" | "create";
    registeredCategories?: Category[];
};

//TODO: split, refactorer and all there is t shorten UpdateProductForm now

const UpdateProductForm = ({
    product,
    onSuccess,
    mode,
    registeredCategories,
}: UpdateProductFormProps) => {
    const isReadOnly = mode === "read";
    const { fetchWithAuth } = useApi();

    const [productName, setProductName] = useState(product.name);
    const [price, setPrice] = useState<number>(product.unitPrice ?? 0);
    const [condition, setCondition] = useState<ProductCondition>(
        product.condition as ProductCondition
    );
    const [description, setDescription] = useState(product.description ?? "");
    const [size, setSize] = useState<string | null>(product.size ?? null); // stored in `size` field
    const [color, setColor] = useState<string | null>(product.color ?? null);
    const [accept, setAccept] = useState(true);

    const [existingImages, setExistingImages] = useState<ProductImage[]>(
        product.images ?? []
    );
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<NewImage[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>(
        product.categories ?? []
    );
    const [categorySelectValue, setCategorySelectValue] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    useEffect(() => {
        // refetch if product changes
        setProductName(product.name);
        setPrice(product.unitPrice);
        setCondition(product.condition as ProductCondition);
        setDescription(product.description ?? "");
        setExistingImages(product.images ?? []);
        setSelectedCategories(product.categories ?? []);
        setColor(product.color ?? null);
        setSize(product.size ?? null);
    }, [product]);

    useEffect(() => {
        // clean preview urls when component unmount
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

    const toggleDeleteExistingImage = (publicId: string) => {
        if (isReadOnly) return;
        setImagesToDelete((prev) =>
            prev.includes(publicId)
                ? prev.filter((id) => id !== publicId)
                : [...prev, publicId]
        );
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

        event.target.value = ""; // reset input to select same file again
    };

    const handleRemoveNewImage = (index: number) => {
        setNewImages((prev) => {
            const cloneNewImages = [...prev];
            const [removed] = cloneNewImages.splice(index, 1);

            if (removed) URL.revokeObjectURL(removed.previewUrl);

            return cloneNewImages;
        });
    };

    const handleSelectColor = (selectedColor: string) => {
        if (selectedColor === color) setColor(null);
        else setColor(selectedColor);
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
            selectedCategories.forEach((cat) =>
                formData.append("categoryIds", cat.id)
            );

            formData.append("name", productName);
            formData.append("unitPrice", String(price));
            formData.append("condition", condition);
            formData.append("description", description);
            if (size) formData.append("size", size);
            if (color) formData.append("color", color);

            const response = await fetchWithAuth(API_URLS.updateProduct, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Failed to update listing."
                );
            }

            const data = await response.json();
            setInfo("Listing successfully updated!");
            onSuccess?.(data ?? null);
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
                    Edit the details of your gear so buyers have the most
                    accurate information.
                </Typography>

                {/* Small live preview  to remove later*/}
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
                        Listing preview
                    </Typography>
                    <Typography variant="body2">
                        <strong>{productName}</strong> • {color ?? ""}
                        {size ?? ""} • {capitalizeFirstLetter(condition)} •{" "}
                        {price} €
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
                                slotProps={{
                                    input: {
                                        readOnly: isReadOnly,
                                    },
                                }}
                                disabled={isReadOnly}
                            />
                        </Stack>
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
                                sx={{ maxWidth: "fit-content" }}
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
                            >
                                Category
                            </InputLabel>

                            <NativeSelect
                                disabled={isReadOnly}
                                inputProps={{
                                    name: "category",
                                    id: "category-select",
                                }}
                                value={categorySelectValue}
                                onChange={(e) => {
                                    setCategorySelectValue(e.target.value);
                                    handleCategorySelect(e);
                                    setCategorySelectValue(""); // reset après ajout
                                }}
                                sx={{ maxWidth: 240 }}
                            >
                                <option value="">None</option>

                                {registeredCategories?.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {capitalizeFirstLetter(
                                            cat.name.toLowerCase()
                                        )}
                                    </option>
                                ))}
                            </NativeSelect>

                            <Box
                                sx={{
                                    mt: 1,
                                    display: "flex",
                                    gap: 1,
                                    flexWrap: "wrap",
                                }}
                            >
                                {selectedCategories.map((cat) => (
                                    <Chip
                                        key={cat.id}
                                        label={cat.name}
                                        onDelete={() =>
                                            handleRemoveCategory(cat.id)
                                        }
                                        deleteIcon={<ClearIcon />}
                                        sx={{
                                            borderRadius: 999,
                                            fontWeight: 500,
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
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
                                Set a fair price based on condition and current
                                market value.
                            </Typography>
                        </Box>

                        <Box>
                            {existingImages.length === 0 ? (
                                <Typography variant="body2">
                                    There is currentely no picture for this
                                    article.
                                </Typography>
                            ) : (
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    flexWrap="wrap"
                                    useFlexGap
                                >
                                    {existingImages.map((img) => {
                                        const markedForDelete =
                                            imagesToDelete.includes(
                                                img.publicId
                                            );
                                        return (
                                            <Box
                                                key={img.publicId}
                                                sx={{
                                                    position: "relative",
                                                    width: 120,
                                                    height: 120,
                                                    borderRadius: 1,
                                                    overflow: "hidden",
                                                    border: "1px solid #ddd",
                                                    opacity: markedForDelete
                                                        ? 0.4
                                                        : 1,
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={img.url}
                                                    alt={
                                                        img.name || img.publicId
                                                    }
                                                    sx={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        toggleDeleteExistingImage(
                                                            img.publicId
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
                                                        sx={{
                                                            color: markedForDelete
                                                                ? "red"
                                                                : "white",
                                                        }}
                                                    />
                                                </IconButton>
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            )}
                            {existingImages.length > 0 && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Click the trash icon to mark / unmark a
                                    photo for deletion.
                                </Typography>
                            )}
                        </Box>

                        {/* <Divider sx={{ my: 2 }} /> */}

                        {/* new images select */}
                        <Box>
                            <CustomAccordion open={!isReadOnly}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon />}
                                        sx={{
                                            maxWidth: 320,
                                            alignSelf: "center",
                                        }}
                                        disabled={isReadOnly}
                                    >
                                        Upload new photos
                                        <VisuallyHiddenInput
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAddNewImages}
                                            multiple
                                            disabled={isReadOnly}
                                        />
                                    </Button>
                                </Box>
                            </CustomAccordion>
                            {newImages.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ mb: 1 }}
                                    >
                                        New photos
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

                        <Divider sx={{ mb: 2 }} />
                        {/* <AccordionPic isReadOnly={isReadOnly} />
                        <Divider sx={{ mb: 2 }} /> */}

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={accept}
                                    onChange={(e) =>
                                        setAccept(e.target.checked)
                                    }
                                    color="primary"
                                    disabled={isReadOnly}
                                />
                            }
                            label="I confirm that these details are accurate and accept the marketplace terms."
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
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={isReadOnly || loading || !accept}
                                sx={{
                                    maxWidth: 260,
                                    mt: 1,
                                }}
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress
                                            size={20}
                                            sx={{ mr: 1 }}
                                        />{" "}
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
