import "vitest/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/

export default defineConfig({
    plugins: [react()],
    server: {
        // Proxy API requests to the backend server TODO: remove this
        proxy: {
            "/api": {
                target: "https://superheroapi.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, "/api"),
            },
        },
    },
});
