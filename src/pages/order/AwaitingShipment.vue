<template>
  <div class="to-be-delivered">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="待发货订单" left-arrow @click-left="onBack" />

    <!-- 订单列表 -->
    <template v-if="orderList.length === 0">
      <van-empty description="暂无待发货订单" />
    </template>

    <div v-for="order in orderList" :key="order.id" class="order-card-wrapper">
      <van-card
        :title="'订单编号：' + order.orderNo"
        :desc="'下单时间：' + order.createdAt"
        :thumb="order.orderItem[0].image"
        :price="order.totalAmount.toFixed(2)"
      >
        <template #tags>
          <van-tag type="primary">待发货</van-tag>
        </template>
        <template #footer>
          <van-button size="small" plain @click="viewOrder(order.id)">
            查看详情
          </van-button>
        </template>
      </van-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { findByPage } from "@/api/order";

const router = useRouter();
const currentPage = ref(1);
const pageSize = ref(10);

interface OrderItem {
  id: number;
  image: string;
  name: string;
}

interface Order {
  id: number;
  orderNo: string;
  totalAmount: number;
  createdAt: string;
  orderItem: OrderItem[];
}

const orderList = ref<Order[]>([]); // 你自己赋值数据即可

const getDataList = () => {
  findByPage({
    currentPage: currentPage.value,
    pageSize: pageSize.value,
    status: "WAIT_DELIVER",
  })
    .then((res) => {
      if (res.code === 0) {
        orderList.value = res.data;
        console.log("获取订单列表成功", res.data);
      } else {
        // 处理错误
        console.error("获取订单列表失败", res.message);
      }
    })
    .catch((error) => {
      console.error("请求失败", error);
    })
    .finally(() => {
      // 这里可以做一些清理工作，比如关闭加载动画
    });
};

const onBack = () => {
  router.back();
};

const viewOrder = (id: number) => {
  router.push(`/order-detail/${id}`);
};
onMounted(() => {
  getDataList();
});
</script>

<style scoped>
.to-be-delivered {
  background-color: #f7f8fa;
  min-height: 100vh;
}

.search-bar {
  padding: 8px;
  background-color: #fff;
}

.order-card-wrapper {
  background-color: #fff;
  margin: 10px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.empty-text {
  padding: 20px;
  text-align: center;
  color: #888;
}
</style>
