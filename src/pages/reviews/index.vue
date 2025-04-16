<template>
  <div class="reviews-page">
    <van-nav-bar title="所有评价" left-arrow @click-left="goBack" />
    <div class="reviews-list">
      <template v-if="reviewDate.length > 0">
        <div
          v-for="(review, index) in reviewDate"
          :key="index"
          class="review-item"
        >
          <div class="review-user">
            <span class="user-name">{{ review.nickname }}</span>
            <span class="user-rating">{{ review.rating }} ★</span>
          </div>
          <p class="review-content">{{ review.comment }}</p>
        </div>
      </template>

      <!-- 空状态兜底 -->
      <template v-else>
        <div class="empty-state">
          <img
            class="empty-img"
            src="https://img.yzcdn.cn/vant/empty-image-default.png"
            alt="暂无评价"
          />
          <p class="empty-text">暂无评价，快来抢个沙发吧～</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { findByPageAndProductId } from "@/api/reviews";
import { onMounted, ref } from "vue";
import { showToast } from "vant";

const router = useRouter();
const route = useRoute();
const reviewDate = ref<any[]>([]); // 初始化为空数组

const goBack = () => {
  router.back();
};

const getDateList = (productId: number) => {
  findByPageAndProductId(productId)
    .then((res) => {
      if (res.code === 0) {
        reviewDate.value = res.data || [];
      } else {
        showToast("获取评价失败");
      }
    })
    .catch((e) => {
      console.error(e);
      showToast(e.message || "数据获取失败");
    });
};

onMounted(() => {
  const productId = Number(route.query.productId);
  if (productId) {
    getDateList(productId);
  }
});
</script>

<style scoped>
.reviews-page {
  background-color: #f7f8fa;
  min-height: 100vh;
}

.reviews-list {
  padding: 16px;
}

.review-item {
  background-color: white;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 8px;
}

.review-user {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.user-name {
  font-size: 14px;
}

.user-rating {
  font-size: 14px;
  color: #ee0a24;
}

.review-content {
  color: #666;
  font-size: 14px;
  margin-top: 8px;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
  color: #999;
}

.empty-img {
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
}
</style>
