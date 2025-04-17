<template>
  <router-view></router-view>

  <nav>
    <van-tabbar
      v-if="route.meta.showTabbar"
      v-model="active"
      :placeholder="true"
      active-color="#ee0a24"
    >
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="chat-o" @click="handleMessage"
        >消息</van-tabbar-item
      >
      <van-tabbar-item to="/cart" icon="cart-o">购物车</van-tabbar-item>
      <van-tabbar-item to="/me" icon="contact-o">我的</van-tabbar-item>
    </van-tabbar>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { showToast } from "vant";

const active = ref(0);
const route = useRoute();

// 获取持久化存储中的 Tabbar 活动项
onMounted(() => {
  const storedActive = localStorage.getItem("activeTab");
  if (storedActive !== null) {
    active.value = parseInt(storedActive); // 恢复活动 Tab
  }
});

// 更新活动项到持久化存储
const updateActiveTab = (newIndex: number) => {
  localStorage.setItem("activeTab", newIndex.toString());
};

// 监听 Tabbar 的变化并保存活动 Tab
watch(active, (newValue) => {
  updateActiveTab(newValue);
});

const handleMessage = () => {
  showToast({
    message: "敬请期待",
  });
};
</script>

<style>
/* 使用更高权重选择器来兜底 */
body .van-button--primary {
  background-color: #1fa1f8 !important;
}
</style>
