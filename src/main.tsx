import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Homepage from "./pages/Homepage";
// import Dashboard from "./components/dashboard/Dashboard.tsx";
import Details from "./pages/Details";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ApolloProvider } from "@apollo/client";
import { client } from "./library/client.ts";
// import AppContextProvider from "./context/appContextProvider.tsx";
import Authenticate from "./pages/Authenticate.tsx";
import CreateProduct from "./pages/CreateProduct.tsx";
import AuthContextProvider from "./context/authContextProvider.tsx";
import UpdateProduct from "./pages/UpdateProduct.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <Homepage /> },
            // { path: "/dashboard", element: <Dashboard /> },
            { path: "/product-details/:id", element: <Details /> },
            { path: "/create-product", element: <CreateProduct /> },
            { path: "/update-product/:id", element: <UpdateProduct /> },
            { path: "/about", element: <About /> },
            { path: "/authenticate", element: <Authenticate /> },
            { path: "*", element: <NotFound /> },
        ],
    },
    { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthContextProvider>
            <ApolloProvider client={client}>
                <RouterProvider router={router} />
            </ApolloProvider>
        </AuthContextProvider>
    </StrictMode>
);
