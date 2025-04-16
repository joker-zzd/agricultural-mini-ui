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
        <van-icon name="setting-o" size="20" @click="goToSettings" />
      </template>
    </van-cell>

    <!-- 我的订单 -->
    <van-cell title="我的订单" is-link @click="goToOrderList">
      <template #right-icon>
        <van-icon name="arrow" />
      </template>
    </van-cell>
    <div class="order-status-grid">
      <van-grid :column-num="4" clickable>
        <van-grid-item
          icon="pending-payment"
          text="待付款"
          @click="goToOrder('PENDING')"
        />
        <van-grid-item
          icon="tosend"
          text="待发货"
          @click="goToOrder('TO_SEND')"
        />
        <van-grid-item
          icon="logistics"
          text="运输中"
          @click="goToOrder('SHIPPING')"
        />
        <van-grid-item
          icon="after-sale"
          text="售后/退款"
          @click="goToOrder('AFTER_SALE')"
        />
      </van-grid>
    </div>

    <!-- 常用功能 -->
    <van-cell-group>
      <van-cell
        title="地址管理"
        icon="location-o"
        is-link
        @click="goToAddress"
      />
      <van-cell title="我的收藏" icon="star-o" is-link @click="goToFavorites" />
      <van-cell
        title="联系客服"
        icon="service-o"
        is-link
        @click="contactService"
      />
      <van-cell title="关于我们" icon="info-o" is-link @click="goToAbout" />
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";

const userStore = useUserStore().user;

const router = useRouter();

const user = ref({
  nickname: "农资小王",
  avatar: "https://img.yzcdn.cn/vant/cat.jpeg",
});

const goToSettings = () => router.push("/settings");
const goToOrderList = () => router.push("/orders");
const goToOrder = (status: string) => router.push(`/orders?status=${status}`);
const goToAddress = () => router.push("/address");
const goToFavorites = () => router.push("/favorites");
const contactService = () => {
  window.location.href = "tel:400-1234-567";
};
const goToAbout = () => router.push("/about");
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
