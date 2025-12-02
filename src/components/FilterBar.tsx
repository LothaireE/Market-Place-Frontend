import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { Button, Grid, Paper } from "@mui/material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
// Type pour les options :
// chaque clé correspond à un filtre,
// chaque valeur est une liste de choix possibles
export type FilterOptions = {
    [keys: string]: string[];
};

export type Filters = {
    [key: string]: string;
};

type SelectbarProps = {
    options: FilterOptions;
    onFilterChange: (filters: Filters) => void;
};

export default function SelectBar({ options, onFilterChange }: SelectbarProps) {
    const [filters, setFilters] = React.useState<Filters>({});

    const handleChange = (event: SelectChangeEvent, key: string) => {
        const newFilters = { ...filters, [key]: event.target.value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handeReset = (key?: string) => {
        if (!key) {
            setFilters({});
            onFilterChange({});
        } else {
            const newFilters = { ...filters, [key]: "" };
            setFilters(newFilters);
            onFilterChange(newFilters);
        }
    };

    return (
        <Paper elevation={2} sx={{ p: 1 }}>
            <Grid container spacing={2}>
                <Grid size={10} container spacing={2}>
                    {options &&
                        Object.entries(options).map(([key, values]) => (
                            <Grid key={key} container>
                                <Grid size={8}>
                                    <FormControl key={key}>
                                        <>
                                            <InputLabel id={`label-${key}`}>
                                                {key}
                                            </InputLabel>
                                            <Select
                                                labelId={`label-${key}`}
                                                id={`select-${key}`}
                                                value={filters[key] || ""}
                                                label={key}
                                                onChange={(event) =>
                                                    handleChange(event, key)
                                                }
                                                sx={{
                                                    width: 180,
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {Array.from(
                                                    new Set(values)
                                                ).map((value) => (
                                                    <MenuItem
                                                        key={value}
                                                        value={value}
                                                        sx={{
                                                            width: 180,
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        {value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </>
                                    </FormControl>
                                </Grid>
                                <Grid
                                    size={4}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {filters[key] && (
                                        <Button onClick={() => handeReset(key)}>
                                            <ClearRoundedIcon />
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>
                        ))}
                </Grid>
                <Grid
                    size={2}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Button onClick={() => handeReset()}>Reset Filters</Button>
                </Grid>
            </Grid>
        </Paper>
    );
}
