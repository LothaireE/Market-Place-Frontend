import {
    Box,
    TextField,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    Stack,
    Typography,
} from "@mui/material";
import { useState } from "react";
import PasswordField from "./PasswordField";
import LinkButton from "../material-ui/MuiLink";
import { API_URLS } from "../../config/config";

type SuccessData = {
    user: {
        id: string;
        email: string;
        username: string;
    };
    accessToken: string;
    refreshToken: string;
};

type SignInFormProps = {
    onSuccess?: (data: SuccessData) => void;
};

const SignInForm = ({ onSuccess }: SignInFormProps) => {
    const [email, setEmail] = useState("john@example.com");
    const [password, setPassword] = useState("tadaronne");
    const [remember, setRemember] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setInfo(null);

        if (!email.includes("@")) {
            setError("Invalid email.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(API_URLS.userLogin, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, remember }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to sign in.");
            }
            const { data } = await response.json();

            setInfo("Sign in successful!");
            onSuccess?.(data ?? null);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message || "An error occurred during sign in.");
            } else {
                setError("An error occurred during sign in.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            SignInForm
            <Box
                component="form"
                noValidate
                sx={{ mt: 1 }}
                onSubmit={handleSubmit}
            >
                <Stack spacing={2}>
                    <TextField
                        label="Email"
                        // margin="normal"
                        required
                        fullWidth
                        id="email"
                        name="email"
                        autoComplete="email"
                        // autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <PasswordField
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Remember me"
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    {info && <Typography color="primary">{info}</Typography>}
                    {/* {error && <Alert severity="error">{error}</Alert>}
                    {info && <Alert severity="success">{info}</Alert>} */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <CircularProgress size={20} sx={{ mr: 1 }} />{" "}
                                Connection...
                            </>
                        ) : (
                            "Connection"
                        )}
                    </Button>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        align="center"
                    >
                        Don't have an account?
                        <LinkButton
                            style={{ textTransform: "none" }}
                            to="/signup"
                        >
                            Sign up
                        </LinkButton>
                    </Typography>
                </Stack>
            </Box>
        </div>
    );
};

export default SignInForm;
