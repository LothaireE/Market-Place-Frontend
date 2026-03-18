import { Box, Button, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import type { NewImage } from "../../../types/product.type";
import ImagePreviewList from "./ImagePreviewList";

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

type NewImagesFieldProps = {
    images: NewImage[];
    onAddImages: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: (index: number) => void;
    disabled?: boolean;
    hasError?: boolean;
    errorMessage?: string;
    buttonLabel?: string;
    helperText?: string;
    selectedTitle?: string;
    accept?: string;
};

const NewImagesField = ({
    images,
    onAddImages,
    onRemoveImage,
    disabled = false,
    hasError = false,
    errorMessage = "",
    buttonLabel = "Upload photos",
    helperText = "Add clear photos of the instrument and any accessories.",
    selectedTitle = "Selected photos",
    accept = "image/*",
}: NewImagesFieldProps) => {
    return (
        <Box>
            {!disabled && (
                <Stack spacing={1}>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        sx={{ maxWidth: 320 }}
                    >
                        {buttonLabel}
                        <VisuallyHiddenInput
                            type="file"
                            accept={accept}
                            onChange={onAddImages}
                            multiple
                            disabled={disabled}
                        />
                    </Button>

                    <Typography variant="caption" color="text.secondary">
                        {helperText}
                    </Typography>
                </Stack>
            )}

            {images.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        {selectedTitle}
                    </Typography>

                    <ImagePreviewList
                        images={images}
                        onRemoveImage={onRemoveImage}
                        disabled={disabled}
                    />
                </Box>
            )}

            {hasError && errorMessage && (
                <Typography
                    variant="caption"
                    color="error"
                    sx={{ display: "block", mt: 0.5 }}
                >
                    {errorMessage}
                </Typography>
            )}
        </Box>
    );
};

export default NewImagesField;
