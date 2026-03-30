import { useEffect, useState } from "react";
import {
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { gql, useMutation } from "@apollo/client";
import type { SellerProfile } from "../../types/seller.type";
import { useSellerContext } from "../../context/useAppContext";

const UPDATE_SELLER_PROFILE = gql`
    mutation UpdateSellerProfile(
        $sellerProfileUpdates: UpdateSellerProfileInput!
    ) {
        updateSellerProfile(sellerProfileUpdates: $sellerProfileUpdates) {
            id
            bio
            payoutAccount
            shopName
            verified
        }
    }
`;

type UpdateSellerProfileInput = {
    bio?: string;
    payoutAccount?: string;
    shopName?: string;
    userId: string;
    avatarUrl?: string | null;
};

//TODO split component
const SellerProfilePage = () => {
    const { sellerProfile, loading: sellerContextLoading } = useSellerContext();

    const [updateProfile, { loading: mutationLoading }] = useMutation<
        { updateSellerProfile: SellerProfile },
        { sellerProfileUpdates: UpdateSellerProfileInput }
    >(UPDATE_SELLER_PROFILE);

    const [shopName, setShopName] = useState("");
    const [bio, setBio] = useState("");
    const [payoutAccount, setPayoutAccount] = useState("");
    const [location, setLocation] = useState("");
    const [info, setInfo] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);

    useEffect(() => {
        if (!sellerProfile) return;

        setShopName(sellerProfile.shopName ?? "");
        setBio(sellerProfile.bio ?? "");
        setPayoutAccount(sellerProfile.payoutAccount ?? "");
        //  location:to implement maybe
        // setAvatarUrl(sellerProfile.avatarUrl ?? "");
    }, [sellerProfile]);

    const handleSave = async () => {
        if (!sellerProfile) return;
        setInfo(null);
        setSaveError(null);

        try {
            await updateProfile({
                variables: {
                    sellerProfileUpdates: {
                        bio,
                        payoutAccount,
                        shopName,
                        userId: sellerProfile.id, // 
                        // avatarUrl: avatarUrl || null, 
                    },
                },
                optimisticResponse: {
                    updateSellerProfile: {
                        __typename: "SellerProfile",
                        id: sellerProfile.id,
                        bio,
                        payoutAccount,
                        shopName,
                        verified: sellerProfile.verified, // readonly
                        // fields below to maintain cache coherent
                        createdAt: sellerProfile.createdAt,
                        updatedAt:
                            sellerProfile.updatedAt ?? sellerProfile.createdAt,
                        products: sellerProfile.products ?? [],
                        user: sellerProfile.user,
                        rating: sellerProfile.rating ?? null,
                        userId: sellerProfile.userId,
                        // avatarUrl: sellerProfile.avatarUrl ?? null,
                    },
                },
            });

            setInfo("Your seller profile has been updated.");
        } catch (err) {
            console.error(err);
            setSaveError("Failed to update your profile. Please try again.");
        }
    };

    if (sellerContextLoading) {
        return (
            <Box
                sx={{
                    minHeight: "60vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!sellerProfile) {
        return (
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Typography variant="h5" color="error" gutterBottom>
                    Unable to load your seller profile.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Please try again later.
                </Typography>
            </Container>
        );
    }

    const memberSinceFormatted = new Date(
        sellerProfile.createdAt
    ).getFullYear();

    const verificationLabel =
        sellerProfile.verified === "VERIFIED"
            ? "Verified seller"
            : sellerProfile.verified === "REJECTED"
            ? "Verification rejected"
            : "Verification pending";

    const verificationColor: "success" | "error" | "warning" =
        sellerProfile.verified === "VERIFIED"
            ? "success"
            : sellerProfile.verified === "REJECTED"
            ? "error"
            : "warning";

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
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
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Seller profile
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        This is how buyers see you when browsing your
                        instruments.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                    <Chip
                        icon={<MusicNoteIcon />}
                        label="Music gear seller"
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: 999 }}
                    />
                    <Chip
                        label={verificationLabel}
                        color={verificationColor}
                        variant="filled"
                        sx={{ borderRadius: 999 }}
                    />
                </Stack>
            </Box>

            <Grid container spacing={3}>
                {/* Left: avatar + public info preview */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        elevation={1}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            mb: 3,
                            textAlign: "center",
                        }}
                    >
                        <Avatar
                            // src={avatarUrl || undefined}
                            src={ undefined}
                            sx={{
                                width: 90,
                                height: 90,
                                mx: "auto",
                                mb: 2,
                                bgcolor: "primary.main",
                            }}
                        >
                            {sellerProfile.user.username
                                .charAt(0)
                                .toUpperCase()}
                        </Avatar>

                        <Typography variant="h6" fontWeight={600}>
                            {shopName || "Your shop name"}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                        >
                            {sellerProfile.user.username}
                        </Typography>

                        {location && (
                            <Stack
                                direction="row"
                                spacing={0.5}
                                justifyContent="center"
                                alignItems="center"
                                sx={{ mb: 1 }}
                            >
                                <LocationOnIcon
                                    fontSize="small"
                                    color="action"
                                />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {location}
                                </Typography>
                            </Stack>
                        )}

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            {bio}
                        </Typography>
                    </Paper>

                    {/* Stats / Credibility */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 3,
                            border: (theme) =>
                                `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            gutterBottom
                        >
                            Stats
                        </Typography>

                        <Stack spacing={1.5}>
                            <StatRow
                                icon={<StarIcon fontSize="small" />}
                                label="Rating"
                                value={
                                    sellerProfile.rating
                                        ? `${sellerProfile.rating.toFixed(
                                              1
                                          )} / 5`
                                        : "No rating yet"
                                }
                            />
                            {memberSinceFormatted && (
                                <StatRow
                                    icon={
                                        <CalendarMonthIcon fontSize="small" />
                                    }
                                    label="Member since"
                                    value={memberSinceFormatted}
                                />
                            )}
                        </Stack>
                    </Paper>
                </Grid>

                {/*  form */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper
                        elevation={1}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                        }}
                    >
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Edit your seller profile
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            Information here will be visible on your public
                            seller page and next to your listings.
                        </Typography>

                        <Stack spacing={2.5}>
                            <TextField
                                label="Shop name"
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                fullWidth
                                helperText="Example: 'Guitar Corner Berlin', 'Vintage Synths & Keys'"
                            />

                            <TextField
                                label="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                fullWidth
                                helperText="City / country helps buyers understand where the gear will be shipped from."
                            />

                            <TextField
                                label="Short bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                fullWidth
                                multiline
                                minRows={3}
                                helperText="Tell buyers who you are, what kind of instruments you sell, and how you take care of your gear."
                            />

                            {/* <TextField
                                label="Avatar image URL"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                fullWidth
                                helperText="Optional. Link to an image that represents your shop (logo, profile picture…)."
                            /> */}

                            {saveError && (
                                <Typography color="error" variant="body2">
                                    {saveError}
                                </Typography>
                            )}
                            {info && (
                                <Typography color="primary" variant="body2">
                                    {info}
                                </Typography>
                            )}

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    mt: 1,
                                }}
                            >
                                <Button
                                    variant="contained"
                                    onClick={handleSave}
                                    disabled={mutationLoading}
                                    sx={{ borderRadius: 999, minWidth: 180 }}
                                >
                                    {mutationLoading ? (
                                        <>
                                            <CircularProgress
                                                size={18}
                                                sx={{ mr: 1 }}
                                            />
                                            Saving…
                                        </>
                                    ) : (
                                        "Save changes"
                                    )}
                                </Button>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

type StatRowProps = {
    icon: React.ReactNode;
    label: string;
    value: string | number;
};

const StatRow = ({ icon, label, value }: StatRowProps) => {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
        >
            <Stack direction="row" spacing={1} alignItems="center">
                {icon}
                <Typography variant="body2">{label}</Typography>
            </Stack>
            <Typography variant="body2" fontWeight={600}>
                {value}
            </Typography>
        </Stack>
    );
};

export default SellerProfilePage;
