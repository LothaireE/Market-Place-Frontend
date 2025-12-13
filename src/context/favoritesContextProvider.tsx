import { useEffect, useState, useRef } from "react";
// import { API_URLS } from "../config/env";
import FavoriteContext from "./favoritesContext";

// export type Favorite = {
//     productId: string;
// };

const FAVORITE = "mp_user_favorites";

export default function FavoriteContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const isMounted = useRef(false); // prevent double execution in StrictMode

    // const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [favorites, setFavorites] = useState<string[]>([""]);

    useEffect(() => {
        if (isMounted.current) return;
        isMounted.current = true;

        const storedFavorites = localStorage.getItem(FAVORITE);

        if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    }, [favorites]);

    // async function toggleFavorite(productId: string) {
    //     setFavorites((prevItems) => {
    //         const existingItem = prevItems.find(
    //             (item) => item.productId === productId
    //         );
    //         if (existingItem) {
    //             const fav = prevItems.filter(
    //                 (item) => item.productId !== productId
    //             );
    //             localStorage.setItem(FAVORITE, JSON.stringify(fav));
    //             return fav;
    //         } else {
    //             const fav = [...prevItems, { productId }];
    //             localStorage.setItem(FAVORITE, JSON.stringify(fav));
    //             return fav;
    //         }
    //     });
    // }
    async function toggleFavorite(productId: string) {
        setFavorites((prevItems) => {
            const exist = prevItems.includes(productId);
            let fav: string[];
            if (exist) {
                fav = favorites.filter((item) => item !== productId);
            } else {
                fav = [...favorites, productId];
            }
            localStorage.setItem(FAVORITE, JSON.stringify(fav));
            return fav;
        });
    }
    // async function toggleFavorite(productId: string) {
    //     setFavorites((prevItems) => {
    //         const exists = prevItems.includes(productId);
    //         let fav: string[];
    //         if (exists) {
    //             fav = prevItems.filter((item) => item !== productId);
    //         } else {
    //             fav = [...prevItems, productId];
    //         }
    //         localStorage.setItem(FAVORITE, JSON.stringify(fav));
    //         return fav;
    //     });
    // }
    async function clearFavorite() {
        localStorage.removeItem(FAVORITE);
        setFavorites([]);
    }

    const contextValue = {
        favorites,
        toggleFavorite,
        clearFavorite,
    };

    return (
        <FavoriteContext.Provider value={contextValue}>
            {children}
        </FavoriteContext.Provider>
    );
}
