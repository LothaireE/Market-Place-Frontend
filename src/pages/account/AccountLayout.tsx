import { Outlet, NavLink } from "react-router";
import { Box, Stack } from "@mui/material";

const AccountLayout = () => {
    return (
        <Stack direction="row" spacing={2} sx={{ p: 3 }}>
            {/* account sidebar */}
            <Box
                sx={{
                    width: "200px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <NavLink to="/account" end>
                    Profile
                </NavLink>
                <NavLink to="/account/orders">Orders</NavLink>
                <NavLink to="/account/favorites">Favorites</NavLink>
                <NavLink to="/account/cart">Cart</NavLink>
            </Box>
            {/* account pages content */}
            <Box sx={{ flexGrow: 1 }}>
                <Outlet />
            </Box>
        </Stack>
    );
};

export default AccountLayout;
