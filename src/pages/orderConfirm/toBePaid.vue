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

    <van-empty v-if="orders.length === 0" description="暂无待付款订单" />

    <van-cell-group v-else>
      <van-card
        v-for="order in orders"
        :key="order.id"
        :title="order.productName"
        :desc="order.productDesc"
        :thumb="order.productImage"
      >
        <template #tags>
          <van-tag type="warning">待付款</van-tag>
        </template>

        <template #bottom>
          <div class="order-info">
            <div class="price">应付金额：￥{{ order.amount }}</div>
            <div class="countdown">
              倒计时：
              <span v-if="order.remainingSeconds > 0">
                {{ formatCountdown(order.remainingSeconds) }}
              </span>
              <span v-else class="expired">已超时</span>
            </div>
          </div>
        </template>

        <template #footer>
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
        </template>
      </van-card>
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { showToast } from "vant";
import { useRouter } from "vue-router";

const router = useRouter();
// 模拟订单数据
const orders = ref([
  {
    id: 1,
    productName: "玉米种子 A",
    productDesc: "高产抗旱，适合北方种植",
    productImage: "https://via.placeholder.com/80",
    amount: 199.0,
    createdAt: new Date().getTime() - 1000 * 60 * 30, // 30分钟前创建
    remainingSeconds: 0,
  },
  {
    id: 2,
    productName: "化肥 B",
    productDesc: "复合肥料，适合蔬菜",
    productImage: "https://via.placeholder.com/80",
    amount: 88.0,
    createdAt: new Date().getTime() - 1000 * 60 * 60 * 23, // 23小时前创建
    remainingSeconds: 0,
  },
]);

let timer: ReturnType<typeof setInterval>;

// 计算剩余时间（24小时内）
const calculateCountdown = () => {
  const now = new Date().getTime();
  orders.value.forEach((order) => {
    const deadline = order.createdAt + 24 * 60 * 60 * 1000;
    const diff = Math.max(0, Math.floor((deadline - now) / 1000));
    order.remainingSeconds = diff;
  });
};

// 倒计时格式化（时:分:秒）
const formatCountdown = (seconds: number) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const payNow = (id: number) => {
  showToast(`跳转支付页面，订单ID：${id}`);
  // 这里可以跳转支付页面
};

const cancelOrder = (id: number) => {
  orders.value = orders.value.filter((order) => order.id !== id);
  showToast("订单已取消");
};

onMounted(() => {
  calculateCountdown();
  timer = setInterval(() => {
    orders.value.forEach((order) => {
      if (order.remainingSeconds > 0) order.remainingSeconds--;
    });
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timer);
});
const onBack = () => {
  router.back();
};
</script>

<style scoped>
.pending-order-list {
  padding: 16px;
}
.order-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-top: 4px;
}
.expired {
  color: red;
}
</style>
