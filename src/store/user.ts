// store/user.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { findByPage } from "@/api/address";

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

// 收货地址
export const useAddressStore = defineStore("address", () => {
  const defaultAddress = ref(null) as ReturnType<typeof ref<any>>;
  const selectedAddress = ref(null) as ReturnType<typeof ref<any>>;

  const setDefaultAddress = (address: any) => {
    defaultAddress.value = address;
  };

  const setSelectedAddress = (address: any) => {
    selectedAddress.value = address;
  };

  const loadDefaultAddress = async () => {
    try {
      const res = await findByPage({ currentPage: 0, pageSize: 10 });
      if (res.code === 0) {
        const found = res.data.find((item: any) => item.defaulted === true);
        defaultAddress.value = found || null;
      }
    } catch (e: any) {
      console.error("加载默认地址失败", e);
    }
  };

  return {
    defaultAddress,
    selectedAddress,
    setDefaultAddress,
    setSelectedAddress,
    loadDefaultAddress,
  };
});
