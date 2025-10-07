// export const VITE_API_URL: string = import.meta.env.VITE_API_URL;

// export const API_URL: string = VITE_API_URL;

// export const AUTH_API_URL: string = import.meta.env.VITE_AUTH_API_URL;

export const API_URL: string = import.meta.env.VITE_API_URL;



export const API_URLS = {
    marketPlace: `${API_URL}/graphql`,
    userLogin: `${API_URL}/auth/login`,
    userRegister: `${API_URL}/auth/signup`,
};

