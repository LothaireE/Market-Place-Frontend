import { useQuery } from "@apollo/client";
import type { Category } from "../../../types/product.type";
import { GET_CATEGORIES } from "../../../library/graphql/queries/categories";
import { Alert, Box, Chip, Skeleton, Stack } from "@mui/material";

const DashboardCategories = ({
    selectedCategory,
    onCategoryClick,
}: {
    selectedCategory: Category;
    onCategoryClick: (cat: Category) => string | void;
}) => {
    const { data, loading, error } = useQuery<{ categories: Category[] }>(
        GET_CATEGORIES
    );

    return (
        <Stack spacing={1} sx={{ mb: 2 }}>
            {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        variant="rounded"
                        height={32}
                        width={160}
                        sx={{ borderRadius: 5 }}
                    />
                ))}
            {error && (
                <Box sx={{ mt: 1, mb: 2 }}>
                    <Alert severity="error" variant="filled">
                        Unable to load categories. Please try again later.
                    </Alert>
                </Box>
            )}
            {data?.categories.map((cat) => (
                <Chip
                    key={cat.id}
                    label={cat.name}
                    variant={
                        selectedCategory.id === cat.id ? "filled" : "outlined"
                    }
                    color={
                        selectedCategory.id === cat.id ? "primary" : "default"
                    }
                    onClick={() => onCategoryClick(cat)}
                    sx={{
                        justifyContent: "flex-start",
                        maxWidth: 160,
                        maxHeight: 32,
                        overflow: "hidden",
                    }}
                />
            ))}
        </Stack>
    );
};

export default DashboardCategories;
