import { useQuery } from "@apollo/client";
import type { Category } from "../../types/product.type";
import { Box, Chip, Container, Skeleton, Typography } from "@mui/material";
import { GET_CATEGORIES } from "../../library/graphql/queries/categories";
import { useNavigate } from "react-router";

const CategoryStrip = () => {
    const navigate = useNavigate();
    const { loading, error, data } = useQuery<{ categories: Category[] }>(
        GET_CATEGORIES
    );

    const handleCategoryClick = (catId: string) => {
        navigate(`/products/?category=${catId}`);
    };

    return (
        <Box
            sx={{
                bgcolor: "background.paper",
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    py: 1.5,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                }}
            >
                {data?.categories.map((cat) => (
                    <Chip
                        key={cat.id}
                        label={cat.name}
                        clickable
                        sx={{
                            borderRadius: 999,
                            fontWeight: 500,
                        }}
                        onClick={() => handleCategoryClick(cat.id)}
                    />
                ))}
                {loading &&
                    Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            variant="rectangular"
                            width={90}
                            height={32}
                            sx={{
                                borderRadius: "999px",
                                opacity: 0.2,
                            }}
                        />
                    ))}
                {error && (
                    <Box sx={{ py: 1 }}>
                        <Typography variant="body2" color="error">
                            Something went wrong loading categories
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default CategoryStrip;
