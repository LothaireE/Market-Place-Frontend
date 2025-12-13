import type { Product } from "./product.type";
import type { User } from "./user.type";

export type VerificationStatus = "PENDING" | "REJECTED" | "VERIFIED";

export type SellerProfile = {
    __typename?: string;
    id: string;
    bio?: string;
    createdAt: string;
    payoutAccount?: string;
    products: Product[];
    rating?: number | null;
    shopName?: string;
    updatedAt: string;
    user: User;
    userId: string;
    verified: VerificationStatus;
};
