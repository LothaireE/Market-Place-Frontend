import { useEffect, useMemo, useState } from "react";
import CartContext from "../cartContext";
import { useAuthContext } from "../useAppContext";

const MP_CART = "mp_user_cart";

type CartItem = {
    productId: string;
    productName: string;
    quantity: number;
};

type CartContent = {
    username: string;
    items: CartItem[];
};

const EMPTY_CART: CartContent = {
    username: "",
    items: [],
};

function isCartItem(item: unknown): item is CartItem {
    return (
        typeof item === "object" &&
        item !== null &&
        typeof (item as CartItem).productId === "string" &&
        typeof (item as CartItem).productName === "string" &&
        typeof (item as CartItem).quantity === "number"
    );
}

function getStoredCart(): CartContent | null {
    try {
        const storage = localStorage.getItem(MP_CART);
        if (!storage) return null;

        const parsedCart = JSON.parse(storage);

        if (
            typeof parsedCart !== "object" ||
            parsedCart === null ||
            typeof parsedCart.username !== "string" ||
            !Array.isArray(parsedCart.items)
        ) {
            return null;
        }

        const items = parsedCart.items.filter(isCartItem);

        return {
            username: parsedCart.username,
            items,
        };
    } catch {
        return null;
    }
}

function saveOrClearCart(cart: CartContent) {
    if (!cart.username || cart.items.length === 0) {
        localStorage.removeItem(MP_CART);
        return;
    }

    localStorage.setItem(MP_CART, JSON.stringify(cart));
}

export default function CartContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuthContext();
    const username = user?.username ?? "";

    const [cartContent, setCartContent] = useState<CartContent>(EMPTY_CART);

    useEffect(() => {
        if (!username) {
            setCartContent(EMPTY_CART);
            localStorage.removeItem(MP_CART);
            return;
        }

        const storedCart = getStoredCart();

        if (!storedCart) {
            setCartContent({
                username,
                items: [],
            });
            return;
        }

        if (storedCart.username !== username) {
            localStorage.removeItem(MP_CART);
            setCartContent({
                username,
                items: [],
            });
            return;
        }

        setCartContent(storedCart);
    }, [username]);

    const cartItems = cartContent.items;

    async function addItem(
        newItemId: string,
        newItemName: string,
        quantity: number = 1,
    ) {
        if (!username) return;

        setCartContent((prevCart) => {
            const currentCart =
                prevCart.username === username
                    ? prevCart
                    : { username, items: [] as CartItem[] };

            const fixedQuantity = quantity === 1 ? 1 : 1;

            const existingItem = currentCart.items.find(
                (item) => item.productId === newItemId,
            );

            if (existingItem) {
                return currentCart;
            }

            const newCart: CartContent = {
                username,
                items: [
                    ...currentCart.items,
                    {
                        productId: newItemId,
                        productName: newItemName,
                        quantity: fixedQuantity,
                    },
                ],
            };

            saveOrClearCart(newCart);
            return newCart;
        });
    }

    async function removeItem(productId: string) {
        if (!username) return;

        setCartContent((prevCart) => {
            if (prevCart.username !== username) {
                return { username, items: [] };
            }

            const updatedItems = prevCart.items
                .map((item) =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item,
                )
                .filter((item) => item.quantity > 0);

            const newCart: CartContent = {
                username,
                items: updatedItems,
            };

            saveOrClearCart(newCart);
            return newCart;
        });
    }

    async function removeMultipleItems(productIds: string[]) {
        if (!username) return;

        setCartContent((prevCart) => {
            if (prevCart.username !== username) {
                return { username, items: [] };
            }

            const updatedItems = prevCart.items
                .map((item) =>
                    productIds.includes(item.productId)
                        ? { ...item, quantity: item.quantity - 1 }
                        : item,
                )
                .filter((item) => item.quantity > 0);

            const newCart: CartContent = {
                username,
                items: updatedItems,
            };

            saveOrClearCart(newCart);
            return newCart;
        });
    }

    async function clearCart() {
        localStorage.removeItem(MP_CART);
        setCartContent(username ? { username, items: [] } : EMPTY_CART);
    }

    const totalQuantity = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
        [cartItems],
    );

    const isInCart = (productId: string) =>
        cartItems.some((item) => item.productId === productId);

    const contextValue = {
        addItem,
        removeItem,
        removeMultipleItems,
        clearCart,
        isInCart,
        cartItems,
        totalQuantity,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}
