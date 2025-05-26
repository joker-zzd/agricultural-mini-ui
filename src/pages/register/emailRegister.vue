<template>
  <div class="register-page">
    <div class="register-container">
      <h2 class="register-title">创建农资商城账号</h2>

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
          v-model="form.email"
          name="email"
          label="邮箱"
          placeholder="请输入邮箱"
          left-icon="envelop-o"
          :rules="[
            { required: true, message: '请输入邮箱' },
            {
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: '邮箱格式不正确',
            },
          ]"
        />
        <van-field
          v-model="form.emailCode"
          name="code"
          label="验证码"
          placeholder="请输入验证码"
        >
          <template #button>
            <van-button
              size="small"
              type="primary"
              :disabled="countdown > 0 || sending"
              @click="sendCode"
            >
              {{ countdown > 0 ? `${countdown}s后重发` : "发送验证码" }}
            </van-button>
          </template>
        </van-field>

        <van-field
          v-model="form.password"
          name="password"
          type="password"
          label="密码"
          placeholder="请输入密码"
          left-icon="lock"
          :rules="[{ required: true, message: '请输入密码' }]"
        />
        <van-field
          v-model="form.confirmPassword"
          name="confirmPassword"
          type="password"
          label="确认密码"
          placeholder="请再次输入密码"
          left-icon="lock"
          :rules="[
            { required: true, message: '请确认密码' },
            { validator: validateConfirmPassword, message: '两次密码不一致' },
          ]"
        />

        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit">
            注册
          </van-button>
        </div>

        <div class="to-login" @click="router.push('/login')">
          已有账号？<span class="login-text">去登录</span>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { sendEmailCode, EmailRegister, UserEmailRegisterDTO } from "@/api/user";

const router = useRouter();

const form = reactive({
  username: "",
  email: "",
  emailCode: "",
  password: "",
  confirmPassword: "",
});

const countdown = ref(0);
const timer = ref<number>();
const sending = ref(false);

const sendCode = async () => {
  if (!form.email) {
    return showToast("请先输入邮箱");
  }

  sending.value = true;
  console.log("发送验证码", form.email);

  const res = await sendEmailCode(form.email);
  sending.value = false;

  if (res.code === 0) {
    showToast("验证码已发送");
    startCountdown();
  } else {
    showToast(res.message || "发送失败");
  }
};

const startCountdown = () => {
  countdown.value = 60;
  //  设置定时器并保存定时器ID
  timer.value = window.setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer.value); //  正确清除
      timer.value = undefined; //  清空 timer
    }
  }, 1000);
};

const validateConfirmPassword = () => form.password === form.confirmPassword;

const onSubmit = async () => {
  if (!validateConfirmPassword()) {
    return showToast("两次密码输入不一致");
  }
  const registerData: UserEmailRegisterDTO = {
    username: form.username,
    email: form.email,
    emailCode: form.emailCode,
    password: form.password,
  };
  const res = await EmailRegister(registerData);
  if (res.code === 0) {
    showToast("注册成功");
    router.push("/login");
  } else {
    showToast(res.message || "注册失败");
  }

  // 提交注册逻辑
};

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f4fdf4, #e0f5dc);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.register-container {
  background-color: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 360px;
}

.register-image {
  max-width: 100px;
  margin: 0 auto 16px;
  display: block;
}

.register-title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
  color: #333;
}

.to-login {
  text-align: center;
  margin-top: 12px;
  color: #999;
  font-size: 14px;
  cursor: pointer;
}

.login-text {
  color: #00b578;
  margin-left: 4px;
}
</style>
