import type { SellerProfile } from "./seller.type";

export type ProductCondition =
    | "EXCELLENT"
    | "GOOD"
    | "CORRECT"
    | "USED"
    | "DAMAGED";

export type ProductImage = {
    bytes: number;
    format: string;
    height: number;
    name: string;
    publicId: string;
    url: string;
    width: number;
};

export type Product = {
    id: string;
    sellerId: string;
    color?: string;
    condition: ProductCondition;
    createdAt: string;
    description?: string;
    images: ProductImage[];
    name: string;
    price: number;
    sellerProfile: SellerProfile;
    size?: string;
    updatedAt?: string;
};

export type FavoriteProduct = {
    product: {
        id: string;
        name: string;
        price: number;
        condition: ProductCondition;
        sellerProfile: {
            user: {
                username: string;
            };
        };
        images: ProductImage[];
        sellerId: string;
        createdAt: string;
    };
};

export type Category = {
    id: string;
    name: string;
};
