import { useNavigate } from "react-router";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { useAuthContext } from "../../context/useAppContext";

//TODO: I fixed it (position) but I'm not convinced and it's too much like an mobile app
const BottomNav = () => {
    const { accessToken } = useAuthContext();
    const navigate = useNavigate();

    const handleUserMenu = (newValue: number) => {
        if (!accessToken) {
            navigate("/authenticate");
            return;
        }
        if (newValue === 0) {
            console.log("navigate to favorites");
            // navigate("/favorites");
        }
        if (newValue === 1) {
            console.log("navigate to cart");
            // navigate("/cart");
        }
        if (newValue === 3) {
            console.log("navigate to profile");
            // navigate("/profile");
        }
    };

    return (
        <BottomNavigation
            showLabels
            // value={value}
            // onChange={(event, newValue) => {
            onChange={(_, newValue) => {
                handleUserMenu(newValue);
            }}
            sx={{
                position: "fixed",
                bottom: 0,
                width: "100%",
                display: { xs: "flex", md: "none" },
            }}
        >
            <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
            <BottomNavigationAction
                label="Cart"
                icon={<ShoppingBasketIcon />}
            />
            <BottomNavigationAction
                label="Profile"
                icon={<AccountCircleIcon />}
            />
        </BottomNavigation>
    );
};

export default BottomNav;
