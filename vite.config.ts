import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 7061,
  },
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
      dts: "src/components.d.ts",
    }),
  ],

  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
