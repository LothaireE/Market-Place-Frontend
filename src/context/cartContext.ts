import { createContext } from "react";
import type { Product } from "../types/product.type";
export type ThemeMode = "lightMode" | "darkMode";

type CartItem = {
    productId: string;
    quantity: number;
};

export type CartContextType = {
    addItem: (product: Product, quantity?: number) => Promise<void>; // maybe jai pas besoin d'envoyer tout le product mais juste l'id
    removeItem: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    cartItems: CartItem[];
};

const CartContext = createContext<CartContextType>({
    addItem: async () => {},
    removeItem: async () => {},
    clearCart: async () => {},
    cartItems: [],
});

export default CartContext;
