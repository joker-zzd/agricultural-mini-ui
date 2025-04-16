<template>
  <div class="about-page">
    <van-nav-bar title="关于我们" left-arrow @click-left="goBack" />

    <div class="about-content">
      <h2 class="title">农资优选商城</h2>
      <p class="subtitle">您身边专业的农资采购平台</p>

      <section>
        <h3>平台简介</h3>
        <p>
          农资优选商城致力于为广大农户、农业企业提供优质、实惠的农资产品，涵盖种子、化肥、农药、农机等品类，构建安全高效的农业供应链。
        </p>
      </section>

      <section>
        <h3>我们的理念</h3>
        <p>
          我们坚持“品质第一、服务至上”的宗旨，助力现代农业发展，打造可信赖的一站式农资电商平台。
        </p>
      </section>

      <section>
        <h3>联系我们</h3>
        <p>客服热线：400-123-4567</p>
        <p>邮箱：support@nongzi.com</p>
        <p>地址：北京市朝阳区未来农业科技园A座</p>
      </section>

      <div class="footer">© 2025 农资优选商城 | 京ICP备20250101号</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
const goBack = () => router.back();
</script>

<style scoped>
.about-page {
  background-color: #f8f8f8;
  min-height: 100vh;
}

.about-content {
  padding: 20px;
  background-color: #fff;
}

.logo {
  margin: 0 auto 16px;
  display: block;
}

.title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
}

.subtitle {
  text-align: center;
  font-size: 14px;
  color: #888;
  margin-bottom: 24px;
}

section {
  margin-bottom: 20px;
}

section h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

section p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.footer {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-top: 40px;
  padding-bottom: 20px;
}
</style>
