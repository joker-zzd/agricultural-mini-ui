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
            <template #price>
              <div style="font-size: 14px; color: #f5222d">
                ￥{{ item.price }}
              </div>
            </template>
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
import { showToast, showConfirmDialog } from "vant";
import { findByPage, SearchParams, deleteAllById } from "@/api/cart";
import { createOrder, CreateOrder } from "@/api/order";

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
const searchParams = ref<SearchParams>({
  currentPage: 1,
  pageSize: 10,
});

const createOrderParams = ref<CreateOrder>({
  totalAmount: 0,
  orderItems: [],
});

//方法区
const loadCartItems = () => {
  findByPage({
    currentPage: searchParams.value.currentPage,
    pageSize: searchParams.value.pageSize,
  })
    .then((res) => {
      if (res.code === 0) {
        cartItems.value = res.data;
      } else {
        showToast(res.message);
      }
    })
    .catch((e) => {
      console.error(e.message);
      showToast("数据获取失败");
    });
  checkedItems.value = cartItems.value.map((item) => item.id);
  checkAll.value = true;
};

onMounted(() => {
  loadCartItems();
});

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
    title: "提示",
    message: "确定要删除选中的商品吗？",
  })
    .then(async () => {
      try {
        const res = await deleteAllById(checkedItems.value);
        if (res.code === 0) {
          // 删除成功后更新本地数据
          cartItems.value = cartItems.value.filter(
            (item) => !checkedItems.value.includes(item.id)
          );
          checkedItems.value = [];
          showToast("删除成功");
        } else {
          showToast(res.message || "删除失败");
        }
      } catch (err) {
        console.error(err);
        showToast("删除失败，请稍后重试");
      }
    })
    .catch(() => {
      // 用户取消删除
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
  console.log("选中的商品：", selectedItems);
  const data = encodeURIComponent(JSON.stringify(selectedItems));

  createOrderParams.value = {
    totalAmount: totalPrice.value,
    orderItems: selectedItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price * item.quantity,
      image: item.imageUrl,
      name: item.name,
      description: item.description,
    })),
  };
  createOrder({
    ...createOrderParams.value,
  }).then((res) => {
    if (res.code === 0) {
      router.push({ path: "/orderConfirm", query: { data } });
    } else {
      showToast(res.message || "订单创建失败");
    }
  });
};
</script>

<style scoped>
.cart-page {
  background-color: #f8f8f8;
  min-height: 100vh;
  padding-bottom: 90px;
  overflow-y: auto;
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
