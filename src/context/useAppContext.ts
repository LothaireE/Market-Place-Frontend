import { useContext } from "react";
import AuthContext from "./authContext";
import CartContext from "./cartContext";
import FavoritesContext from "./favoritesContext";
import SellerContext from "./sellerContext";

// TODO: rename ce file for sometthing more meaningful

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error(
            "useAuthContext must be used within an AppContextProvider"
        );
    return context;
};

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context)
        throw new Error(
            "useCartContext must be used within a CartContextProvider"
        );
    return context;
};

export const useFavoritesContext = () => {
    const context = useContext(FavoritesContext);
    if (!context)
        throw new Error(
            "useFavoritesContext must be used within a FavoritesProvider"
        );
    return context;
};

export const useSellerContext = () => {
    const context = useContext(SellerContext);
    if (!context) {
        throw new Error(
            "useSellerContext must be used within a FavoritesProvider"
        );
    }
    return context;
};
