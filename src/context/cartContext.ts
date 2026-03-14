import { createContext } from "react";
import type { CartProduct, CartItem } from "../types/cart.type";

export type CartContextType = {
    addItem: (product: CartProduct, quantity?: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    removeMultipleItems: (productIds: string[]) => Promise<void>;
    clearCart: () => Promise<void>;
    isInCart: (productId: string) => boolean;
    cartItems: CartItem[];
    totalQuantity: number;
};

const CartContext = createContext<CartContextType>({
    addItem: async () => {},
    removeItem: async () => {},
    removeMultipleItems: async () => {},
    clearCart: async () => {},
    isInCart: () => false,
    cartItems: [],
    totalQuantity: 0,
});

export default CartContext;
