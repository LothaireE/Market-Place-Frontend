import { createContext } from "react";

export type ThemeMode = "lightMode" | "darkMode";

export type AppContextType = {
    themeMode: ThemeMode;
    toggleTheme: () => void;
    user: {
        username: string;
        email: string;
    } | null;
    accessToken?: string | null;
    refreshToken?: string | null;
    handeLogin?: (data: {
        user: {
            username: string;
            email: string;
        };
        accessToken: string;
        refreshToken: string;
    }) => void;
};
// always also asign undefined type to context
const AppContext = createContext<AppContextType | undefined>(undefined);

export default AppContext;
