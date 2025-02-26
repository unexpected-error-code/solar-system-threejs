import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
  // Base path for GitHub Pages deployment
  // Use the VITE_BASE_PATH environment variable if available, otherwise use the root
  base: process.env.VITE_BASE_PATH || "/",
});
