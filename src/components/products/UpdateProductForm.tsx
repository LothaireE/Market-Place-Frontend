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
} from "@mui/material";
import { NumberField } from "@base-ui-components/react/number-field";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { capitalizeFirstLetter } from "../../utils/textFormat";
import { API_URLS } from "../../config/config";
import { useApi } from "../../hooks/useApi";
import { useNavigate } from "react-router";

import type { ProductDetail, ProductImage } from "../../pages/UpdateProduct";

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

type ConditionType = "EXCELLENT" | "GOOD" | "CORRECT" | "USED" | "DAMAGED";

const conditions: ConditionType[] = [
    "EXCELLENT",
    "GOOD",
    "CORRECT",
    "USED",
    "DAMAGED",
];

type UpdateProductFormProps = {
    product: ProductDetail;
    onSuccess?: (data: unknown) => void;
};

type NewImage = {
    file: File;
    previewUrl: string;
};

const UpdateProductForm = ({ product, onSuccess }: UpdateProductFormProps) => {
    const { fetchWithAuth } = useApi();
    const navigate = useNavigate();

    const [productName, setProductName] = useState(product.name);
    const [price, setPrice] = useState<number>(product.price);
    const [condition, setCondition] = useState<ConditionType>(
        product.condition as ConditionType
    );
    const [description, setDescription] = useState(product.description ?? "");
    const [size, setSize] = useState<string>("");
    const [color, setColor] = useState<string>("");
    const [accept, setAccept] = useState(true);

    const [existingImages, setExistingImages] = useState<ProductImage[]>(
        product.images ?? []
    );
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]); // list of publicId to remove from cloudinay
    const [newImages, setNewImages] = useState<NewImage[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    useEffect(() => {
        // refetch if product changes
        setProductName(product.name);
        setPrice(product.price);
        setCondition(product.condition as ConditionType);
        setDescription(product.description ?? "");
        setExistingImages(product.images ?? []);
    }, [product]);

    useEffect(() => {
        // clean previsualisation urls when component unmount
        return () => {
            newImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
        };
    }, [newImages]);

    const handleChangeCondition = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = event.target.value as ConditionType;
        setCondition(value);
    };

    const toggleDeleteExistingImage = (publicId: string) => {
        setImagesToDelete((prev) =>
            prev.includes(publicId)
                ? prev.filter((id) => id !== publicId)
                : [...prev, publicId]
        );
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
            const cloneNewImages = [...prev];
            const [removed] = cloneNewImages.splice(index, 1);

            if (removed) URL.revokeObjectURL(removed.previewUrl);

            return cloneNewImages;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setInfo(null);
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

            formData.append("name", productName);
            formData.append("price", String(price));
            formData.append("condition", condition);
            formData.append("description", description);
            formData.append("size", size);
            formData.append("color", color);

            const response = await fetchWithAuth(API_URLS.updateProduct, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Failed to update product."
                );
            }

            const data = await response.json();
            setInfo("Product successfully updated!");
            onSuccess?.(data ?? null);

            setTimeout(() => {
                navigate(`/product-details/${product.id}`);
            }, 1500);
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
        <Box>
            <Box>
                <Typography component="h1" variant="h5">
                    <ul>
                        <li>Product Name: {productName}</li>
                        <li>Size: {size}</li>
                        <li>Color: {color}</li>
                        <li>Description: {description}</li>
                        <li>Price: {price}</li>
                        <li>Condition: {condition}</li>
                        <li>
                            Existing images: {existingImages.length} (to delete:{" "}
                            {imagesToDelete.length})
                        </li>
                        <li>New images selected: {newImages.length}</li>
                    </ul>
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
                        label="Name"
                        variant="standard"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        fullWidth
                        required
                        helperText="Name your product"
                        id="product-name-input"
                        name="productName"
                    />

                    <TextField
                        label="Size"
                        variant="standard"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        fullWidth
                        id="size-input"
                        name="productSize"
                    />

                    <TextField
                        label="Color"
                        variant="standard"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        fullWidth
                        id="color-input"
                        name="productColor"
                    />

                    <InputLabel
                        variant="standard"
                        htmlFor="condition-select"
                        required
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
                        sx={{ maxWidth: "fit-content" }}
                    >
                        {conditions.map((cond) => (
                            <option key={cond} value={cond}>
                                {capitalizeFirstLetter(cond)}
                            </option>
                        ))}
                    </NativeSelect>

                    <TextField
                        id="product-description-input"
                        label="Description"
                        multiline
                        maxRows={4}
                        variant="standard"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <InputLabel
                        variant="standard"
                        htmlFor="price-input"
                        required
                    >
                        Price
                    </InputLabel>
                    <NumberField.Root
                        value={price}
                        min={1}
                        max={10000}
                        step={1}
                        onValueChange={(value) => value && setPrice(value)}
                        id="price-input"
                    >
                        <NumberField.ScrubArea>
                            <NumberField.ScrubAreaCursor />
                        </NumberField.ScrubArea>
                        <NumberField.Group>
                            <NumberField.Decrement>
                                <RemoveIcon />
                            </NumberField.Decrement>
                            <NumberField.Input />
                            <NumberField.Increment>
                                <AddIcon />
                            </NumberField.Increment>
                        </NumberField.Group>
                    </NumberField.Root>

                    {/* existing images */}
                    <Box>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Existing pictures
                        </Typography>
                        {existingImages.length === 0 ? (
                            <Typography variant="body2">
                                No existing picture.
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
                                        imagesToDelete.includes(img.publicId);
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
                                                alt={img.name || img.publicId}
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
                                                    bgcolor: "rgba(0,0,0,0.4)",
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
                            <Typography variant="caption">
                                Click on the trash icon to mark / unmark an
                                image for deletion.
                            </Typography>
                        )}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* new images select */}
                    <Box>
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                            sx={{ maxWidth: 300, alignSelf: "center" }}
                        >
                            Upload new pictures
                            <VisuallyHiddenInput
                                type="file"
                                accept="image/*"
                                onChange={handleAddNewImages}
                                multiple
                            />
                        </Button>

                        {newImages.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                    New pictures
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
                                                    handleRemoveNewImage(index)
                                                }
                                                sx={{
                                                    position: "absolute",
                                                    top: 2,
                                                    right: 2,
                                                    bgcolor: "rgba(0,0,0,0.4)",
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

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={accept}
                                onChange={(e) => setAccept(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Accept terms and conditions"
                    />

                    {error && <Typography color="error">{error}</Typography>}
                    {info && <Typography color="primary">{info}</Typography>}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={loading || !accept}
                        sx={{
                            maxWidth: 300,
                            mt: 3,
                            mb: 2,
                            alignSelf: "end",
                        }}
                    >
                        {loading ? (
                            <>
                                <CircularProgress size={20} sx={{ mr: 1 }} />{" "}
                                Processing...
                            </>
                        ) : (
                            "Update Product"
                        )}
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default UpdateProductForm;
