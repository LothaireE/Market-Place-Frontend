import {
    Box,
    Stack,
    Typography,
    Paper,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Button,
    Switch,
    FormControlLabel,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router";
import {
    useAuthContext,
    useCartContext,
    useFavoritesContext,
} from "../../context/useAppContext";
import RouterLinkButton from "../../components/common/RouterLinkButton";

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, logout, themeMode, toggleTheme } = useAuthContext();
    const { cartItems } = useCartContext();
    const { favorites } = useFavoritesContext();

    const initial =
        user?.username?.charAt(0).toUpperCase() ||
        user?.email?.charAt(0).toUpperCase() ||
        "?";

    // const cartCount = cartItems?.length ?? 0;
    // const favoritesCount = favorites?.length ?? 0;
    const cartCount = cartItems?.length ?? 0;
    const favoritesCount = favorites?.length ?? 0;

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight={600}>
                    My account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Manage your profile, preferences and activity on the
                    marketplace.
                </Typography>
            </Box>

            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={{ xs: 2, md: 3 }}
                alignItems={{ xs: "stretch", md: "flex-start" }}
            >
                <Paper
                    elevation={2}
                    sx={{
                        flexBasis: { md: 320 },
                        p: 3,
                        borderRadius: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2.5,
                    }}
                >
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                            sx={{
                                width: 64,
                                height: 64,
                                bgcolor: "primary.main",
                                fontSize: 28,
                                fontWeight: 600,
                            }}
                        >
                            {initial}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight={600}>
                                {user?.username || "Anonymous musician"}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                }}
                            >
                                <EmailIcon fontSize="small" />
                                {user?.email || "No email available"}
                            </Typography>
                        </Box>
                    </Stack>

                    <Divider />

                    <Box>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                        >
                            Theme
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={themeMode === "darkMode"}
                                    onChange={toggleTheme}
                                />
                            }
                            label={
                                themeMode === "darkMode"
                                    ? "Dark mode"
                                    : "Light mode"
                            }
                        />
                    </Box>

                    <Divider />

                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        sx={{ alignSelf: "flex-start", mt: 1 }}
                    >
                        Log out
                    </Button>
                </Paper>

                <Stack spacing={3} sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Paper
                        elevation={1}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 2 }}
                        >
                            <MusicNoteIcon color="primary" />
                            <Typography variant="h6" fontWeight={600}>
                                Activity overview
                            </Typography>
                        </Stack>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            A quick snapshot of your current activity.
                        </Typography>

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                        >
                            <Paper
                                variant="outlined"
                                sx={{
                                    flex: 1,
                                    p: 2,
                                    borderRadius: 2,
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <ShoppingCartIcon fontSize="small" />
                                    <Typography variant="subtitle2">
                                        Cart
                                    </Typography>
                                </Stack>
                                <Typography
                                    variant="h5"
                                    fontWeight={600}
                                    sx={{ mt: 1 }}
                                >
                                    {cartCount}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    item{cartCount !== 1 ? "s" : ""} currently
                                    in your cart
                                </Typography>
                            </Paper>

                            <Paper
                                variant="outlined"
                                sx={{
                                    flex: 1,
                                    p: 2,
                                    borderRadius: 2,
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <FavoriteIcon fontSize="small" />
                                    <Typography variant="subtitle2">
                                        Favorites
                                    </Typography>
                                </Stack>
                                <Typography
                                    variant="h5"
                                    fontWeight={600}
                                    sx={{ mt: 1 }}
                                >
                                    {favoritesCount}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    listing{favoritesCount !== 1 ? "s" : ""}{" "}
                                    saved
                                </Typography>
                            </Paper>
                        </Stack>
                    </Paper>

                    <Paper
                        elevation={1}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{ mb: 1.5 }}
                        >
                            Quick actions
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            Jump directly to your most used sections.
                        </Typography>

                        <List>
                            <ListItem
                                // button
                                // onClick={() => navigate("/account/orders")}
                                sx={{ borderRadius: 2, mb: 0.5 }}
                            >
                                <RouterLinkButton to={"orders"}>
                                    <ListItemIcon>
                                        <AccountCircleIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Orders"
                                        secondary="Track your purchases and shipments"
                                        sx={{ textTransform: "none" }}
                                        // slotProps={{
                                        //     secondary: {
                                        //         textTransform: "none",
                                        //     },
                                        // }}
                                    />
                                    <Chip label="History" size="small" />
                                </RouterLinkButton>
                            </ListItem>

                            <ListItem sx={{ borderRadius: 2, mb: 0.5 }}>
                                <RouterLinkButton to={"favorites"}>
                                    <ListItemIcon>
                                        <FavoriteIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Favorites"
                                        secondary="See the gear you love"
                                        sx={{ textTransform: "none" }}
                                        // slotProps={{
                                        //     secondary: {
                                        //         textTransform: "none",
                                        //     },
                                        // }}
                                    />
                                </RouterLinkButton>
                            </ListItem>

                            <ListItem sx={{ borderRadius: 2 }}>
                                <RouterLinkButton to={"cart"}>
                                    <ListItemIcon>
                                        <ShoppingCartIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Cart"
                                        secondary="Review before you checkout"
                                        sx={{ textTransform: "none" }}
                                        // slotProps={{
                                        //     secondary: {
                                        //         textTransform: "none",
                                        //     },
                                        // }}
                                    />
                                </RouterLinkButton>
                            </ListItem>
                        </List>
                    </Paper>
                </Stack>
            </Stack>
        </Box>
    );
};

export default ProfilePage;
