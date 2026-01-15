import { Outlet, NavLink } from "react-router";
import {
    Box,
    Stack,
    Typography,
    Paper,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const AccountLayout = () => {
    return (
        <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2, md: 3 }}
            sx={{ p: { xs: 2, md: 3 } }}
        >
            {/* Sidebar */}
            <Paper
                elevation={2}
                sx={{
                    width: { md: 260 },
                    p: 2.5,
                    borderRadius: 3,
                    alignSelf: { xs: "stretch", md: "flex-start" },
                    position: { xs: "relative", md: "sticky" },
                    top: { md: 80 },
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                {/* Header */}
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                    <Typography variant="h6" fontWeight={600}>
                        My account
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Manage your profile, orders and favorites.
                    </Typography>
                </Box>

                <Divider sx={{ display: { xs: "none", md: "block" } }} />

                <List component="nav" disablePadding>
                    <ListItemButton
                        component={NavLink}
                        to="/account"
                        end
                        sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            "&.active": {
                                bgcolor: "action.selected",
                            },
                        }}
                    >
                        <ListItemIcon>
                            <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItemButton>

                    <ListItemButton
                        component={NavLink}
                        to="/account/orders"
                        sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            "&.active": {
                                bgcolor: "action.selected",
                            },
                        }}
                    >
                        <ListItemIcon>
                            <ReceiptLongIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Orders" />
                    </ListItemButton>

                    <ListItemButton
                        component={NavLink}
                        to="/account/favorites"
                        sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            "&.active": {
                                bgcolor: "action.selected",
                            },
                        }}
                    >
                        <ListItemIcon>
                            <FavoriteBorderIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Favorites" />
                    </ListItemButton>

                    <ListItemButton
                        component={NavLink}
                        to="/account/cart"
                        sx={{
                            borderRadius: 2,
                            "&.active": {
                                bgcolor: "action.selected",
                            },
                        }}
                    >
                        <ListItemIcon>
                            <ShoppingCartIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Cart" />
                    </ListItemButton>
                </List>
            </Paper>

            {/* Account pages content */}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Outlet />
            </Box>
        </Stack>
    );
};

export default AccountLayout;

// import { Outlet, NavLink } from "react-router";
// import { Box, Stack } from "@mui/material";

// const AccountLayout = () => {
//     return (
//         <Stack direction="row" spacing={2} sx={{ p: 3 }}>
//             <Box
//                 sx={{
//                     width: "200px",
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: 2,
//                 }}
//             >
//                 <NavLink to="/account" end>
//                     Profile
//                 </NavLink>
//                 <NavLink to="/account/orders">Orders</NavLink>
//                 <NavLink to="/account/favorites">Favorites</NavLink>
//                 <NavLink to="/account/cart">Cart</NavLink>
//             </Box>
//             <Box sx={{ flexGrow: 1 }}>
//                 <Outlet />
//             </Box>
//         </Stack>
//     );
// };

// export default AccountLayout;
