import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), Svgr()],
  server: {
    proxy: {
      "/api": process.env.VITE_AUTH_SERVICE_URL ?? "http://localhost:8080",
    },
  },
});
