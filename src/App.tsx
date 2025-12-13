import "./App.css";
import { Container } from "@mui/material";
import { Outlet } from "react-router";
import CustomHeader from "./components/navigation/CustomHeader";
import BottomNav from "./components/navigation/BottomNavigation";
import AuthContextProvider from "./context/authContextProvider.tsx";
import CartContextProvider from "./context/cartContextProvider.tsx";
import FavoriteContextProvider from "./context/favoritesContextProvider.tsx";
import SellerContextProvider from "./context/sellerContextProvider.tsx";

export default function App() {
    return (
        <AuthContextProvider>
            <SellerContextProvider>
                <CartContextProvider>
                    <FavoriteContextProvider>
                        <CustomHeader />
                        <Container>
                            <Outlet />
                        </Container>
                        <BottomNav />
                    </FavoriteContextProvider>
                </CartContextProvider>
            </SellerContextProvider>
        </AuthContextProvider>
    );
}
