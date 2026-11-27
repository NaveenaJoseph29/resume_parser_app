import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite builds and serves the React app. The plugin lets JSX work in .jsx files.
export default defineConfig({
  plugins: [react()],
});
