import { useEffect, useState } from "react";
// import { useAppContext } from "../../context/useAppContext";
// import { useAuthContext } from "../../context/useAppContext";
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
} from "@mui/material";
import { NumberField } from "@base-ui-components/react/number-field";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { capitalizeFirstLetter } from "../../utils/textFormat";
// import {AddIcon, RemoveIcon} from '@mui/icons-material';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { API_URLS } from "../../config/config";
import { useApi } from "../../hooks/useApi";
import { useNavigate } from "react-router";
// import type { ProductImage } from "../../pages/UpdateProduct";
import type { ProductDetail } from "../../pages/Details";

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

type ConditionType = "EXCELLENT" | "GOOD" | "CORRECT" | "USED" | "DAMAGED";

const conditions = ["EXCELLENT", "GOOD", "CORRECT", "USED", "DAMAGED"];

type CreateProductFormProps = {
    onSuccess?: (data: ProductDetail) => void;
};
const CreateProductForm = ({ onSuccess }: CreateProductFormProps) => {
    const { fetchWithAuth } = useApi();
    const navigate = useNavigate();

    const [productName, setProductName] = useState("toto");
    const [price, setPrice] = useState<number>(1);
    const [condition, setCondition] = useState<ConditionType>("EXCELLENT");
    const [description, setDescription] = useState("blablabla");
    const [size, setSize] = useState("xl");
    const [color, setColor] = useState("red");
    const [accept, setAccept] = useState(true);
    const [newImages, setNewImages] = useState<NewImage[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            newImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
        };
    }, [newImages]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value as ConditionType;
        console.log(value);
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
            if (removed) {
                URL.revokeObjectURL(removed.previewUrl);
            }
            return clone;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setInfo(null);

        // if (files && files.length > 5) {
        //     setError("You can upload a maximum of 5 images.");
        //     return;
        // }

        // if (!accept) {
        //     setError("You must accept the terms and conditions.");
        //     return;
        // }

        setLoading(true);

        try {
            const formData = new FormData();

            newImages.forEach((img) => formData.append("files", img.file));
            formData.append("name", productName);
            formData.append("price", String(price));
            formData.append("condition", condition);
            formData.append("description", description);
            formData.append("size", size);
            formData.append("color", color);

            const response = await fetchWithAuth(API_URLS.createProduct, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to register.");
            }
            const data = await response.json();
            console.log({ response });
            console.log("Create product response data :", data);
            setLoading(false);

            setInfo("Product successfuly created!");
            onSuccess?.(data.product ?? null);
        } catch (error) {
            if (error instanceof Error) {
                setError(
                    error.message || "An error occurred during registration."
                );
            } else {
                setError("An error occurred during registration.");
            }
        } finally {
            setLoading(false);
            setTimeout(() => {
                navigate("/");
            }, 2500);
        }
    };

    console.log({ newImages });
    return (
        <Box>
            CreateProductForm
            <Box>
                <Typography component="h1" variant="h5">
                    <ul>
                        <li>Product Name: {productName}</li>
                        <li>Size: {size}</li>
                        <li>Color: {color}</li>
                        <li>Description: {description}</li>
                        <li>Price: {price}</li>
                        <li>Condition: {condition}</li>
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
                        htmlFor="uncontrolled-native"
                        required
                    >
                        Condition
                    </InputLabel>
                    <NativeSelect
                        // defaultValue={30}
                        inputProps={{
                            name: "condition",
                            id: "uncontrolled-native",
                        }}
                        value={condition}
                        onChange={handleChange}
                        sx={{ maxWidth: "fit-content" }}
                    >
                        {conditions.map((cond) => (
                            <option key={cond} value={cond}>
                                {capitalizeFirstLetter(cond)}
                            </option>
                        ))}
                    </NativeSelect>
                    <TextField
                        id="standard-multiline-flexible"
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
                    <Divider sx={{ mb: 2 }} />
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        sx={{ maxWidth: 300, alignSelf: "center" }}
                    >
                        Upload pictures
                        <VisuallyHiddenInput
                            type="file"
                            accept="image/*"
                            onChange={(event) => handleAddNewImages(event)}
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
                                                    bgcolor: "rgba(0,0,0,0.6)",
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
                        disabled={loading}
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
                            "Create Product"
                        )}
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default CreateProductForm;
