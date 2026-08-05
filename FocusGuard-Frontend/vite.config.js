import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: "localhost",
    // The backend invitation links and CORS configuration use this local URL.
    port: 3000,
    strictPort: true,
  },
})
