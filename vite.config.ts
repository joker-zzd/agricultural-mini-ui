import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 7062,
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

  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          // 自定义 Vant 主题色
          "primary-color": "#89c3eb", // 这里设置主题色
          "button-primary-background-color": "#89c3eb", // 按钮的背景色
          "switch-on-background-color": "#89c3eb", // Switch 开关的颜色
          // 你可以根据需要继续添加更多自定义样式
        },
      },
    },
  },
});
