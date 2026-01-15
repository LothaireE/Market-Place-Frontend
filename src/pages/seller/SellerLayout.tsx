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
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

const SellerLayout = () => {
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
                    width: 260,
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
                    <Stack direction="row" spacing={1} alignItems="center">
                        <MusicNoteIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                            Seller panel
                        </Typography>
                    </Stack>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Manage your sellings and profile.
                    </Typography>
                </Box>

                <Divider sx={{ display: { xs: "none", md: "block" } }} />

                <List component="nav" disablePadding>
                    <ListItemButton
                        component={NavLink}
                        to="/seller"
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
                            <DashboardIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>

                    <ListItemButton
                        component={NavLink}
                        to="/seller/products"
                        sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            "&.active": {
                                bgcolor: "action.selected",
                            },
                        }}
                    >
                        <ListItemIcon>
                            <StorefrontIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="My listings" />
                    </ListItemButton>

                    <ListItemButton
                        component={NavLink}
                        to="/seller/new"
                        sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            "&.active": {
                                bgcolor: "action.selected",
                            },
                        }}
                    >
                        <ListItemIcon>
                            <AddCircleOutlineIcon fontSize="small" />
                        </ListItemIcon>
                        {/* <ListItemText primary="List a new instrument" /> */}
                        <ListItemText primary="Sell some more?" />
                    </ListItemButton>

                    <ListItemButton
                        component={NavLink}
                        to="/seller/profile"
                        sx={{
                            borderRadius: 2,
                            "&.active": {
                                bgcolor: "action.selected",
                            },
                        }}
                    >
                        <ListItemIcon>
                            <AccountCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Seller profile" />
                    </ListItemButton>
                </List>
            </Paper>

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Outlet />
            </Box>
        </Stack>
    );
};

export default SellerLayout;
