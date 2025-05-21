<template>
  <div class="comment-page">
    <!-- 顶部导航 -->
    <van-nav-bar title="发表评价" left-arrow @click-left="goBack" />

    <div class="content">
      <!-- 星级评分 -->
      <div class="section">
        <div class="label">评分</div>
        <van-rate v-model="score" count="5" />
      </div>

      <!-- 评价内容 -->
      <div class="section">
        <div class="label">评价内容</div>
        <van-field
          v-model="comment"
          rows="4"
          autosize
          type="textarea"
          maxlength="300"
          placeholder="请输入你的评价（最多300字）"
          show-word-limit
        />
      </div>

      <!-- 提交按钮 -->
      <van-button
        type="primary"
        block
        style="margin-top: 24px"
        @click="submitComment"
      >
        提交评价
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { showToast } from "vant";
import { addReview } from "@/api/reviews"; // 你自己的接口方法

const router = useRouter();
const route = useRoute();

const score = ref(0);
const comment = ref("");
const productId = ref();
const orderId = ref();
const submitComment = async () => {
  if (!score.value || !comment.value.trim()) {
    showToast("请填写完整评价和评分");
    return;
  }
  const res = await addReview({
    productId: productId.value,
    rating: score.value,
    comment: comment.value,
    orderId: orderId.value,
  });
  if (res.code === 0) {
    showToast("评价成功");
    router.back();
  } else {
    showToast(res.msg || "评价提交失败");
  }
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  productId.value = route.query.productId;
  orderId.value = route.query.orderId;
});
</script>

<style scoped>
.comment-page {
  padding: 16px;
  background: #f7f8fa;
  min-height: 100vh;
}

.section {
  margin-bottom: 20px;
}

.label {
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}
</style>
