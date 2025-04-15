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
import { ref } from "vue";
import { useRoute } from "vue-router";
import { showToast } from "vant";

const active = ref(0);
const route = useRoute();

const handleMessage = () => {
  showToast({
    message: "敬请期待",
  });
};
</script>

<style scoped>
/* 可以添加样式 */
</style>
