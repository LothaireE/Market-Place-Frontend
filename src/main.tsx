import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import Details from "./pages/Details";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ApolloProvider } from "@apollo/client";
import { client } from "./library/client.ts";
import AppContextProvider from "./context/appContextProvider.tsx";
import Authenticate from "./pages/Authenticate.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <Homepage /> },
            { path: "/dashboard", element: <Dashboard /> },
            { path: "/details/:id", element: <Details /> },
            { path: "/about", element: <About /> },
            { path: "/authenticate", element: <Authenticate /> },
            { path: "*", element: <NotFound /> },
        ],
    },
    { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppContextProvider>
            <ApolloProvider client={client}>
                <RouterProvider router={router} />
            </ApolloProvider>
        </AppContextProvider>
    </StrictMode>
);
