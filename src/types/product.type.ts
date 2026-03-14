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
    unitPrice: number;
    sellerProfile: SellerProfile;
    size?: string;
    updatedAt?: string;
    categories?: [Category];
};

export type FavoriteProduct = {
    product: {
        id: string;
        name: string;
        unitPrice: number;
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

export type NewImage = {
    file: File;
    previewUrl: string;
};

///////// FOR PRODUCTS LIST PAGE /////////

export type PaginationInput = {
    page?: number;
    pageSize?: number; // null,
    sortBy?: "DATE" | "PRICE";
    sortDirection?: "ASC" | "DESC";
};

export type ProductFilterInput = {
    ids?: string[] | null;
    search?: string;
    category?: string;
    condition?: [ProductCondition] | null;
    minPrice?: number | null;
    maxPrice?: number | null;
};

export type ProductListItem = {
    id: string;
    name: string;
    unitPrice: number;
    condition: ProductCondition;
    categories?: [Category];
    images: ProductImage[];
    status: string;
    sellerProfile: {
        user: { username: string };
    };
};

export type ProductListResponse = {
    products: {
        items: ProductListItem[];
        totalItems: number;
        totalPages: number;
    };
};

export type SelectedCategory = {
    id: string;
    name: string;
};

export type LoadProductByNameType = {
    products: { items: ProductListItem[] };
    totalPages: number;
    totalProducts: number;
    currentPage: number;
};
