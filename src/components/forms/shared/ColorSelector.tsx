import { Box, Grid } from "@mui/material";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";

type ColorOption = { name: string; value: string };

const COLORS: ColorOption[] = [
    { name: "White", value: "#F9FAFB" },
    { name: "Black", value: "#111827" },
    { name: "Red", value: "#EF4444" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Green", value: "#22C55E" },
    { name: "Yellow", value: "#EAB308" },
    { name: "Purple", value: "#A855F7" },
    { name: "Orange", value: "#F97316" },
    { name: "Gray", value: "#6B7280" },
];

type ColorSelectorProps = {
    onSelectedColor: (color: string) => void;
    selectedColor: string | null;
    disabled?: boolean;
};

const ColorSelector = ({
    onSelectedColor,
    selectedColor,
    disabled = false,
}: ColorSelectorProps) => {
    const handleSelected = (colorName: string) => {
        if (disabled) return;
        onSelectedColor(colorName);
    };

    return (
        <Box
            sx={{
                width: 150,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: 0.5,
                p: 1,
                opacity: disabled ? 0.5 : 1,
            }}
        >
            <Grid container spacing={0.2}>
                {COLORS.map((color) => {
                    const isSelected = selectedColor === color.name;
                    return (
                        <Grid key={color.value} size={4}>
                            <Box
                                role="button"
                                tabIndex={0}
                                aria-label={color.name}
                                onClick={() => handleSelected(color.name)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ")
                                        handleSelected(color.name);
                                }}
                                sx={{
                                    aspectRatio: "1 / 1",
                                    bgcolor: color.value,
                                    cursor: disabled ? "default" : "pointer",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    position: "relative",
                                }}
                            >
                                {isSelected && (
                                    <DoneOutlineIcon
                                        sx={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            color:
                                                color.value === "#F9FAFB"
                                                    ? "text.primary"
                                                    : "white",
                                            fontSize: 20,
                                        }}
                                    />
                                )}
                            </Box>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default ColorSelector;
