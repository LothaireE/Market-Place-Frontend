import { useMemo, useState } from "react";
import {
    Box,
    Container,
    Paper,
    Typography,
    Stack,
    TextField,
    Button,
    Alert,
    Chip,
    Divider,
    CircularProgress,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Grid,
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PaymentsIcon from "@mui/icons-material/Payments";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { gql, useMutation } from "@apollo/client";
import { useAuthContext } from "../../context/useAppContext";
import { useNavigate } from "react-router";
import Toast from "../../components/common/Toast";

type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

type SellerProfileInput = {
    bio?: string | null;
    payoutAccount?: string | null;
    shopName?: string | null;
    verified: VerificationStatus;
};

const CREATE_SELLER_PROFILE = gql`
    mutation CreateSellerProfile($newSellerProfile: SellerProfileInput!) {
        createSellerProfile(newSellerProfile: $newSellerProfile) {
            id
            shopName
            verified
            bio
            payoutAccount
            createdAt
        }
    }
`;

//TODO make this form an  external component
export default function SellerOnboardingPage() {
    const { isAuthenticated } = useAuthContext();
    const navigate = useNavigate();

    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const [shopName, setShopName] = useState("");
    const [bio, setBio] = useState("");
    const [payoutAccount, setPayoutAccount] = useState("");
    const [verifiedChoice, setVerifiedChoice] =
        useState<VerificationStatus>("PENDING");

    const [localError, setLocalError] = useState<string | null>(null);

    const [createSellerProfile, { loading, error }] = useMutation<
        {
            createSellerProfile: {
                id: string;
                bio?: string | null;
                payoutAccount?: string | null;
                shopName?: string | null;
                verified: VerificationStatus;
            };
        },
        { newSellerProfile: SellerProfileInput }
    >(CREATE_SELLER_PROFILE);

    const canSubmit = useMemo(() => {
        if (!isAuthenticated) return false;
        if (loading) return false;
        if (!shopName.trim()) return false;
        // payoutAccount is optional for now, but I might want to require it
        // if (!payoutAccount.trim()) return false;
        return true;
    }, [isAuthenticated, loading, shopName]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (!isAuthenticated) {
            setLocalError("You must be logged in to become a seller.");
            return;
        }
        if (!shopName.trim()) {
            setLocalError("Please enter a shop name.");
            return;
        }

        try {
            const payload: SellerProfileInput = {
                shopName: shopName.trim(),
                bio: bio.trim() ? bio.trim() : null,
                payoutAccount: payoutAccount.trim()
                    ? payoutAccount.trim()
                    : null,
                verified: verifiedChoice, // usually PENDING
            };

            await createSellerProfile({
                variables: { newSellerProfile: payload },
            });

            setToastMessage("Seller profile created successfully!");
            setOpenToast(true);
            setTimeout(() => {
                navigate("/seller");
            }, 1500);
        } catch (e) {
            setLocalError(
                e instanceof Error ? e.message : "Something went wrong.",
            );
        }
    };

    return (
        <Box sx={{ py: 4 }}>
            <Container maxWidth="lg">
                <Toast
                    onOpen={openToast}
                    onClose={() => setOpenToast(false)}
                    message={toastMessage}
                    severity="success"
                />
                <Stack spacing={1} sx={{ mb: 3 }}>
                    <Typography variant="h4" fontWeight={800}>
                        Become a seller
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Set up your seller profile in under a minute.
                    </Typography>
                </Stack>

                <Grid container spacing={3} alignItems="flex-start">
                    {/* LEFT: form */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Paper
                            variant="outlined"
                            sx={{ p: 3, borderRadius: 3 }}
                            component="form"
                            onSubmit={handleSubmit}
                        >
                            <Stack spacing={2.25}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <StorefrontIcon fontSize="small" />
                                    <Typography variant="h6" fontWeight={800}>
                                        Seller profile
                                    </Typography>
                                </Stack>

                                <TextField
                                    label="Shop name"
                                    placeholder="e.g. Alex’s Vintage Closet"
                                    value={shopName}
                                    onChange={(e) =>
                                        setShopName(e.target.value)
                                    }
                                    required
                                    fullWidth
                                />

                                <TextField
                                    label="Bio (optional)"
                                    placeholder="Tell buyers what you sell and what they can expect."
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    fullWidth
                                    multiline
                                    minRows={3}
                                />

                                <Divider />

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <PaymentsIcon fontSize="small" />
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={800}
                                    >
                                        Payouts (optional for now)
                                    </Typography>
                                </Stack>

                                <TextField
                                    label="Payout account (optional)"
                                    placeholder="IBAN / PayPal / Stripe account id..."
                                    value={payoutAccount}
                                    onChange={(e) =>
                                        setPayoutAccount(e.target.value)
                                    }
                                    fullWidth
                                />

                                <Divider />

                                <FormControl>
                                    <FormLabel>Verification status</FormLabel>
                                    <RadioGroup
                                        value={verifiedChoice}
                                        onChange={(e) =>
                                            setVerifiedChoice(
                                                e.target
                                                    .value as VerificationStatus,
                                            )
                                        }
                                    >
                                        <FormControlLabel
                                            value="PENDING"
                                            control={<Radio />}
                                            label="Pending (recommended)"
                                        />
                                        <FormControlLabel
                                            value="UNVERIFIED"
                                            control={<Radio />}
                                            label="Unverified"
                                        />
                                        <FormControlLabel
                                            value="VERIFIED"
                                            control={<Radio />}
                                            label="Verified (admin only)"
                                            disabled
                                        />
                                    </RadioGroup>
                                </FormControl>

                                {(localError || error?.message) && (
                                    <Alert severity="error">
                                        {localError ?? error?.message}
                                    </Alert>
                                )}

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={!canSubmit}
                                        endIcon={
                                            loading ? undefined : (
                                                <ArrowForwardIcon fontSize="small" />
                                            )
                                        }
                                        sx={{ borderRadius: 999, px: 4 }}
                                    >
                                        {loading ? (
                                            <>
                                                <CircularProgress
                                                    size={18}
                                                    sx={{ mr: 1 }}
                                                />
                                                Creating...
                                            </>
                                        ) : (
                                            "Create seller profile"
                                        )}
                                    </Button>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* RIGHT: info */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                position: "sticky",
                                top: 88,
                            }}
                        >
                            <Stack spacing={2}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <VerifiedUserIcon fontSize="small" />
                                    <Typography variant="h6" fontWeight={800}>
                                        What you get
                                    </Typography>
                                </Stack>

                                <Stack spacing={1}>
                                    <Benefit
                                        title="List items for sale"
                                        description="Create listings and manage your inventory."
                                    />
                                    <Benefit
                                        title="Seller dashboard"
                                        description="Track orders and manage your shop profile."
                                    />
                                    <Benefit
                                        title="Payouts (later)"
                                        description="Add your payout account when payments go live."
                                    />
                                </Stack>

                                <Divider />

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <Chip
                                        label="Tip"
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                    />
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        We recommend starting with{" "}
                                        <b>Pending</b> verification.
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

function Benefit({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "background.paper",
                border: (t) => `1px solid ${t.palette.divider}`,
            }}
        >
            <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {description}
            </Typography>
        </Box>
    );
}
