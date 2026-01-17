import {
    Box,
    Typography,
    Container,
    Grid,
    Paper,
    Stack,
    Button,
    Chip,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import StorefrontIcon from "@mui/icons-material/Storefront";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EuroIcon from "@mui/icons-material/Euro";
import { useNavigate } from "react-router";
import { useSellerContext } from "../../context/useAppContext"; // adapte le chemin si besoin
import { capitalizeFirstLetter } from "../../utils/textFormat";
import { GET_SELLER_PRODUCTS } from "../../library/graphql/queries/products";
import { useQuery } from "@apollo/client";
import type { Product } from "../../types/product.type";

const fakeStats = {
    activeListings: 8,
    soldThisMonth: 5,
    pendingOrders: 2,
    revenueThisMonth: 1450,
    profileViews: 320,
    favoritesCount: 47,
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "Active":
            return "success";
        case "Reserved":
            return "warning";
        case "Sold":
            return "default";
        default:
            return "default";
    }
};

export const ListingViews = ({ viewsCount = 0 }) => {
    return (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 1 }}>
            <VisibilityIcon fontSize="small" />
            <Typography variant="caption" color="text.secondary">
                {viewsCount}
            </Typography>
        </Stack>
    );
};

export const ListingPriceDetails = ({ price = 0, status = "pending" }) => {
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
                {price} €
            </Typography>
            <Chip
                label={status}
                size="small"
                color={getStatusColor(status)}
                sx={{
                    textTransform: "capitalize",
                }}
            />
        </Stack>
    );
};

//TODO split SellerDashboardPage into comp
const SellerDashboardPage = () => {
    const navigate = useNavigate();
    // const { user } = useAuthContext(); // si ton hook s'appelle différemment, adapte-le
    const { sellerProfile } = useSellerContext();

    const pagination = { sortBy: "DATE", sortDirection: "DESC" };
    const { data, loading, error } = useQuery(GET_SELLER_PRODUCTS, {
        variables: { pagination: pagination },
    });

    const handleCreateListing = () => {
        navigate("/seller/new");
    };

    const handleViewProducts = () => {
        navigate("/seller/products");
    };

    const username = capitalizeFirstLetter(
        sellerProfile?.user.username ?? "seller"
    );

    if (loading) {
        return (
            <Container
                maxWidth="lg"
                sx={{ py: 4, display: "flex", justifyContent: "center" }}
                // sx={{ py: 6, display: "flex", justifyContent: "center" }}
            >
                <CircularProgress />
            </Container>
        );
    }
    if (error || !data?.sellerProducts) {
        return (
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Typography variant="h5" color="error" gutterBottom>
                    Unable to load this listing.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    The instrument may have been removed or the link is
                    incorrect.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header + quick actions */}

            <Box
                sx={{
                    mb: 4,
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", md: "center" },
                    gap: 2,
                }}
            >
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Dashboard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {sellerProfile
                            ? `Welcome back, ${username}. Track your listings and performance.`
                            : "Track your listings, orders and performance as a seller."}
                    </Typography>
                </Box>

                <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={handleCreateListing}
                        sx={{ borderRadius: 999 }}
                    >
                        List a new instrument
                    </Button>
                    {/* <Button
                        variant="outlined"
                        startIcon={<StorefrontIcon />}
                        onClick={handleViewProducts}
                        sx={{ borderRadius: 999 }}
                    >
                        View all listings
                    </Button> */}
                </Stack>
            </Box>

            {/* Top stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        icon={<StorefrontIcon />}
                        label="Active listings"
                        value={fakeStats.activeListings} // TODO: implement active listing
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    {/* <Grid> */}
                    <StatCard
                        icon={<ShoppingCartIcon />}
                        label="Sold this month"
                        value={fakeStats.soldThisMonth}
                    />
                </Grid>
                {/* <Grid> */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        icon={<TrendingUpIcon />}
                        label="Revenue this month"
                        value={`${fakeStats.revenueThisMonth} €`}
                    />
                </Grid>
                {/* <Grid item xs={12} sm={6} md={3}> */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        icon={<EuroIcon />}
                        label="Pending orders"
                        value={fakeStats.pendingOrders}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* latest  */}
                <Grid size={{ xs: 12, sm: 6, md: 7 }}>
                    <Paper
                        elevation={1}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Box
                            sx={{
                                mb: 2,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="h6" fontWeight={600}>
                                Your latest
                            </Typography>
                            <Button size="small" onClick={handleViewProducts}>
                                View all
                            </Button>
                        </Box>

                        {data.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                You do not have any listings yet. Start by
                                adding your first instrument.
                            </Typography>
                        ) : (
                            <List dense disablePadding>
                                {data.sellerProducts
                                    .slice(0, 5)
                                    .map((product: Product) => {
                                        const viewsCount = Math.floor(
                                            Math.random() * 100
                                        );
                                        return (
                                            <ListItem
                                                key={product.id}
                                                sx={{
                                                    borderRadius: 2,
                                                    mb: 1,
                                                    px: 1.5,
                                                    "&:hover": {
                                                        bgcolor: "action.hover",
                                                        cursor: "pointer",
                                                    },
                                                }}
                                                onClick={() =>
                                                    navigate(
                                                        `/products/${product.id}`
                                                    )
                                                }
                                                secondaryAction={
                                                    <ListingViews
                                                        viewsCount={viewsCount}
                                                    />
                                                }
                                            >
                                                <ListItemText
                                                    disableTypography
                                                    primary={
                                                        <Typography
                                                            variant="body1"
                                                            fontWeight={500}
                                                            noWrap
                                                        >
                                                            {product.name}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <ListingPriceDetails
                                                            price={
                                                                product.price
                                                            }
                                                            status="Pending"
                                                            // status={product.status}
                                                        />
                                                    }
                                                />
                                            </ListItem>
                                        );
                                    })}
                            </List>
                        )}
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                    <Paper
                        elevation={1}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            mb: 3,
                        }}
                    >
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Profile engagement
                        </Typography>

                        <Stack spacing={2} sx={{ mb: 2 }}>
                            <EngagementRow
                                icon={<VisibilityIcon fontSize="small" />}
                                label="Profile views"
                                value={fakeStats.profileViews}
                                progress={70}
                            />
                            <EngagementRow
                                icon={<FavoriteBorderIcon fontSize="small" />}
                                label="Listings favorited"
                                value={fakeStats.favoritesCount}
                                progress={55}
                            />
                        </Stack>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            Good photos and detailed descriptions help your
                            instruments sell faster. Make sure you show any wear
                            and include all specs.
                        </Typography>
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 3,
                            border: (theme) =>
                                `1px dashed ${theme.palette.divider}`,
                            bgcolor: "background.default",
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            gutterBottom
                        >
                            Tips to boost your sales
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            • Use clear, well-lit photos from multiple angles.
                            <br />
                            • Mention brand, model, year and any modifications.
                            <br />
                            • Be honest about cosmetic wear and technical
                            issues.
                            <br />• Respond quickly to potential buyers.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

type StatCardProps = {
    icon: React.ReactNode;
    label: string;
    value: string | number;
};

const StatCard = ({ icon, label, value }: StatCardProps) => {
    return (
        <Paper
            elevation={1}
            sx={{
                p: 2.5,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
            }}
        >
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {icon}
            </Box>
            <Box>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                >
                    {label}
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                    {value}
                </Typography>
            </Box>
        </Paper>
    );
};

type EngagementRowProps = {
    icon: React.ReactNode;
    label: string;
    value: number;
    progress: number;
};

const EngagementRow = ({
    icon,
    label,
    value,
    progress,
}: EngagementRowProps) => {
    return (
        <Box>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 0.5 }}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    {icon}
                    <Typography variant="body2">{label}</Typography>
                </Stack>
                <Typography variant="body2" fontWeight={600}>
                    {value}
                </Typography>
            </Stack>
            <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ borderRadius: 999, height: 6 }}
            />
        </Box>
    );
};

export default SellerDashboardPage;
