import { useEffect, useState, useRef } from "react";
// import { API_URLS } from "../config/env";
import CartContext from "./cartContext";
// import type { Product } from "../library/graphql/queries/products";
import type { Product } from "../types/product.type";

type CartItem = {
    productId: string;
    quantity: number;
};

const CART = "mp_user_cart";

export default function CartContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const isMounted = useRef(false); // prevent double execution in StrictMode

    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        if (isMounted.current) return;
        isMounted.current = true;

        const storedCart = localStorage.getItem(CART);

        if (storedCart) setCartItems(JSON.parse(storedCart));
    }, [cartItems]);

    async function addItem(product: Product, quantity: number = 1) {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(
                (item) => item.productId === product.id
            );
            if (existingItem) {
                const cart = prevItems.map((item) =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
                localStorage.setItem(CART, JSON.stringify(cart));
                return cart;
            } else {
                const cart = [
                    ...prevItems,
                    { productId: product.id, quantity },
                ];
                localStorage.setItem(CART, JSON.stringify(cart));

                return cart;
            }
        });
    }

    async function removeItem(productId: string) {
        setCartItems((prevItems) => {
            const cart = prevItems
                .map((item) =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0);
            localStorage.setItem(CART, JSON.stringify(cart));
            return cart;
        });
    }

    async function clearCart() {
        localStorage.removeItem(CART);
        setCartItems([]);
    }

    const contextValue = {
        addItem,
        removeItem,
        clearCart,
        cartItems,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}
