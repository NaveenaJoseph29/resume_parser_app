import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite builds and serves the React app. The plugin lets JSX work in .jsx files.
// During development, requests to /api are forwarded to the Express server on Vercel,
// so the browser talks to one origin and needs no CORS setup.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://resume-parser-server-nu.vercel.app",
        changeOrigin: true,
      },
    },
  },
});
