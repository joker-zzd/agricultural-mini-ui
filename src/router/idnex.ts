import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

// 定义路由规则
const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/login/index.vue"),
  },
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "home",
    meta: { showTabbar: true },
    component: () => import("../pages/home/index.vue"),
  },
];

// 创建 router 实例
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 History 模式
  routes,
});

export default router;
