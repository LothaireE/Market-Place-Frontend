import FavoriteContext from "../favoritesContext";
import {
    ADD_TO_FAVORITES,
    // CLEAR_FAVORITE,
    REMOVE_FROM_FAVORITES,
} from "../../library/graphql/mutations/favorites";
import { useMutation, useQuery } from "@apollo/client";
import { useAuthContext } from "../useAppContext";
import type { FavoriteProduct } from "../../types/product.type";
import { GET_FAVORITES } from "../../library/graphql/queries/favorites";

export default function FavoriteContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { authStatus } = useAuthContext();
    const isAuthenticated = authStatus === "authenticated";

    const {
        data,
        loading: queryLoading,
        error: queryError,
        refetch,
    } = useQuery<{ favorites: FavoriteProduct[] }>(GET_FAVORITES, {
        skip: !isAuthenticated,
    });

    const favorites = isAuthenticated ? (data?.favorites ?? []) : [];
    const loading = isAuthenticated && queryLoading;
    const error = isAuthenticated ? (queryError ?? null) : null;

    const [addFavorite] = useMutation(ADD_TO_FAVORITES);
    const [removeFavorite] = useMutation(REMOVE_FROM_FAVORITES);

    async function addToFavorite(productId: string) {
        if (!isAuthenticated) return;
        try {
            await addFavorite({ variables: { productId } });
            await refetch();
        } catch (e) {
            console.error("Failed to add favorite", e);
        }
    }

    async function removeFromFavorite(productId: string) {
        if (!isAuthenticated) return;
        try {
            await removeFavorite({ variables: { productId } });
            await refetch();
        } catch (e) {
            console.error("Failed to remove favorite", e);
        }
    }

    async function toggleFavorite(productId: string) {
        if (!isAuthenticated) return;

        const exists = favorites.some((fav) => fav.product.id === productId);

        if (exists) {
            await removeFromFavorite(productId);
        } else {
            await addToFavorite(productId);
        }
    }

    const isFavorite = (productId: string) =>
        favorites.some((fav) => fav.product.id === productId);

    const contextValue = {
        favorites,
        loading,
        error,
        toggleFavorite,
        isFavorite,
    };

    return (
        <FavoriteContext.Provider value={contextValue}>
            {children}
        </FavoriteContext.Provider>
    );
}
