import { Box, InputAdornment, TextField } from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
    value: string;
    handleOnChange: (value: string) => void;
    handleSearchSubmit?: (event: React.FormEvent) => void;
    placeholder?: string;
};

const DashboardSearchBar = ({
    value,
    handleOnChange,
    handleSearchSubmit,
    placeholder,
}: Props) => {
    return (
        <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{ flexGrow: 1 }}
        >
            <TextField
                size="small"
                fullWidth
                placeholder={placeholder}
                value={value}
                onChange={(event) => handleOnChange(event.target.value)}
                autoComplete="off"
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    },
                }}
            />
        </Box>
    );
};

export default DashboardSearchBar;
