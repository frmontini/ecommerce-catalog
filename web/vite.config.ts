import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const envApiUrl = process.env.VITE_API_URL?.trim();
  const envBackendUrl = process.env.VITE_BACKEND_URL?.trim();
  const proxyTarget = envBackendUrl || (envApiUrl ? envApiUrl.replace(/\/api\/?$/, "") : "http://localhost:8000");

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
