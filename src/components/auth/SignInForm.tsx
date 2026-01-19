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
import LinkButton from "../common/RouterLinkButton";
import { useAuthContext } from "../../context/useAppContext";

type SuccessData = {
    user: {
        email: string;
        username: string;
    };
    accessToken: string;
};

type SignInFormProps = {
    onSuccess?: (data: SuccessData) => void;
};

const SignInForm = ({ onSuccess }: SignInFormProps) => {
    const { login, loading, error: authError } = useAuthContext();

    const [email, setEmail] = useState("john@example.com");
    const [password, setPassword] = useState("tadaronne");
    const [remember, setRemember] = useState(true);
    const [info, setInfo] = useState<string | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setInfo(null);
        setLocalError(null);

        if (!email.includes("@")) {
            setLocalError("Invalid email.");
            return;
        }
        if (password.length < 6) {
            setLocalError("Password must be at least 6 characters.");
            return;
        }

        try {
            const data = await login({ email, password, remember });
            setInfo("Sign in successful!");
            onSuccess?.(data);
        } catch (error) {
            if (error instanceof Error && !authError) {
                setLocalError(error.message);
            } else {
                setLocalError("An error occurred during sign in.");
            }
        }
    };

    const displayError = localError || authError;

    return (
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
            <Stack spacing={2}>
                <TextField
                    label="Email"
                    required
                    fullWidth
                    id="email"
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
                {displayError && (
                    <Typography color="error">{displayError}</Typography>
                )}
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
                    <LinkButton style={{ textTransform: "none" }} to="/signup">
                        Sign up
                    </LinkButton>
                </Typography>
            </Stack>
        </Box>
    );
};

export default SignInForm;
