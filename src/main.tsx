import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ApolloProvider } from "@apollo/client";
import { graphqlClient } from "./library/graphql/client.ts";

import App from "./App.tsx";
import HomePage from "./pages/home/HomePage.tsx";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Authenticate from "./pages/auth/Authenticate.tsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.tsx";
import ProfilePage from "./pages/account/ProfilePage.tsx";
import OrdersPage from "./pages/account/OrdersPage.tsx";
import FavoritesPage from "./pages/account/FavoritesPage.tsx";
import CartPage from "./pages/account/CartPage.tsx";
import SellerDashboardPage from "./pages/seller/SellerDashboardPage.tsx";
import SellerProductDetailPage from "./pages/seller/SellerProductDetailPage.tsx";
import SellerProductListPage from "./pages/seller/SellerProductListPage.tsx";
import SellerProductFormPage from "./pages/seller/SellerProductCreatePage.tsx";
import SellerRoute from "./components/layout/SellerRoute.tsx";
import SellerProfilePage from "./pages/seller/SellerProfilePage.tsx";
import AccountLayout from "./pages/account/AccountLayout.tsx";
import SellerLayout from "./pages/seller/SellerLayout.tsx";
import SellerProductEditPage from "./pages/seller/SellerProductEditPage.tsx";
import ProductListPage from "./pages/products/ProductListPage.tsx";
import ProductDetailPage from "./pages/products/ProductDetailPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "/products/:id", element: <ProductDetailPage /> },
            {
                path: "/products/:category",
                element: <ProductListPage />,
            },
            { path: "/products", element: <ProductListPage /> },

            { path: "/about", element: <About /> },
            { path: "/authenticate", element: <Authenticate /> },
            {
                path: "/account",
                element: (
                    <ProtectedRoute>
                        <AccountLayout />
                    </ProtectedRoute>
                ),
                children: [
                    { index: true, element: <ProfilePage /> },
                    { path: "orders", element: <OrdersPage /> },
                    { path: "favorites", element: <FavoritesPage /> },
                    { path: "cart", element: <CartPage /> },
                ],
            },
            {
                path: "/seller",
                element: (
                    <SellerRoute>
                        <SellerLayout />
                    </SellerRoute>
                ),
                children: [
                    { index: true, element: <SellerDashboardPage /> },
                    { path: "products", element: <SellerProductListPage /> },
                    {
                        path: "products/:id",
                        element: <SellerProductDetailPage />,
                    },

                    {
                        path: "products/:id/edit",
                        element: <SellerProductEditPage />,
                    },
                    {
                        path: "new",
                        element: <SellerProductFormPage />,
                    },
                    { path: "profile", element: <SellerProfilePage /> },
                ],
            },
            { path: "*", element: <NotFound /> },
        ],
    },
    { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ApolloProvider client={graphqlClient}>
            <RouterProvider router={router} />
        </ApolloProvider>
    </StrictMode>
);
