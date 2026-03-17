export const AUTH_URL: string = import.meta.env.VITE_AUTH_SERVER_URL;
export const MAIN_URL: string = import.meta.env.VITE_MAIN_SERVER_URL;

export const API_URLS = {
    marketPlace: `${MAIN_URL}/graphql`,
    createProduct: `${MAIN_URL}/api/main/products/create`,
    updateProduct: `${MAIN_URL}/api/main/products/update`,
    // updateProduct: (id: string) => {
    //     return `${MAIN_URL}/api/main/products/update/${id}`;
    // },
    deleteProduct: `${MAIN_URL}/api/main/products/delete`,
    userLogin: `${AUTH_URL}/api/auth/login`,
    userRegister: `${AUTH_URL}/api/auth/signup`,
    userLogout: `${AUTH_URL}/api/auth/logout`,
    refreshToken: `${AUTH_URL}/api/auth/refresh-token`,
    sellerProfile: `${MAIN_URL}/api/main/seller`,
};

export const JWT_SECRET: string = import.meta.env.VITE_JWT_SECRET;

export const CLIENT_URL: string = import.meta.env.VITE_CLIENT_URL;

export const MODE: string = import.meta.env.MODE?.toUpperCase() || "";
