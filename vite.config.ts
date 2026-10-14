import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  server: {
    watch: { ignored: ["**/data/**", "**/test-results/**", "**/backups/**", "**/server/**"] },
    proxy: {
      "/api": "http://127.0.0.1:8787",
    },
  },
});
