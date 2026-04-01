import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig(function (_a) {
    var _b, _c;
    var mode = _a.mode;
    var envApiUrl = (_b = process.env.VITE_API_URL) === null || _b === void 0 ? void 0 : _b.trim();
    var envBackendUrl = (_c = process.env.VITE_BACKEND_URL) === null || _c === void 0 ? void 0 : _c.trim();
    var proxyTarget = envBackendUrl || (envApiUrl ? envApiUrl.replace(/\/api\/?$/, "") : "http://localhost:8000");
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
