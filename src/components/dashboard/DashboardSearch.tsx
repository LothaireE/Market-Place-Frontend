import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Box, Button, List, ListItem, Paper } from "@mui/material";
import { useNavigate } from "react-router";
import { useDebouncedSearch } from "../../hooks/useDebouncedSearch";

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.grey[200], 0.9),
    "&:hover": {
        backgroundColor: alpha(theme.palette.grey[300], 1),
    },
    // width: "100%",
    padding: theme.spacing(0.5, 1.5),
    display: "flex",
    alignItems: "center",
    boxShadow: theme.shadows[1],
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    marginRight: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    flex: 1,
    "& .MuiInputBase-input": {
        padding: theme.spacing(1),
    },
}));

const GET_CHARACTERS_BY_NAME = gql`
    query charactersByName($name: String) {
        characters(filter: { name: $name }) {
            results {
                name
                id
            }
        }
    }
`;

type Character = {
    id: string;
    name: string;
};

type SelectItem = {
    name: string;
    id: string;
};

const DashboardSearch = () => {
    const navigate = useNavigate();
    const [searchInputValue, setSearchInputValue] = useState<string>("");
    const [selectList, setSelectList] = useState<SelectItem[]>([]);

    const [loadCharactersByName] = useLazyQuery<{
        characters: { results: Character[] };
    }>(GET_CHARACTERS_BY_NAME, {
        onCompleted: (data) => {
            setSelectList(data.characters.results);
        },
        onError: (error) => console.error("Error:", error),
    });

    useDebouncedSearch(searchInputValue, 500, async (search) => {
        await loadCharactersByName({ variables: { name: search } });
    });

    const handleSelect = (id: string) => {
        navigate(`/product-details/${id}`);
        setSearchInputValue("");
        setSelectList([]);
    };

    return (
        <Box
            sx={{
                position: "relative",
                // width: "100%",
                // maxWidth: 400,
                m: "auto 0 ",
            }}
        >
            {/* Search Input */}
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search characters…"
                    inputProps={{ "aria-label": "search" }}
                    value={searchInputValue}
                    onChange={(e) => setSearchInputValue(e.target.value)}
                />
            </Search>

            {/* Search Results */}
            {selectList.length > 0 && (
                <Paper
                    sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        // mt: 1,
                        zIndex: 10,
                        maxHeight: 300,
                        overflowY: "auto",
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <List dense>
                        {selectList.map((item) => (
                            <ListItem key={item.id}>
                                <Button
                                    onClick={() => handleSelect(item.id)}
                                    sx={{
                                        "&:hover": {
                                            bgcolor: "primary.light",
                                            color: "white",
                                        },
                                    }}
                                >
                                    {item.name}
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
};

export default DashboardSearch;
