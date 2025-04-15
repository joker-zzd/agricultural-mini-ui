<template>
  <div class="reviews-page">
    <van-nav-bar title="所有评价" left-arrow @click-left="goBack" />
    <div class="reviews-list">
      <div
        v-for="(review, index) in product.reviews"
        :key="index"
        class="review-item"
      >
        <div class="review-user">
          <span class="user-name">{{ review.userName }}</span>
          <span class="user-rating">{{ review.rating }} ★</span>
        </div>
        <p class="review-content">{{ review.comment }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  router.back();
};

// 模拟商品数据
const product = {
  id: 1,
  name: "优质复合肥",
  reviews: [
    { userName: "张三", rating: 5, comment: "非常好用，效果显著！" },
    { userName: "李四", rating: 4, comment: "不错，质量可以，有点贵。" },
    { userName: "王五", rating: 3, comment: "一般般，没什么特别的感觉。" },
    { userName: "赵六", rating: 4, comment: "挺好的，性价比高。" },
    { userName: "孙七", rating: 5, comment: "效果非常好，值得购买！" },
  ],
};
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
</style>
