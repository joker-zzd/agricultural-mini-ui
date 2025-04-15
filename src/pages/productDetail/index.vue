<template>
  <div class="product-detail-page">
    <!-- 顶部导航 -->
    <van-nav-bar title="商品详情" left-arrow @click-left="goBack" />

    <!-- 商品图片 -->
    <van-swipe class="product-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(img, index) in product.images" :key="index">
        <van-image width="100%" height="200px" fit="cover" :src="img" />
      </van-swipe-item>
    </van-swipe>

    <!-- 商品信息 -->
    <div class="product-info">
      <h2 class="title">{{ product.name }}</h2>
      <div class="price-area">
        <span class="price">¥{{ product.price }}</span>
        <span class="original-price">¥{{ product.originalPrice }}</span>
      </div>
      <p class="desc">{{ product.description }}</p>
    </div>

    <!-- 商品详情模块 -->
    <van-cell-group title="商品详情" inset>
      <van-cell title="品牌" :value="product.brand" />
      <van-cell title="库存" :value="product.stock" />
      <van-cell title="产地" :value="product.origin" />
    </van-cell-group>

    <!-- 评价模块 -->
    <div class="reviews-section">
      <div class="reviews-header">
        <h3 class="reviews-title">用户评价</h3>
        <span class="view-all" @click="goToReviewsPage">
          查看全部
          <van-icon name="arrow" size="12" />
        </span>
      </div>
      <div
        v-for="(review, index) in product.reviews.slice(0, 2)"
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

    <!-- 底部按钮栏：加入购物车和立即购买 -->
    <van-action-bar>
      <van-action-bar-button
        type="primary"
        text="加入购物车"
        @click="addToCart"
      />
      <van-action-bar-button type="warning" text="立即购买" @click="buyNow" />
    </van-action-bar>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { showToast } from "vant";

const router = useRouter();

const goBack = () => {
  router.back();
};

const goToReviewsPage = () => {
  router.push("/reviews");
};

// 模拟商品数据
const product = {
  id: 1,
  name: "优质复合肥",
  description: "含氮磷钾，有机肥料，适合各种农作物生长",
  price: 48,
  originalPrice: 58,
  brand: "绿田农业",
  stock: 100,
  origin: "山东省潍坊市",
  images: [
    "https://img.yzcdn.cn/vant/apple-1.jpg",
    "https://img.yzcdn.cn/vant/apple-2.jpg",
  ],
  reviews: [
    { userName: "张三", rating: 5, comment: "非常好用，效果显著！" },
    { userName: "李四", rating: 4, comment: "不错，质量可以，有点贵。" },
    { userName: "王五", rating: 3, comment: "一般般，没什么特别的感觉。" },
    { userName: "赵六", rating: 4, comment: "挺好的，性价比高。" },
    { userName: "孙七", rating: 5, comment: "效果非常好，值得购买！" },
  ],
};

const addToCart = () => {
  showToast("已加入购物车");
};

const buyNow = () => {
  showToast("跳转到结算页面");
  router.push("/order-confirm");
};
</script>

<style scoped>
.product-detail-page {
  background-color: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 60px;
  overflow-y: auto;
}

.product-swipe {
  height: 200px;
}

.product-info {
  background-color: white;
  padding: 16px;
  margin-bottom: 8px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.price-area {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.price {
  color: #ee0a24;
  font-size: 20px;
  font-weight: bold;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.desc {
  color: #666;
  font-size: 14px;
}

.van-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.reviews-section {
  background-color: white;
  padding: 16px;
  margin-top: 16px;
}

.reviews-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}

.review-item {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 12px;
  margin-bottom: 12px;
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
.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.view-all {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.view-all .van-icon {
  margin-left: 4px;
}
</style>
