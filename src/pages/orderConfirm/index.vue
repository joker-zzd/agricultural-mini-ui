<template>
  <div class="order-confirm-page">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="确认订单"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <!-- 收货信息 -->
    <van-cell-group inset>
      <van-cell
        title="收货地址"
        :value="receiver.address || '请选择收货地址'"
        is-link
        @click="selectAddress"
      />
    </van-cell-group>

    <!-- 商品信息 -->
    <div v-for="item in visibleItems" :key="item.id">
      <van-card
        class="compact-card"
        :num="item.quantity"
        :price="item.price"
        :desc="item.description"
        :title="item.name"
        :thumb="item.imageUrl"
      />
    </div>

    <!-- 显示“查看更多”按钮 -->
    <div
      v-if="orderData.length > 2 && !showAll"
      style="text-align: center; margin: 12px 0"
    >
      <van-button size="small" @click="showAll = true">查看更多商品</van-button>
    </div>

    <!-- 价格信息 -->
    <van-cell-group inset>
      <van-cell title="商品总价" :value="`¥${totalPrice.toFixed(2)}`" />
      <van-cell title="运费" value="¥0.00" />
      <van-cell title="应付总额" :value="`¥${totalPrice.toFixed(2)}`" />
    </van-cell-group>

    <!-- 提交订单按钮 -->
    <div style="padding: 16px">
      <van-button block type="primary" @click="submitOrder"
        >确认并支付</van-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, inject, Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAddressStore } from "@/store/user";
import { showToast } from "vant";

const route = useRoute();
const router = useRouter();
const addressStore = useAddressStore();

const orderData = ref<any[]>([]);
const showAll = ref(false);

const receiver = ref({
  address: "",
});

onMounted(() => {
  const encodeData = route.query.data;
  if (encodeData) {
    try {
      orderData.value = JSON.parse(decodeURIComponent(encodeData as string));
    } catch (err) {
      console.error("订单数据解析失败:", err);
    }
  }
  // 获取默认地址
  const addr = addressStore.defaultAddress || addressStore.selectedAddress;

  if (addr) {
    receiver.value.address = `${addr.province} ${addr.city} ${addr.county} ${addr.addressDetail}`;
  }
});

const visibleItems = computed(() => {
  return showAll.value ? orderData.value : orderData.value.slice(0, 2);
});

const totalPrice = computed(() =>
  orderData.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

const submitOrder = () => {
  if (!receiver.value.address) {
    showToast({
      message: "请先选择收货地址",
      type: "fail",
    });
  }
  console.log("提交订单", {
    items: orderData.value,
    address: receiver.value,
  });
  // TODO: 调用下单接口
};

const selectAddress = () => {
  router.push({ path: "/address", query: { from: "select" } });
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.order-confirm-page {
  padding-bottom: 60px;
}

/* 卡片压缩高度 */
.compact-card .van-card__content {
  padding-top: 8px;
  padding-bottom: 8px;
}
</style>
