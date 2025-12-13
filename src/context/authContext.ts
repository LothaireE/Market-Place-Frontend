import { createContext } from "react";
export type ThemeMode = "lightMode" | "darkMode";

type User = {
    // id: string;
    email: string;
    username: string;
    sellerProfile?: {
        id: string;
    };
};

export type SuccessData = {
    user: User;
    accessToken: string;
};

type LoginParams = {
    email: string;
    password: string;
    remember: boolean;
};

export type AuthContextType = {
    accessToken: string | null;
    user: User | null;
    // isAuthenticated: boolean;
    loading: boolean;
    setAccessToken: (token: string | null) => void;
    login: (params: LoginParams) => Promise<SuccessData>;
    logout: () => Promise<void>;
    themeMode: ThemeMode;
    toggleTheme: () => void;
    error: string | null;
    authStatus: string;
};

const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    user: null,
    // isAuthenticated: false,
    loading: true,
    setAccessToken: () => {},
    login: async () => {
        return { user: { email: "", username: "" }, accessToken: "" };
    },
    logout: async () => {},
    toggleTheme: () => {},
    themeMode: "lightMode",
    error: null,
    authStatus: "loading",
});

export default AuthContext;
