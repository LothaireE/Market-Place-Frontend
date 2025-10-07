import "./App.css";
import { Container } from "@mui/material";
import { Outlet } from "react-router";
import CustomHeader from "./components/header/CustomHeader";

export default function App() {
    return (
        <>
            <CustomHeader />
            <Container>
                <Outlet />
            </Container>
        </>
    );
}
