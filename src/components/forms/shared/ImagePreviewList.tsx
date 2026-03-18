import { Box, IconButton, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { NewImage } from "../../../types/product.type";

type ImagePreviewListProps = {
    images: NewImage[];
    onRemoveImage?: (index: number) => void;
    disabled?: boolean;
};

const ImagePreviewList = ({
    images,
    onRemoveImage,
    disabled = false,
}: ImagePreviewListProps) => {
    return (
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            {images.map((img, index) => {
                const key = `${img.file.name}-${img.file.size}-${img.file.lastModified}`;

                return (
                    <Box
                        key={key}
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

                        {!disabled && onRemoveImage && (
                            <IconButton
                                size="small"
                                onClick={() => onRemoveImage(index)}
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
                        )}
                    </Box>
                );
            })}
        </Stack>
    );
};

export default ImagePreviewList;
