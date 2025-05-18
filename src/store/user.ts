// store/user.ts
import { defineStore } from "pinia";
import { ref } from "vue";

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

//收货地址
export const useAddressStore = defineStore("address", () => {
  const defaultAddress = ref(null) as ReturnType<typeof ref<any>>;
  const selectedAddress = ref(null) as ReturnType<typeof ref<any>>;
  const setDefaultAddress = (address: any) => {
    defaultAddress.value = address;
  };

  const setSelectedAddress = (address: any) => {
    selectedAddress.value = address;
  };
  return {
    defaultAddress,
    setDefaultAddress,
    selectedAddress,
    setSelectedAddress,
  };
});
