<template>
  <div class="product-detail-page">
    <!-- 顶部导航 -->
    <van-nav-bar title="商品详情" left-arrow @click-left="goBack" />

    <!-- 商品图片 -->
    <van-swipe class="product-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(img, index) in product.imageList" :key="index">
        <van-image width="100%" height="200px" fit="cover" :src="img.image" />
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
        v-for="(review, index) in product.reviewList"
        :key="index"
        class="review-item"
      >
        <div class="review-user">
          <span class="user-name">{{ review.nickname }}</span>
          <span class="user-rating">{{ review.rating }} ★</span>
        </div>
        <p class="review-content">{{ review.comment }}</p>
      </div>
    </div>

    <!-- 底部按钮栏 -->
    <van-action-bar>
      <van-action-bar-button
        type="primary"
        text="加入购物车"
        @click="openSkuPopup('cart')"
      />
      <van-action-bar-button
        type="warning"
        text="立即购买"
        @click="openSkuPopup('buy')"
      />
    </van-action-bar>

    <!-- SKU 选择弹出层 -->
    <van-popup
      v-model:show="showSkuPopup"
      position="bottom"
      round
      :style="{ height: '60%' }"
    >
      <div class="sku-popup">
        <h3 style="margin-bottom: 16px">选择规格</h3>
        <van-radio-group v-model="selectedSkuId">
          <van-cell-group>
            <van-cell
              v-for="sku in product.skuList"
              :key="sku.id"
              :title="sku.skuName"
              :value="'库存: ' + sku.stock + '，价格: ¥' + sku.skuPrice"
              clickable
              @click="selectedSkuId = sku.id"
            >
              <template #right-icon>
                <div style="padding-left: 6px">
                  <van-radio :name="sku.id" />
                </div>
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>

        <!-- 数量选择 -->
        <div style="margin: 16px 0">
          <h4 style="margin-bottom: 8px">购买数量</h4>
          <van-stepper
            v-model="addCaerDTO.quantity"
            integer
            min="1"
            max="99"
            default-value="1"
          />
        </div>

        <!-- 确认按钮固定底部 -->
        <div class="confirm-btn-wrapper">
          <van-button block class="confirm-btn" @click="confirmSkuAction">
            确认
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { showToast } from "vant";
import { ref, onMounted } from "vue";
import { findById, addCart, AddCaerDTO } from "@/api/productDetail";

const router = useRouter();
const route = useRoute();

const goBack = () => {
  router.back();
};

const goToReviewsPage = () => {
  router.push(`/reviews?productId=${route.query.id}`);
};

const product = ref<any>({
  imageList: [],
  reviewList: [],
  skuList: [],
});

const addCaerDTO = <AddCaerDTO>{
  productId: 0,
  skuId: 0,
  quantity: 0,
};

//方法区
const getProductDetail = async () => {
  const id = Number(route.query.id);
  if (!id) return;

  try {
    const res = await findById(id);
    if (res.code === 0) {
      product.value = res.data;
    } else {
      showToast("获取商品详情失败");
    }
  } catch (e: any) {
    showToast(e.message || "请求失败");
  }
};

// SKU 弹窗逻辑
const showSkuPopup = ref(false);
const selectedSkuId = ref<number | null>(null);
const skuActionType = ref<"cart" | "buy">("cart");

const openSkuPopup = (type: "cart" | "buy") => {
  skuActionType.value = type;
  showSkuPopup.value = true;
};

const confirmSkuAction = () => {
  if (!selectedSkuId.value) {
    showToast("请选择规格");
    return;
  }

  const sku = product.value.skuList.find(
    (s: any) => s.id === selectedSkuId.value
  );
  console.log(sku);

  if (!sku) {
    return;
  }

  addCaerDTO.productId = product.value.id;
  addCaerDTO.skuId = sku.id;

  if (skuActionType.value === "cart") {
    addCart(addCaerDTO)
      .then((res) => {
        if (res.code === 0) {
          showToast({
            message: "加入购物车成功",
            position: "top",
            duration: 2000,
          });
        } else {
          showToast(res.message);
        }
      })
      .catch((e) => {
        console.error(e.message);
        showToast(e.message);
      });
  } else {
    showToast(`购买：${sku.name}`);
    router.push("/order-confirm");
  }

  showSkuPopup.value = false;
};

onMounted(() => {
  getProductDetail();
});
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

.sku-popup {
  padding: 16px;
  padding-bottom: 80px; /* 避免按钮遮挡内容 */
}

.confirm-btn-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0 16px 16px 16px;
  background-color: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  z-index: 999;
}

.confirm-btn {
  background-color: #f94f6f;
  border-color: #f94f6f;
  color: #fff;
  border-radius: 999px;
}
/* .van-toast {
  color: #fff !important;
  font-size: 14px !important;
} */
</style>
