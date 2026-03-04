import { useQuery } from "@apollo/client";
import SellerContext from "../sellerContext";
import { useAuthContext } from "../useAppContext";
import type { SellerProfile } from "../../types/seller.type";
import { GET_SELLER_PROFILE } from "../../library/graphql/queries/sellerProfile";
import { useMemo } from "react";

export default function SellerContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { authStatus, user } = useAuthContext();
    const triggerFetchSeller = authStatus === "authenticated";

    const {
        data,
        loading: queryLoading,
        error: queryError,
        refetch,
    } = useQuery<{ sellerProfile: SellerProfile }>(GET_SELLER_PROFILE, {
        skip: !triggerFetchSeller, // start request only if auth: triggerFetchSeller is true
        fetchPolicy: "cache-first",
    });

    const loading =
        authStatus === "loading" ? true : triggerFetchSeller && queryLoading;

    const error = triggerFetchSeller // raise error only if sellerProfile was supposed to be fetched
        ? ((queryError as Error | null) ?? null)
        : null;

    const contextValue = useMemo(
        () => ({
            sellerProfile: data?.sellerProfile ?? null,
            loading,
            error,
            refetch,
        }),
        [data, loading, error, refetch],
    );

    if (data?.sellerProfile?.user.email !== user?.email) {
        contextValue.sellerProfile = null;
    }

    return (
        <SellerContext.Provider value={contextValue}>
            {children}
        </SellerContext.Provider>
    );
}
