<template>
  <div class="cart-page">
    <van-nav-bar title="购物车" left-arrow @click-left="goBack" />

    <template v-if="cartItems.length > 0">
      <van-checkbox-group v-model="checkedItems" ref="checkboxGroup">
        <van-swipe-cell v-for="item in cartItems" :key="item.id">
          <template #left>
            <van-button
              square
              type="danger"
              text="删除"
              @click="deleteItem(item.id)"
            />
          </template>

          <van-card
            :title="item.name"
            :desc="item.description"
            :thumb="item.imageUrl"
            :price="item.price"
          >
            <template #desc>
              <div>{{ item.description }}</div>
              <div v-if="item.skuName" style="color: #888; font-size: 12px">
                规格：{{ item.skuName }}
              </div>
            </template>

            <template #num>
              <van-stepper
                v-model="item.quantity"
                @change="() => onQuantityChange(item)"
                min="1"
                integer
              />
            </template>

            <template #origin-price>¥{{ item.originalPrice }}</template>

            <template #footer>
              <van-checkbox :name="item.id" />
            </template>
          </van-card>
        </van-swipe-cell>
      </van-checkbox-group>

      <!-- 底部操作栏 -->
      <div class="cart-bottom-bar">
        <van-checkbox v-model="checkAll" @change="toggleAll">全选</van-checkbox>
        <div class="total">
          合计：<span class="price">¥{{ totalPrice }}</span>
        </div>
        <van-button type="danger" @click="checkout">去结算</van-button>
        <van-button type="warning" @click="deleteSelected">删除选中</van-button>
      </div>
    </template>

    <template v-else>
      <div class="empty-cart">
        <van-image
          width="160"
          height="160"
          fit="contain"
          src="https://cdn.jsdelivr.net/gh/zh-lx/StaticRepo@main/cart-empty.png"
        />
        <p>购物车空空如也～</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { showToast, Dialog, showConfirmDialog } from "vant";

// 模拟接口导入
// import { fetchCartList, updateCartQuantity, deleteCartItem } from "@/api/cart";

const router = useRouter();
const goBack = () => router.back();

interface CartItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  originalPrice: number;
  quantity: number;
  skuId: number;
  skuName?: string;
}

const cartItems = ref<CartItem[]>([]);
const checkedItems = ref<number[]>([]);
const checkAll = ref(false);

// 模拟从后端获取购物车列表
const loadCartItems = async () => {
  cartItems.value = [
    {
      id: 1,
      name: "优质复合肥",
      description: "含氮磷钾，有机肥料",
      imageUrl: "https://img.yzcdn.cn/vant/apple-2.jpg",
      price: 48,
      originalPrice: 58,
      quantity: 1,
      skuId: 10001,
      skuName: "10kg装",
    },
    {
      id: 2,
      name: "高效杀虫剂",
      description: "广谱杀虫，持久防护",
      imageUrl: "https://img.yzcdn.cn/vant/apple-1.jpg",
      price: 32,
      originalPrice: 40,
      quantity: 2,
      skuId: 10002,
      skuName: "500ml瓶",
    },
  ];
  checkedItems.value = cartItems.value.map((item) => item.id);
  checkAll.value = true;
};

onMounted(loadCartItems);

watch(checkedItems, () => {
  checkAll.value = checkedItems.value.length === cartItems.value.length;
});

const toggleAll = () => {
  if (checkAll.value) {
    checkedItems.value = cartItems.value.map((item) => item.id);
  } else {
    checkedItems.value = [];
  }
};

const totalPrice = computed(() => {
  return checkedItems.value.reduce((sum, id) => {
    const item = cartItems.value.find((i) => i.id === id);
    return item ? sum + item.price * item.quantity : sum;
  }, 0);
});

// 步进器变更数量（应调用接口）
const onQuantityChange = async (item: CartItem) => {
  // await updateCartQuantity(item.id, item.quantity);
  console.log(`更新数量：id=${item.id}, quantity=${item.quantity}`);
};

const deleteItem = async (id: number) => {
  // await deleteCartItem(id);
  cartItems.value = cartItems.value.filter((item) => item.id !== id);
  checkedItems.value = checkedItems.value.filter((i) => i !== id);
};

const deleteSelected = () => {
  if (checkedItems.value.length === 0) {
    showToast("请选择要删除的商品");
    return;
  }
  showConfirmDialog({
    title: "标题",
    message:
      "如果解决方法是丑陋的，那就肯定还有更好的解决方法，只是还没有发现而已。",
  })
    .then(() => {
      cartItems.value = cartItems.value.filter(
        (item) => !checkedItems.value.includes(item.id)
      );
      checkedItems.value = [];
    })
    .catch(() => {
      // on cancel
    });
};

const checkout = () => {
  if (checkedItems.value.length === 0) {
    showToast("请先选择商品");
    return;
  }

  const selectedItems = cartItems.value.filter((item) =>
    checkedItems.value.includes(item.id)
  );
  const data = encodeURIComponent(JSON.stringify(selectedItems));
  router.push({ path: "/order-confirm", query: { data } });
};
</script>

<style scoped>
.cart-page {
  background-color: #f8f8f8;
  min-height: 100vh;
  padding-bottom: 90px;
}

.cart-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  gap: 8px;
  flex-wrap: wrap;
}

.total {
  font-size: 14px;
}

.price {
  color: #ee0a24;
  font-weight: bold;
  margin-left: 4px;
}

.empty-cart {
  text-align: center;
  padding-top: 80px;
  color: #999;
  font-size: 14px;
}
</style>
