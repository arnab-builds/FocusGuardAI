import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        host: "localhost",
        port: 3001,
        strictPort: true,
        hmr: {
            host: "localhost",
            clientPort: 3001,
        },
    },
});
