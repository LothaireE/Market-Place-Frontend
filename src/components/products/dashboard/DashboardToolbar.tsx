import { 
    Box,
    Paper,
    Select,
    MenuItem,
    Stack,
    Typography
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import type { ProductListItem } from "../../../types/product.type";
import DashboardSearchBar from "./DashboardSearchBar";
import SearchDropDownSelector from "../../../components/header/search/SearchDropDownSelector";
import type { SelectChangeEvent } from "@mui/material";

type DashboardToolbarProps = {
    wrapperRef: React.RefObject<HTMLDivElement | null>;
    searchInputValue: string;
    setSearchInputValue: (value: string) => void;
    handleSearchSubmit: (event: React.FormEvent) => void;
    searchResult: ProductListItem[];
    isSearchOpen: boolean;
    handleSearchSelect: (productId: string) => void;
    sort: string;
    handleSortChange: (e: SelectChangeEvent<string>) => void;
    sortOptions: { value: string; label: string }[];
};

const DashboardToolbar = ({
    wrapperRef,
    searchInputValue,
    setSearchInputValue,
    handleSearchSubmit,
    searchResult,
    isSearchOpen,
    handleSearchSelect,
    sort,
    handleSortChange,
    sortOptions,
}: DashboardToolbarProps) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 3,
                mb: 2,
                border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
            >
                <Box ref={wrapperRef} sx={{ position: "relative" }} width="100%">
                    <DashboardSearchBar
                        value={searchInputValue}
                        handleOnChange={setSearchInputValue}
                        handleSearchSubmit={handleSearchSubmit}
                        placeholder="Search by name, brand, model…"
                    />
                    <SearchDropDownSelector
                        items={searchResult}
                        handleOnClick={handleSearchSelect}
                        open={isSearchOpen}
                    />
                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ minWidth: 220 }}
                >
                    <SortIcon color="action" />
                    <Typography variant="body2" color="text.secondary">
                        Sort by
                    </Typography>
                    <Select size="small" value={sort} onChange={handleSortChange} 
                    // fullWidth
                    sx={{ 
                        // border: "red solid 2px", 
                        maxWidth: 130}}
                    >
                        {sortOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value} sx={{overflow: "hidden"}}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </Select>
                </Stack>
            </Stack>
        </Paper>
    );
};

export default DashboardToolbar;
