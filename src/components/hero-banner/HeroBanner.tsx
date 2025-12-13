import {
    Box,
    Container,
    Typography,
    Stack,
    TextField,
    InputAdornment,
    IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import InfoChip from "./InfoChip";
import MiniProductBadge from "./MiniProductBadge";
import { useSellerContext } from "../../context/useAppContext";
import RouterLinkButton from "../common/RouterLinkButton";

const HeroBanner = () => {
    const { sellerProfile } = useSellerContext();
    return (
        <Box
            sx={{
                bgcolor: "background.default",
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    display: { xs: "block", md: "flex" }, // "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "center",
                    py: 5,
                    gap: 4,
                }}
            >
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h3" fontWeight={700} gutterBottom>
                        Sell your gear,
                        <br />
                        give your wallet a boost.
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        Buy and sell used instruments and music gear easily and
                        securely.
                    </Typography>

                    {/* Search bar */}
                    <TextField
                        variant="outlined"
                        fullWidth
                        placeholder="Search for an instrument, brand, or setup..."
                        sx={{ mb: 2, bgcolor: "background.paper" }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton edge="end">
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Stack direction="row" spacing={2}>
                        <RouterLinkButton
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForwardIcon />}
                            sx={{ borderRadius: 999 }}
                            to={"products/"}
                        >
                            Browse listings
                        </RouterLinkButton>
                        {sellerProfile && (
                            <RouterLinkButton
                                variant="outlined"
                                size="large"
                                startIcon={<AddCircleOutlineIcon />}
                                sx={{ borderRadius: 999 }}
                                to={"seller/products/new"}
                            >
                                Post a listing
                            </RouterLinkButton>
                        )}
                    </Stack>

                    {/* Mini info */}
                    <Stack
                        spacing={{ xs: 1, md: 0 }}
                        sx={{
                            mt: 3,
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                        }}
                    >
                        <InfoChip label="Secure payments" />
                        <InfoChip label="Buyer protection" />
                        <InfoChip label="Wide selection of instruments and gear" />
                    </Stack>
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        display: { xs: "none", md: "flex" },
                        justifyContent: "center",
                    }}
                >
                    <Box
                        sx={{
                            width: 280,
                            height: 520,
                            borderRadius: 5,
                            bgcolor: "grey.900",
                            color: "common.white",
                            boxShadow: 6,
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                backgroundImage:
                                    "url(https://images.pexels.com/photos/9915186/pexels-photo-9915186.jpeg?auto=compress&cs=tinysrgb&w=800)",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                filter: "brightness(0.6)",
                            }}
                        />
                        <Box
                            sx={{
                                position: "relative",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                p: 2,
                            }}
                        >
                            <Typography variant="h6">
                                Your home studio 2.0
                            </Typography>
                            <Stack spacing={1}>
                                <MiniProductBadge
                                    title="Acoustic guitar"
                                    price="120 €"
                                />
                                <MiniProductBadge
                                    title="MIDI keyboard"
                                    price="220 €"
                                    avatarBg="#ffb6c1"
                                />
                                <MiniProductBadge
                                    title="Guitar amp"
                                    price="180 €"
                                    avatarBg="#90caf9"
                                />
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default HeroBanner;
