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

    <div v-else>
      <div v-for="order in orders" :key="order.id" class="order-card">
        <!-- 订单头部 -->
        <div class="order-header">
          <div class="order-id">订单号：{{ order.orderNo }}</div>
          <van-tag type="warning">待付款</van-tag>
        </div>

        <!-- 商品列表 -->
        <div v-for="item in order.items" :key="item.id" class="product-row">
          <img :src="item.image" class="thumb" />
          <div class="product-info">
            <div class="name">{{ item.name }}</div>
            <div class="desc">{{ item.desc }}</div>
            <div class="price">￥{{ item.price.toFixed(2) }}</div>
          </div>
        </div>

        <!-- 底部信息 -->
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
          <van-button
            size="small"
            plain
            type="danger"
            @click="deleteOrder(order.id)"
          >
            删除订单
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { showToast, Dialog } from "vant";
import { useRouter } from "vue-router";

// 示例数据：一个订单多个商品
const orders = ref([
  {
    id: 1,
    orderNo: "202405201001",
    amount: 199.0,
    createdAt: new Date().getTime() - 1000 * 60 * 30, // 30分钟前创建
    remainingSeconds: 0,
    items: [
      {
        id: 101,
        name: "玉米种子 A",
        desc: "高产抗旱",
        image: "https://via.placeholder.com/80",
        price: 99.0,
      },
      {
        id: 102,
        name: "化肥 B",
        desc: "复合肥料",
        image: "https://via.placeholder.com/80",
        price: 100.0,
      },
    ],
  },
]);

let timer: ReturnType<typeof setInterval>;

const calculateCountdown = () => {
  const now = new Date().getTime();
  orders.value.forEach((order) => {
    const deadline = order.createdAt + 24 * 60 * 60 * 1000;
    const diff = Math.max(0, Math.floor((deadline - now) / 1000));
    order.remainingSeconds = diff;
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
  showToast("订单已取消");
  orders.value = orders.value.filter((order) => order.id !== id);
};

const deleteOrder = (id: number) => {
  Dialog.confirm({
    title: "确认删除",
    message: "删除后将无法恢复，是否确认？",
  })
    .then(() => {
      orders.value = orders.value.filter((order) => order.id !== id);
      showToast("订单已删除");
      // TODO: 你可以调用删除订单的 API 接口
    })
    .catch(() => {
      /* 用户取消操作 */
    });
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

const router = useRouter();
const onBack = () => {
  router.back();
};
</script>

<style scoped>
.pending-order-list {
  padding: 16px;
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
