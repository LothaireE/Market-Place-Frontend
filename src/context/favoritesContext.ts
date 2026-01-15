import { createContext } from "react";
// import type { Favorite } from "./favoritesContextProvider";
import type { FavoriteProduct } from "../types/product.type";

export type FavoriteContextType = {
    favorites: FavoriteProduct[] | null;
    loading: boolean;
    error: Error | null;
    toggleFavorite: (productId: string) => Promise<void>;
    isFavorite: (productId: string) => boolean;
};

const FavoriteContext = createContext<FavoriteContextType>({
    favorites: null,
    toggleFavorite: async () => {},
    loading: true,
    error: null,
    isFavorite: () => false,
});

export default FavoriteContext;
