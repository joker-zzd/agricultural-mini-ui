<template>
  <div class="settings-page">
    <van-nav-bar title="设置" left-arrow @click-left="goBack" />

    <div class="content">
      <van-cell-group inset>
        <van-cell
          title="修改资料"
          icon="edit"
          is-link
          @click="goToProfileEdit"
        />
        <van-cell
          title="修改密码"
          icon="lock"
          is-link
          @click="goToChangePassword"
        />
      </van-cell-group>
    </div>

    <div class="logout-button">
      <van-button block type="danger" @click="logout">退出登录</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { showConfirmDialog, showToast } from "vant";

const router = useRouter();

const goBack = () => {
  router.back();
};

const goToProfileEdit = () => {
  router.push("/profile-edit");
};

const goToChangePassword = () => {
  router.push("/change-password");
};

const logout = () => {
  showConfirmDialog({
    title: "提示",
    message: "确定要退出登录吗？",
  })
    .then(() => {
      localStorage.removeItem("token");
      showToast("已退出登录");
      router.replace("/login");
    })
    .catch(() => {});
};
</script>

<style scoped>
.settings-page {
  padding-bottom: 80px; /* 给底部按钮留空间 */
  background-color: #f7f8fa;
  min-height: 100vh;
}

.content {
  padding-top: 12px;
}

.logout-button {
  position: fixed;
  bottom: 20px;
  left: 16px;
  right: 16px;
}
</style>
