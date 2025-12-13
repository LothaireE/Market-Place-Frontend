import { createContext } from "react";
import type { SellerProfile } from "../types/seller.type";

export type SellerContextType = {
    sellerProfile: SellerProfile | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
};

const SellerContext = createContext<SellerContextType>({
    sellerProfile: null,
    loading: true,
    error: null,
    refetch: async () => {},
});

export default SellerContext;
