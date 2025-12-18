import { createContext } from "react";
import type { CartProduct, CartItem } from "../types/cart.type";

export type CartContextType = {
    addItem: (product: CartProduct, quantity?: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    cartItems: CartItem[];
    totalQuantity: number;
};

const CartContext = createContext<CartContextType>({
    addItem: async () => {},
    removeItem: async () => {},
    clearCart: async () => {},
    cartItems: [],
    totalQuantity: 0,
});

export default CartContext;
