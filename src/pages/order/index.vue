<template>
  <div class="order-list-page">
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

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多订单了"
        @load="onLoadMore"
      >
        <div
          v-for="item in orderDisplayList"
          :key="item.displayKey"
          style="margin-bottom: 16px; background-color: #fff; padding: 10px"
        >
          <div
            style="
              margin-bottom: 8px;
              display: flex;
              justify-content: space-between;
            "
          >
            <div style="display: flex; align-items: center; gap: 8px">
              <span>订单号：{{ item.orderNo }}</span>
              <van-icon
                name="description"
                style="font-size: 16px; color: #bbb"
                @click="copyOrderNo(item.orderNo)"
              />
            </div>
            <van-tag :type="orderStatusColorMap[item.statusText] || 'primary'">
              {{ item.statusText }}
            </van-tag>
          </div>

          <van-card
            :price="item.price.toFixed(2)"
            :thumb="item.image"
            :desc="`数量：${item.quantity}`"
            style="background-color: #fff"
            @click="goToOrderDetail(item.orderId)"
          />

          <div
            v-if="item.statusText === '已完成' || item.statusText === '已取消'"
            style="text-align: right; margin-top: 8px"
          >
            <van-button
              v-if="item.statusText === '已完成'"
              size="small"
              type="primary"
              style="margin-right: 8px"
              @click="goToComment(item.orderId, item.productId)"
            >
              去评价
            </van-button>

            <van-button
              size="small"
              type="danger"
              plain
              @click="confirmDelete(item.orderId)"
            >
              删除订单
            </van-button>
          </div>
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
import { showToast, showConfirmDialog, TagType } from "vant";
import { findByPage, deleteAllById } from "@/api/order";

const router = useRouter();
const orders = ref<any[]>([]);
const orderDisplayList = ref<any[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const currentPage = ref(1);
const pageSize = 4;
const searchOrderNo = ref("");

// 枚举转中文状态
const orderStatusMap: Record<string, string> = {
  WAIT_PAYMENT: "待付款",
  WAIT_DELIVER: "待发货",
  WAIT_RECEIVE: "待收货",
  FINISHED: "已完成",
  CANCELED: "已取消",
};

const orderStatusColorMap: Record<string, TagType> = {
  待付款: "danger",
  待发货: "warning",
  待收货: "primary",
  已完成: "success",
  已取消: "default",
};

// 获取订单列表
const getOrderList = async (isRefresh = false) => {
  loading.value = true;
  try {
    const res = await findByPage({
      currentPage: currentPage.value,
      pageSize,
      orderNo: searchOrderNo.value || undefined,
    });

    if (res.code === 0 && Array.isArray(res.data)) {
      const rawOrders = res.data;
      const flattened: any[] = [];

      rawOrders.forEach((order: any) => {
        const statusText = orderStatusMap[order.status] || order.status;
        order.orderItem.forEach((item: any, idx: number) => {
          flattened.push({
            displayKey: `${order.id}-${idx}`,
            orderId: order.id,
            orderNo: order.orderNo,
            statusText,
            productId: item.productId,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          });
        });
      });

      if (isRefresh) {
        orderDisplayList.value = flattened;
      } else {
        orderDisplayList.value.push(...flattened);
      }

      const total = res.total ?? flattened.length;
      finished.value = orderDisplayList.value.length >= total;
    } else {
      showToast(res.msg || "获取订单失败");
      finished.value = true;
    }
  } catch (err) {
    showToast("网络异常");
    finished.value = true;
  } finally {
    setTimeout(() => {
      loading.value = false;
      refreshing.value = false;
    }, 1000);
  }
};

// 下拉刷新
const onRefresh = () => {
  currentPage.value = 1;
  finished.value = false;
  getOrderList(true);
};

// 上滑加载
const onLoadMore = () => {
  if (finished.value) return;
  currentPage.value += 1;
  getOrderList();
};

const goToOrderDetail = (orderId: number) => {
  router.push({ name: "OrderDetail", params: { id: orderId } });
};

const goToComment = (orderId: number, productId: number) => {
  router.push({ path: "/addReview", query: { productId, orderId } });
};

const confirmDelete = (orderId: number) => {
  showConfirmDialog({
    title: "提示",
    message: "确定要删除该订单吗？删除后无法恢复。",
  })
    .then(async () => {
      const res = await deleteAllById([orderId]);
      if (res.code === 0) {
        showToast("订单删除成功");
        currentPage.value = 1;
        getOrderList(true);
      } else {
        showToast(res.msg || "删除失败");
      }
    })
    .catch(() => {});
};

const onSearch = () => {
  currentPage.value = 1;
  finished.value = false;
  getOrderList(true);
};

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

const goBack = () => {
  router.back();
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
