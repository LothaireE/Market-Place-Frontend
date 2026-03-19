import {
    Paper,
    Typography,
    Stack,
    Slider,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Button,
} from "@mui/material";
import EuroIcon from "@mui/icons-material/Euro";
import StorefrontIcon from "@mui/icons-material/Storefront";
import type {
    ProductCondition,
    SelectedCategory,
} from "../../../types/product.type";
import DashboardCategories from "../../../components/products/dashboard/DashboardCategories";
import { CONDITION_FILTERS } from "../../../constants/products";

type Props = {
    selectedCategoryId: string;
    priceRange: [number, number];
    selectedConditions: ProductCondition[];
    onCategoryClick: (cat: SelectedCategory) => void;
    onPriceChange: (_: Event, value: number | number[]) => void;
    onToggleCondition: (cond: ProductCondition) => void;
    onStartSellingClick: () => void;
};


const DashboardSidebar =  ({
    selectedCategoryId,
    priceRange,
    selectedConditions,
    onCategoryClick,
    onPriceChange,
    onToggleCondition,
    onStartSellingClick,
}: Props) => {
    return (
        <>
            <Paper elevation={1} sx={{ p: 2.5, borderRadius: 3, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                    Categories
                </Typography>

                <DashboardCategories
                    selectedCategory={{ id: selectedCategoryId, name: "" }}
                    onCategoryClick={onCategoryClick}
                />

                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, mt: 1 }}>
                    Price range
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                    <EuroIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                        {priceRange[0]} € – {priceRange[1]} €
                    </Typography>
                </Stack>

                <Slider
                    sx={{ mt: 1 }}
                    value={priceRange}
                    min={0}
                    max={5000}
                    step={50}
                    onChange={onPriceChange}
                    valueLabelDisplay="off"
                />

                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, mt: 2 }}>
                    Condition
                </Typography>

                <FormGroup>
                    {CONDITION_FILTERS.map((c) => (
                        <FormControlLabel
                            key={c.value}
                            control={
                                <Checkbox
                                    checked={selectedConditions.includes(c.value)}
                                    onChange={() => onToggleCondition(c.value)}
                                    size="small"
                                />
                            }
                            label={c.label}
                        />
                    ))}
                </FormGroup>
            </Paper>

            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    borderRadius: 3,
                    display: { xs: "none", md: "block" },
                }}
            >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <StorefrontIcon color="primary" />
                    <Typography variant="subtitle2" fontWeight={600}>
                        Want to sell your gear?
                    </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Turn your unused instruments into cash. List them on Musizicos.
                </Typography>

                <Button
                    size="small"
                    variant="outlined"
                    fullWidth
                    onClick={onStartSellingClick}
                >
                    Start selling
                </Button>
            </Paper>
        </>
    );
};

export default DashboardSidebar; 