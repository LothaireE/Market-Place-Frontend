import { Box, IconButton } from "@mui/material";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";

const CartIcon = ({
    handleClick,
    itemsCount,
}: {
    handleClick: () => void;
    itemsCount: number | null;
}) => {
    const count = itemsCount ?? 0;
    return (
        <IconButton
            sx={{
                position: "relative",
                display: "inline-block",
            }}
            onClick={handleClick}
        >
            <ShoppingBasketIcon
                sx={{
                    color: "primary.contrastText",
                    fontSize: 28,
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    minWidth: 18,
                    height: 18,
                    borderRadius: "50%",
                    backgroundColor: "red",
                    color: "white",
                    display: count > 0 ? "flex" : "none",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "bold",
                    padding: "0 4px",
                    lineHeight: 1,
                }}
            >
                {count}
            </Box>
        </IconButton>
    );
};

export default CartIcon;
