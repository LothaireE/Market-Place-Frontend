import { createContext } from "react";
// import type { Favorite } from "./favoritesContextProvider";

export type FavoriteContextType = {
    favorites: string[] | null;
    toggleFavorite: (productId: string) => Promise<void>;
    clearFavorite: () => void;
};

const FavoriteContext = createContext<FavoriteContextType>({
    favorites: null,
    toggleFavorite: async () => {},
    clearFavorite: () => {},
});

export default FavoriteContext;
