import { useEffect, useState, useRef, useMemo } from "react";
import { API_URLS } from "../../config/env";
import AuthContext, { type ThemeMode } from "../authContext";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { appTheme, appThemeDark } from "../../theme/appTheme";
import { AUTH_ACCESS_TOKEN, graphqlClient } from "../../library/graphql/client";

type LoginParams = {
    email: string;
    password: string;
    remember: boolean;
};

type User = {
    id: string;
    email: string;
    username: string;
};
export type SuccessData = {
    user: User;
    accessToken: string;
};

export default function AuthContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const isMounted = useRef(false); // prevent double execution in StrictMode
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [authStatus, setAuthStatus] = useState<
        "loading" | "unauthenticated" | "authenticated"
    >("loading");
    const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
        const savedTheme = localStorage.getItem(
            "theme-mode",
        ) as ThemeMode | null;
        return savedTheme ?? "lightMode";
    });

    useEffect(() => {
        if (isMounted.current) return;
        isMounted.current = true;

        (async () => {
            try {
                const response = await fetch(API_URLS.refreshToken, {
                    method: "POST",
                    credentials: "include",
                });

                if (!response.ok) {
                    setAccessToken(null);
                    setUser(null);
                    localStorage.removeItem(AUTH_ACCESS_TOKEN);
                    setAuthStatus("unauthenticated");
                    return;
                }
                const data = await response.json();
                setAccessToken(data.accessToken ?? null);
                setUser(data.user ?? null);
                localStorage.setItem(AUTH_ACCESS_TOKEN, data.accessToken);
                setAuthStatus("authenticated");
            } catch {
                setAccessToken(null);
                setAuthStatus("unauthenticated");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (accessToken) localStorage.setItem(AUTH_ACCESS_TOKEN, accessToken);
    }, [accessToken]);

    async function login({
        email,
        password,
        remember,
    }: LoginParams): Promise<SuccessData> {
        setError(null);
        setLoading(true);
        setAuthStatus("loading");

        try {
            const response = await fetch(API_URLS.userLogin, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, remember }),
            });

            if (!response.ok) {
                setAuthStatus("unauthenticated");
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to sign in.");
            }

            const { data } = await response.json();

            const newAccessToken = data.accessToken ?? null;

            setUser(data.user ?? null);
            setAccessToken(newAccessToken);

            if (newAccessToken)
                localStorage.setItem(AUTH_ACCESS_TOKEN, newAccessToken);
            else localStorage.removeItem(AUTH_ACCESS_TOKEN);

            await graphqlClient.resetStore();

            setAuthStatus("authenticated");

            return data as SuccessData;
        } catch (err) {
            setAuthStatus("unauthenticated");
            if (err instanceof Error) {
                setError(err.message || "An error occurred during sign in.");
                throw err;
            } else {
                const unknownError = new Error(
                    "An error occurred during sign in.",
                );
                setError(unknownError.message);
                throw unknownError;
            }
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        await fetch(API_URLS.userLogout, {
            method: "POST",
            credentials: "include",
        });
        setAuthStatus("unauthenticated");
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem(AUTH_ACCESS_TOKEN);
        await graphqlClient.clearStore();
    }

    const theme = useMemo(
        () => createTheme(themeMode === "darkMode" ? appThemeDark : appTheme),
        [themeMode],
    );

    const toggleTheme = () =>
        setThemeMode((m) => (m === "lightMode" ? "darkMode" : "lightMode"));

    const isAuthenticated = authStatus === "authenticated";

    const avatarLetter =
        user?.username?.charAt(0).toUpperCase() ||
        user?.email?.charAt(0).toUpperCase() ||
        "?";

    const contextValue = {
        accessToken,
        user,
        loading,
        setAccessToken,
        logout,
        login,
        toggleTheme,
        themeMode,
        error,
        authStatus,
        isAuthenticated,
        avatarLetter,
    };
    return (
        <AuthContext.Provider value={contextValue}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AuthContext.Provider>
    );
}
