import { useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import PasswordField from "./PasswordField";
import LinkButton from "../material-ui/MuiLink";
import { API_URLS } from "../../config/config";

type User = { id: string; email: string; username: string };

type SignUpFormProps = { onSuccess?: (user: User) => void };

const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [accept, setAccept] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setInfo(null);

        if (username.trim().length < 3) {
            setError("Username must be at least 3 characters.");
            return;
        }
        if (!email.includes("@")) {
            setError("Invalid email.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!accept) {
            setError("You must accept the terms and conditions.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(API_URLS.userRegister, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    confirmPassword,
                    accept,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to register.");
            }
            const { data } = await response.json();

            setInfo("Registration successful! You can now log in.");
            onSuccess?.(data ?? null);
        } catch (error) {
            if (error instanceof Error) {
                setError(
                    error.message || "An error occurred during registration."
                );
            } else {
                setError("AAn error occurred during registration.");
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            SignUpForm
            <Box
                component="form"
                noValidate
                sx={{ mt: 1 }}
                onSubmit={handleSubmit}
            >
                <Stack spacing={2}>
                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Email"
                        required
                        fullWidth
                        id="register-email"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <PasswordField
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <PasswordField
                        label="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={accept}
                                onChange={(e) => setAccept(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Accept terms and conditions"
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    {info && <Typography color="primary">{info}</Typography>}
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
                                Registration...
                            </>
                        ) : (
                            "Registration"
                        )}
                    </Button>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        align="center"
                    >
                        Already have an account?
                        <LinkButton
                            style={{ textTransform: "none" }}
                            to="/login"
                        >
                            Log in
                        </LinkButton>
                    </Typography>
                </Stack>
            </Box>
        </div>
    );
};

export default SignUpForm;
