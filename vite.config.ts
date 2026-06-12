// C:\Users\Administrator\python_projects\mpesa-platform\mpesa-analytics-dashboard\vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Proxy all API requests to your gateway
      "/api": {
        target: "http://localhost:9000",
        changeOrigin: true,
        secure: false,
        // Don't rewrite the path - keep /api prefix
        rewrite: (path) => path,
      },
      // Proxy health checks
      "/health": {
        target: "http://localhost:9000",
        changeOrigin: true,
      },
    },
  },
});
