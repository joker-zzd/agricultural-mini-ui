<template>
  <div class="order-list-page">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="我的订单"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <van-search
      v-model="searchOrderNo"
      show-action
      placeholder="请输入订单编号"
      @search="onSearch"
      @cancel="onCancel"
    />

    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <!-- 订单列表 -->
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多订单了"
        @load="onLoadMore"
      >
        <!-- 每个订单 -->
        <div
          v-for="order in orders"
          :key="order.id"
          style="margin-bottom: 16px; background-color: #fff; padding: 10px"
        >
          <!-- 订单头部信息 -->
          <div
            style="
              margin-bottom: 8px;
              display: flex;
              background-color: #fff;
              justify-content: space-between;
            "
          >
            <div style="display: flex; align-items: center; gap: 8px">
              <span>订单号：{{ order.orderNo }}</span>
              <van-icon
                name="description"
                style="font-size: 16px; color: #bbb"
                @click="copyOrderNo(order.orderNo)"
              />
            </div>
            <van-tag type="primary">{{ order.status }}</van-tag>
          </div>

          <!-- 每个商品 -->
          <van-card
            style="background-color: #fff"
            v-for="item in order.orderItem"
            :key="item.id"
            :price="item.price.toFixed(2)"
            :thumb="item.image"
            :desc="`数量：${item.quantity}`"
            @click="goToOrderDetail(order.id)"
          />
        </div>
        <template #loading>
          <div style="text-align: center; padding: 16px">
            <van-loading type="spinner" size="24px" color="#999" />
          </div>
        </template>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { findByPage } from "@/api/order";

// 枚举转中文
const orderStatusMap: Record<string, string> = {
  WAIT_PAYMENT: "待付款",
  WAIT_DELIVER: "待发货",
  WAIT_RECEIVE: "待收货",
  FINISHED: "已完成",
  CANCELED: "已取消",
};

const router = useRouter();
const orders = ref<any[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const currentPage = ref(1);
const pageSize = 4;
const searchOrderNo = ref("");

const getOrderList = async (isRefresh = false) => {
  loading.value = true;
  try {
    const res = await findByPage({
      currentPage: currentPage.value,
      pageSize: pageSize,
      orderNo: searchOrderNo.value || undefined,
    });

    if (res.code === 0) {
      const newOrders = res.data;
      newOrders.forEach((order: any) => {
        order.status = orderStatusMap[order.status] || order.status;
      });

      const total = res.total ?? newOrders.length;

      if (isRefresh) {
        orders.value = newOrders;
      } else {
        orders.value.push(...newOrders);
      }

      finished.value = orders.value.length >= total;
    } else {
      showToast("获取订单失败");
      finished.value = true;
    }
  } catch (err) {
    showToast("网络异常");
    finished.value = true;
  } finally {
    setTimeout(() => {
      refreshing.value = false;
      loading.value = false;
    }, 500);
  }
};

// 下拉刷新
const onRefresh = () => {
  currentPage.value = 1;
  finished.value = false;
  getOrderList(true);
};

// 上滑加载更多
const onLoadMore = () => {
  if (finished.value) return;
  currentPage.value += 1;
  getOrderList();
};

// 跳转订单详情
const goToOrderDetail = (orderId: string) => {
  router.push({ name: "OrderDetail", params: { id: orderId } });
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 搜索
const onSearch = () => {
  currentPage.value = 1;
  finished.value = false;
  getOrderList(true);
};

// 取消搜索（清空输入框并刷新列表）
const onCancel = () => {
  searchOrderNo.value = "";
  onSearch();
};

const copyOrderNo = (orderNo: string) => {
  navigator.clipboard
    .writeText(orderNo)
    .then(() => {
      showToast("订单号已复制");
    })
    .catch(() => {
      showToast("复制失败，请手动复制");
    });
};

onMounted(() => {
  getOrderList(true);
});
</script>

<style scoped>
.order-list-page {
  padding-bottom: 60px;
  overflow: auto;
}
</style>
