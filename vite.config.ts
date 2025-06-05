import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";

// 1. Можно закомментировать и импорт, чтобы он не висел без дела
// import vitePluginInjectDataLocator from "./plugins/vite-plugin-inject-data-locator";

// https://vite.dev/config/
export default defineConfig({
  // 2. Закомментируйте плагин здесь, добавив в начале строки //
  plugins: [react()/*, vitePluginInjectDataLocator()*/], 
  server: {
    allowedHosts: true,
  },
});