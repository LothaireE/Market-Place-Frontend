export type CartProduct = {
    id: string;
    name: string;
    unitPrice: number;
    images?: { url: string }[];
    sellerProfile?: {
        user: {
            username: string;
        };
    };
};

export type CartItem = {
    product: CartProduct;
    quantity: number;
};
