<template>
  <div class="login-page">
    <div class="login-container">
      <img
        src="https://shop-1325336690.cos.ap-guangzhou.myqcloud.com/images/undraw_nature_yf30.png"
        alt="农田图"
        class="login-image"
      />

      <h2 class="login-title">欢迎登录农资商城</h2>

      <van-form @submit="onSubmit">
        <van-field
          v-model="form.username"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          left-icon="user-o"
          :rules="[{ required: true, message: '请输入用户名' }]"
        />
        <van-field
          v-model="form.password"
          name="password"
          label="密码"
          type="password"
          placeholder="请输入密码"
          left-icon="lock"
          :rules="[{ required: true, message: '请输入密码' }]"
        />

        <div style="margin: 8px 16px">
          <van-checkbox v-model="rememberMe" shape="square"
            >记住密码</van-checkbox
          >
        </div>

        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit">
            登录
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { showToast } from "vant";
import { useRouter } from "vue-router";
import { debounce } from "lodash";
import { useUserStore } from "@/store/user";
import { login } from "@/api/user";

const router = useRouter();
const userStore = useUserStore();

const form = reactive({
  username: "",
  password: "",
});

const rememberMe = ref(true);

onMounted(() => {
  const savedUsername = localStorage.getItem("savedUsername");
  const savedPassword = localStorage.getItem("savedPassword");

  if (savedUsername) form.username = savedUsername;
  if (savedPassword) form.password = savedPassword;
});

const onSubmit = debounce(async () => {
  const res = await login(form);
  if (res.code === 0) {
    const token = res.data.token;
    const user = res.data.user;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    userStore.setUserInfo(token, user);

    if (rememberMe.value) {
      localStorage.setItem("savedUsername", form.username);
      localStorage.setItem("savedPassword", form.password);
    } else {
      localStorage.removeItem("savedUsername");
      localStorage.removeItem("savedPassword");
    }

    showToast("登录成功");
    router.push("/home");
  } else {
    showToast(res.message || "登录失败");
  }
}, 300);
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f4fdf4, #e0f5dc);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.login-container {
  background-color: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 360px;
}

.login-image {
  max-width: 100px;
  margin: 0 auto 16px;
  display: block;
}

.login-title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
  color: #333;
}
</style>
