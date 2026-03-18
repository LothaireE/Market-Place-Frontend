import { Box, Chip, InputLabel, NativeSelect, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { capitalizeFirstLetter } from "../../../utils/textFormat";
import type { Category } from "../../../types/product.type";

type CategorySelectorFieldProps = {
    registeredCategories: Category[];
    selectedCategories: Category[];
    categorySelectValue: string;
    onCategorySelect: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onRemoveCategory: (catId: string) => void;
    hasError?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    label?: string;
};

const CategorySelectorField = ({
    registeredCategories,
    selectedCategories,
    categorySelectValue,
    onCategorySelect,
    onRemoveCategory,
    hasError = false,
    errorMessage = "",
    disabled = false,
    label = "Category",
}: CategorySelectorFieldProps) => {
    return (
        <Box>
            <InputLabel
                variant="standard"
                htmlFor="category-select"
                required
                sx={{ mb: 1 }}
            >
                {label}
            </InputLabel>

            <NativeSelect
                disabled={disabled}
                inputProps={{
                    name: "category",
                    id: "category-select",
                }}
                value={categorySelectValue}
                onChange={onCategorySelect}
                sx={{ maxWidth: 240 }}
            >
                <option value="">
                    {selectedCategories.length ? "Add another category" : "Select categories"}
                </option>

                {selectedCategories.length > 0 && (
                    <option value="clear">Clear all</option>
                )}

                {registeredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {capitalizeFirstLetter(cat.name.toLowerCase())}
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
                        onDelete={
                            disabled ? undefined : () => onRemoveCategory(cat.id)
                        }
                        deleteIcon={<ClearIcon />}
                        sx={{
                            borderRadius: 999,
                            fontWeight: 500,
                        }}
                        variant="outlined"
                    />
                ))}
            </Box>

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

export default CategorySelectorField;
