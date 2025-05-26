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
  {
    path: "/productDetail",
    name: "productDetail",
    component: () => import("../pages/productDetail/index.vue"),
  },
  {
    path: "/reviews",
    name: "reviews",
    meta: { showTabbar: false },
    component: () => import("../pages/reviews/index.vue"),
  },
  {
    path: "/cart",
    name: "cart",
    meta: { showTabbar: false },
    component: () => import("../pages/cart/index.vue"),
  },
  {
    path: "/me",
    name: "me",
    meta: { showTabbar: true },
    component: () => import("../pages/me/index.vue"),
  },
  {
    path: "/settings",
    name: "settings",
    meta: { showTabbar: false },
    component: () => import("../pages/settings/index.vue"),
  },
  {
    path: "/about",
    name: "about",
    meta: { showTabbar: false },
    component: () => import("../pages/about/index.vue"),
  },
  {
    path: "/profileEdit",
    name: "profileEdit",
    meta: { showTabbar: false },
    component: () => import("../pages/profileEdit/index.vue"),
  },
  {
    path: "/updatePassword",
    name: "updatePassword",
    meta: { showTabbar: false },
    component: () => import("../pages/updatePassword/index.vue"),
  },
  {
    path: "/addAddress",
    name: "addAddress",
    meta: { showTabbar: false },
    component: () => import("../pages/address/addAddress.vue"),
  },
  {
    path: "/address",
    name: "address",
    meta: { showTabbar: false },
    component: () => import("../pages/address/index.vue"),
  },
  {
    path: "/orderConfirm",
    name: "orderConfirm",
    meta: { showTabbar: false },
    component: () => import("../pages/orderConfirm/index.vue"),
  },
  {
    path: "/toBePaid",
    name: "toBePaid",
    meta: { showTabbar: false },
    component: () => import("../pages/order/toBePaid.vue"),
  },
  {
    path: "/orders",
    name: "orders",
    meta: { showTabbar: false },
    component: () => import("../pages/order/index.vue"),
  },
  {
    path: "/awaitingShipment",
    name: "awaitingShipment",
    meta: { showTabbar: false },
    component: () => import("../pages/order/AwaitingShipment.vue"),
  },
  {
    path: "/inTransit",
    name: "InTransit",
    meta: { showTabbar: false },
    component: () => import("../pages/order/InTransit.vue"),
  },
  {
    path: "/addReview",
    name: "addReview",
    meta: { showTabbar: false },
    component: () => import("../pages/reviews/addReview.vue"),
  },
  {
    path: "/register",
    name: "register",
    meta: { showTabbar: false },
    component: () => import("../pages/register/emailRegister.vue"),
  },
];

// 创建 router 实例
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 History 模式
  routes,
});

export default router;
