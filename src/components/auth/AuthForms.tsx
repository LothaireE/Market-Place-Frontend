import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
    Container,
    Divider,
    Paper,
    Stack,
    Tab,
    Tabs,
    Typography,
    Box,
} from "@mui/material";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { useAuthContext } from "../../context/useAppContext";
import Toast from "../common/Toast";

type LoginSuccessData = {
    user: {
        email: string;
        username: string;
    };
    accessToken: string;
};

const AuthForms = () => {
    const [tab, setTab] = useState(0);
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const context = useAuthContext();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    function handleLoginSuccess(data: LoginSuccessData) {
        if (!data) return;

        setToastMessage("Login successful! redirecting to home...");
        setOpenToast(true);
        // context.handeLogin?.(data);
        context.setAccessToken?.(data.accessToken);

        setTimeout(() => {
            navigate(from, { replace: true });
        }, 1500);
    }

    function handleSingUpSuccess() {
        setTab(0);
        setToastMessage("Sign up successful! You can now log in...");
        setOpenToast(true);
    }

    return (
        <Container
            maxWidth="sm"
            sx={{ display: "grid", placeItems: "center", minHeight: "100vh" }}
        >
            <Toast
                onOpen={openToast}
                onClose={() => setOpenToast(false)}
                message={toastMessage}
                severity="success"
            />
            <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
                <Stack spacing={4}>
                    <Typography variant="h5" fontWeight={700}>
                        Marketplace
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Welcome
                    </Typography>
                </Stack>

                <Tabs
                    value={tab}
                    onChange={(_, newValue) => {
                        setTab(newValue);
                    }}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    sx={{ mt: 4, mb: 2 }}
                >
                    <Tab id="login" label="Log In" />
                    <Tab id="signup" label="Sign Up" />
                </Tabs>

                <Divider sx={{ my: 2 }} />

                <Box
                    role="tabpanel"
                    hidden={tab !== 0}
                    id="tabpanel-0"
                    aria-labelledby="auth-tab-0"
                >
                    <Box>
                        <SignInForm
                            onSuccess={(data) =>
                                handleLoginSuccess(data ?? null)
                            }
                        />
                    </Box>
                </Box>
                <Box
                    role="tabpanel"
                    hidden={tab !== 1}
                    id="tabpanel-1"
                    aria-labelledby="auth-tab-1"
                >
                    <Box>
                        <SignUpForm onSuccess={handleSingUpSuccess} />
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default AuthForms;
