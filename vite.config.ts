import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 7062,
  },
  plugins: [vue()],

  resolve: {
    alias: {
      "@": "/src",
    },
  },

  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${path.resolve(
            "src/style/variables.less"
          )}";`,
        },
        math: "strict",
        javascriptEnabled: true,
      },
    },
  },
});
