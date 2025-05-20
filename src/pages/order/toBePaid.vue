<template>
  <div class="pending-order-list">
    <van-nav-bar
      title="待付款订单"
      left-arrow
      @click-left="onBack"
      fixed
      placeholder
      safe-area-inset-top
    />

    <van-empty v-if="orderData.length === 0" description="暂无待付款订单" />

    <div v-else>
      <div v-for="order in orderData" :key="order.id" class="order-card">
        <!-- 订单头部 -->
        <div class="order-header">
          <div class="order-id">订单号：{{ order.orderNo }}</div>
          <van-tag type="warning">待付款</van-tag>
        </div>

        <!-- 商品列表 -->
        <div v-for="item in order.orderItem" :key="item.id" class="product-row">
          <img :src="item.image" class="thumb" />
          <div class="product-info">
            <div class="name">{{ item.name }}</div>
            <div class="desc">{{ item.description }}</div>
            <div class="price">￥{{ item.price.toFixed(2) }}</div>
          </div>
        </div>

        <!-- 底部信息 -->
        <div class="order-info">
          <div class="price">应付金额：￥{{ order.totalAmount }}</div>
          <div class="countdown">
            倒计时：
            <span v-if="order.remainingSeconds > 0">
              {{ formatCountdown(order.remainingSeconds) }}
            </span>
            <span v-else class="expired">已超时</span>
          </div>
        </div>

        <div class="order-actions">
          <van-button
            size="small"
            type="danger"
            :disabled="order.remainingSeconds <= 0"
            @click="payNow(order.id)"
          >
            立即支付
          </van-button>
          <van-button
            size="small"
            plain
            type="default"
            @click="cancelOrder(order.id)"
          >
            取消订单
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { showToast, showConfirmDialog } from "vant";
import { useRouter } from "vue-router";
import { deleteAllById, findByPage } from "@/api/order";

const orderData = ref([
  {
    id: 1,
    orderNo: "",
    totalAmount: 0,
    remainingSeconds: 3600,
    orderItem: [
      {
        id: 1,
        productId: "",
        price: 0,
        image: "",
        name: "",
        description: "",
      },
    ],
  },
]);
const currentPage = ref(1);
const pageSize = ref(4);

let timer: ReturnType<typeof setInterval>;

const getDataList = () => {
  findByPage({
    currentPage: currentPage.value,
    pageSize: pageSize.value,
    status: "WAIT_PAYMENT",
  }).then((res) => {
    orderData.value = res.data;
  });
};

const formatCountdown = (seconds: number) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const payNow = (id: number) => {
  showToast(`跳转支付页面，订单ID：${id}`);
};

const cancelOrder = (id: number) => {
  showConfirmDialog({
    title: "取消确认",
    message: "你确定要取消该订单吗？",
  })
    .then(() => {
      showToast("订单已取消");
      orderData.value = orderData.value.filter((order) => order.id !== id);
      deleteAllById([id]);
    })
    .catch(() => {
      // 用户点击了取消，什么都不做
    });
};

onMounted(() => {
  getDataList();
  timer = setInterval(() => {
    orderData.value.forEach((order) => {
      if (order.remainingSeconds > 0) order.remainingSeconds--;
    });
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timer);
});

const router = useRouter();
const onBack = () => {
  router.back();
};
</script>

<style scoped>
.pending-order-list {
  overflow: auto;
}
.order-card {
  background: #fff;
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 8px;
}
.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: bold;
}
.product-row {
  display: flex;
  padding: 8px 0;
  border-top: 1px solid #eee;
}
.thumb {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 12px;
}
.product-info {
  flex: 1;
}
.product-info .name {
  font-weight: 500;
}
.product-info .desc {
  color: #888;
  font-size: 13px;
  margin: 4px 0;
}
.product-info .price {
  color: #fa6400;
  font-size: 14px;
}
.order-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-top: 10px;
}
.expired {
  color: red;
}
.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
}
</style>
