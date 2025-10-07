import { useState } from "react";

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
import { useAppContext } from "../../context/useAppContext";
import Toast from "../Toast";

type SuccessDataType = {
    user: {
        email: string;
        username: string;
    };
    accessToken: string;
    refreshToken: string;
};

const AuthForms = () => {
    const [tab, setTab] = useState(0);
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const context = useAppContext();

    function handleSuccess(data: SuccessDataType) {
        if (!data) return;

        setToastMessage("Login successful! redirecting to home...");
        setOpenToast(true);
        context.handeLogin?.(data);

        // redirect to home now
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
                            onSuccess={(data) => handleSuccess(data ?? null)}
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
                        <SignUpForm
                            onSuccess={() => {
                                setTab(0);
                            }}
                        />
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default AuthForms;
