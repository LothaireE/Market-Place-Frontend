import { Box, IconButton, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { ProductImage } from "../../../types/product.type";

type ExistingImagesFieldProps = {
    images: ProductImage[];
    imagesToDelete: string[];
    onToggleDelete: (publicId: string) => void;
    disabled?: boolean;
    title?: string;
};

const ExistingImagesField = ({
    images,
    imagesToDelete,
    onToggleDelete,
    disabled = false,
    title = "Current photos",
}: ExistingImagesFieldProps) => {
    if (images.length === 0) {
        return (
            <Box>
                <Typography variant="body2">
                    There is currently no picture for this article.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {title}
            </Typography>

            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                {images.map((img) => {
                    const markedForDelete = imagesToDelete.includes(img.publicId);

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
                                opacity: markedForDelete ? 0.4 : 1,
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

                            {!disabled && (
                                <IconButton
                                    size="small"
                                    onClick={() => onToggleDelete(img.publicId)}
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
                                        sx={{
                                            color: markedForDelete ? "red" : "white",
                                        }}
                                    />
                                </IconButton>
                            )}
                        </Box>
                    );
                })}
            </Stack>

            {!disabled && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                    Click the trash icon to mark or unmark a photo for deletion.
                </Typography>
            )}
        </Box>
    );
};

export default ExistingImagesField;
