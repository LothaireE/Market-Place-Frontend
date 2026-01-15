import "./App.css";
import { Container } from "@mui/material";
import { Outlet } from "react-router";
import AppHeader from "./components/header/AppHeader.tsx";
import AuthContextProvider from "./context/provider/authContextProvider.tsx";
import CartContextProvider from "./context/provider/cartContextProvider.tsx";
import FavoriteContextProvider from "./context/provider/favoritesContextProvider.tsx";
import SellerContextProvider from "./context/provider/sellerContextProvider.tsx";

export default function App() {
    return (
        <AuthContextProvider>
            <SellerContextProvider>
                <CartContextProvider>
                    <FavoriteContextProvider>
                        <AppHeader />
                        <Container sx={{ bgcolor: "background.default" }}>
                            <Outlet />
                        </Container>
                    </FavoriteContextProvider>
                </CartContextProvider>
            </SellerContextProvider>
        </AuthContextProvider>
    );
}
