import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const appVersion = process.env.VITE_APP_VERSION ?? process.env.npm_package_version ?? "0.0.0";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
