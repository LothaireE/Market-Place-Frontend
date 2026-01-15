import { Button, List, ListItem, Paper } from "@mui/material";

const SearchDropDownSelector = ({
    items,
    handleOnClick,
    open = true,
}: // open,
{
    items: { id: string; name: string }[];
    handleOnClick: (id: string) => void;
    open: boolean;
}) => {
    if (!open) return null;
    if (items.length === 0) return null;
    return (
        <Paper
            sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 10,
                maxHeight: 300,
                maxWidth: 380,
                overflowY: "auto",
                borderRadius: 2,
                boxShadow: 3,
            }}
        >
            <List dense>
                {items.map((item) => (
                    <ListItem key={item.id}>
                        <Button
                            onClick={() => handleOnClick(item.id)}
                            sx={{
                                width: "100%",
                                justifyContent: "start",
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
    );
};

export default SearchDropDownSelector;
