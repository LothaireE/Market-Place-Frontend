import { API_URLS } from "../config/env";
import { useAuthContext } from "../context/useAppContext";

export function useApi() {
    const { accessToken, setAccessToken, logout } = useAuthContext();

    async function refresh() {
        const response = await fetch(API_URLS.refreshToken, {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to refresh token");
        // response.retry = true
        const { data } = await response.json();
        setAccessToken(data.accessToken); // update in memory token (context)
        return data.accessToken;
    }

    async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
        const tryOnce = async (token: string | null) => {
            const headers = new Headers(init?.headers || {});

            if (token) headers.set("Authorization", `Bearer ${token}`);

            const response = await fetch(input, {
                ...init,
                headers,
                credentials: "include", // include cookies aka the refresh token
            });

            return response;
        };

        let response = await tryOnce(accessToken); // first attempt with my current access token

        if (response.status !== 401) return response; // if not unauthorized

        // 401 case with expired token for example
        try {
            const newAccessToken = await refresh();
            response = await tryOnce(newAccessToken);

            return response;
        } catch (error) {
            logout();
            throw error;
        }
    }

    return { fetchWithAuth };
}
