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
    productId: string;
    productName: string;
    quantity: number;
};
