<template>
  <div class="my-page">
    <!-- 用户信息 -->
    <van-cell center>
      <template #icon>
        <van-image round width="48" height="48" :src="userStore.avatar" />
      </template>
      <template #title>
        <div class="nickname">{{ userStore.nickname || "未登录" }}</div>
      </template>
      <template #right-icon>
        <router-link to="/settings">
          <van-icon name="setting-o" size="20" />
        </router-link>
      </template>
    </van-cell>

    <!-- 我的订单 -->
    <van-cell title="我的订单" is-link to="/orders">
      <template #right-icon>
        <van-icon name="arrow" />
      </template>
    </van-cell>
    <div class="order-status-grid">
      <van-grid :column-num="4" clickable>
        <van-grid-item icon="pending-payment" text="待付款" to="/toBePaid" />
        <van-grid-item icon="tosend" text="待发货" to="/toBePaid" />
        <van-grid-item icon="logistics" text="运输中" to="/toBePaid" />
        <van-grid-item icon="after-sale" text="售后/退款" to="/toBePaid" />
      </van-grid>
    </div>

    <!-- 常用功能 -->
    <van-cell-group>
      <van-cell title="地址管理" icon="location-o" is-link to="/address" />
      <van-cell title="我的收藏" icon="star-o" is-link @click="goToFavorites" />
      <van-cell
        title="联系客服"
        icon="service-o"
        is-link
        @click="contactService"
      />
      <van-cell title="关于我们" icon="info-o" is-link to="/about" />
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user";
import { showToast } from "vant";

const userStore = useUserStore().user;

const goToFavorites = () => {
  showToast("敬请期待");
};
const contactService = () => {
  showToast("敬请期待");
};
</script>

<style scoped>
.my-page {
  background-color: #f7f8fa;
  min-height: 100vh;
}
.nickname {
  margin-left: 6px;
  font-weight: bold;
  font-size: 16px;
}
.order-status-grid {
  padding: 10px 0;
  background: #fff;
}
</style>
