import { useMemo, useState, type ReactNode } from "react";
import AppContext, { type ThemeMode } from "./appContext";
import { ThemeProvider, createTheme } from "@mui/material";
import { appTheme, appThemeDark } from "../theme/appTheme";

type ContextProps = {
    children: ReactNode; //Represents all of the things React can render.
    // Where ReactElement only represents JSX, ReactNode represents everything that can be rendered.
};

type UserType = {
    username: string;
    email: string;
};

type LoginDataType = {
    user: {
        username: string;
        email: string;
    };
    accessToken: string;
    refreshToken: string;
};

export default function AppContextProvider({ children }: ContextProps) {
    const [user, setUser] = useState<UserType | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
        const savedTheme = localStorage.getItem(
            "theme-mode"
        ) as ThemeMode | null;
        return savedTheme ?? "lightMode";
    });

    const theme = useMemo(
        () => createTheme(themeMode === "darkMode" ? appThemeDark : appTheme),
        [themeMode]
    );

    const toggleTheme = () =>
        setThemeMode((m) => (m === "lightMode" ? "darkMode" : "lightMode"));

    // const handeLogin = (userData: UserType, accessToken: string, refreshToken: string) => {
    const handeLogin = (data: LoginDataType) => {
        if (!data) return;
        const { user: userData, accessToken, refreshToken } = data;
        setUser(userData);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);

        // localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
    };

    return (
        <AppContext.Provider
            value={{
                themeMode,
                toggleTheme,
                user,
                accessToken,
                refreshToken,
                handeLogin,
            }}
        >
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </AppContext.Provider>
    );
}
