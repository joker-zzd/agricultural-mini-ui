<template>
  <div class="change-password-page">
    <van-nav-bar
      title="修改密码"
      left-text="返回"
      left-arrow
      @click-left="onBack"
    />

    <van-cell-group inset style="margin-top: 20px">
      <van-field
        v-model="form.oldPassword"
        label="原密码"
        placeholder="请输入原密码"
        required
        :type="showPassword ? 'text' : 'password'"
        :right-icon="showPassword ? 'eye-o' : 'closed-eye'"
        @click-right-icon="showPassword = !showPassword"
      />
      <van-field
        v-model="form.newPassword"
        label="新密码"
        placeholder="请输入新密码"
        required
        :type="showPassword1 ? 'text' : 'password'"
        :right-icon="showPassword1 ? 'eye-o' : 'closed-eye'"
        @click-right-icon="showPassword1 = !showPassword1"
      />
      <van-field
        v-model="form.confirmPassword"
        label="确认密码"
        placeholder="请再次输入新密码"
        required
        :type="showPassword2 ? 'text' : 'password'"
        :right-icon="showPassword2 ? 'eye-o' : 'closed-eye'"
        @click-right-icon="showPassword2 = !showPassword2"
      />
    </van-cell-group>

    <div style="margin: 20px">
      <van-button type="primary" block @click="onSubmit" color="#409eff"
        >确认修改</van-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { showToast } from "vant";
import { useRouter } from "vue-router";
import { updatePassword } from "@/api/user"; // 假设你封装了该接口

const router = useRouter();
const showPassword = ref();
const showPassword1 = ref();
const showPassword2 = ref();

const form = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const onSubmit = async () => {
  const { oldPassword, newPassword, confirmPassword } = form.value;

  if (!oldPassword || !newPassword || !confirmPassword) {
    showToast("请填写所有字段");
    return;
  }

  // 密码长度校验（6~20位）
  const passwordRegex = /^.{6,20}$/;
  if (!passwordRegex.test(newPassword)) {
    showToast("密码必须为6~20位字符");
    return;
  }

  if (newPassword !== confirmPassword) {
    showToast("两次输入的新密码不一致");
    return;
  }

  try {
    const res = await updatePassword({
      oldPassword,
      newPassword,
    });

    if (res.code === 0) {
      showToast("密码修改成功，请重新登录");
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      }, 1000);
    } else {
      showToast(res.message || "修改失败");
    }
  } catch (err: any) {
    showToast(err.message || "请求失败");
  }
};

const onBack = () => {
  router.back();
};
</script>

<style scoped>
.change-password-page {
  background-color: #f8f8f8;
  min-height: 100vh;
}
</style>
