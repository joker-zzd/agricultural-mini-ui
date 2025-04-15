// store/user.ts
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: "",
    user: null as any,
  }),
  actions: {
    setUserInfo(token: string, user: any) {
      this.token = token;
      this.user = user;
    },
    clearUserInfo() {
      this.token = "";
      this.user = null;
    },
  },
  persist: true, // 使用 pinia-plugin-persist 持久化
});
