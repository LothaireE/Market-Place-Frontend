import { createContext } from "react";

export type AuthContextType = {
    accessToken: string | null;
    loading: boolean;
    setAccessToken: (token: string | null) => void;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    loading: true,
    setAccessToken: () => {},
    logout: async () => {},
});

// always also asign undefined type to context
// const AppContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
