import { useEffect, useState, useRef } from "react";
import { API_URLS } from "../config/config";
import AuthContext from "./authContext";

export default function AuthContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const isMounted = useRef(false); // prevent double execution in StrictMode

    useEffect(() => {
        if (isMounted.current) return;
        isMounted.current = true;

        (async () => {
            try {
                const response = await fetch(API_URLS.refreshToken, {
                    method: "POST",
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setAccessToken(data.accessToken ?? null);
                }
            } catch {
                setAccessToken(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function logout() {
        await fetch(API_URLS.userLogout, {
            method: "POST",
            credentials: "include",
        });
        setAccessToken(null);
    }

    console.log({ accessToken, loading });
    const contextValue = {
        accessToken,
        loading,
        setAccessToken,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// export const useAuth = () => useContext(AuthContext);
