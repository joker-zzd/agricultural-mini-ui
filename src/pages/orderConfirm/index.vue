<template>
  <div class="order-confirm-page">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="确认订单"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <!-- 收货信息 -->
    <van-cell-group inset>
      <van-cell
        title="收货地址"
        :value="receiver.address || '请选择收货地址'"
        is-link
        @click="selectAddress"
      />
    </van-cell-group>

    <!-- 商品信息 -->
    <div v-for="item in visibleItems" :key="item.id">
      <van-card
        class="compact-card"
        :num="item.quantity"
        :price="item.price"
        :desc="item.description"
        :title="item.name"
        :thumb="item.imageUrl"
      />
    </div>

    <!-- 显示“查看更多”按钮 -->
    <div
      v-if="orderData.length > 2 && !showAll"
      style="text-align: center; margin: 12px 0"
    >
      <van-button size="small" @click="showAll = true">查看更多商品</van-button>
    </div>

    <!-- 价格信息 -->
    <van-cell-group inset>
      <van-cell title="商品总价" :value="`¥${totalPrice.toFixed(2)}`" />
      <van-cell title="运费" value="¥0.00" />
      <van-cell title="应付总额" :value="`¥${totalPrice.toFixed(2)}`" />
    </van-cell-group>

    <!-- 提交订单按钮 -->
    <div style="padding: 16px">
      <van-button block type="primary" @click="submitOrder"
        >确认并支付</van-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAddressStore } from "@/store/user";
import { showToast } from "vant";
import { pay, PayParams } from "@/api/pay";
import { getOrderNo, updateShippingAddress } from "@/api/order";

const route = useRoute();
const router = useRouter();
const addressStore = useAddressStore();

const orderData = ref<any[]>([]);
const showAll = ref(false);
const orderNo = ref<string>("");
const id = ref<number>(0);

const receiver = ref({
  address: "",
});

const payParams = ref<PayParams>({
  orderNo: "11",
  totalAmount: 10,
  subject: "订单支付",
});

onMounted(() => {
  //获取订单编号
  getOrderNo()
    .then((res) => {
      if (res.code === 0) {
        orderNo.value = res.data.orderNo;
        id.value = res.data.id;
      } else {
        showToast(res.message);
      }
    })
    .catch((e) => {
      console.error(e.message);
      showToast("获取订单编号失败");
    });
  const encodeData = route.query.data;
  if (encodeData) {
    try {
      orderData.value = JSON.parse(decodeURIComponent(encodeData as string));
      console.log("订单数据", orderData.value);
    } catch (err) {
      console.error("订单数据解析失败:", err);
    }
  }
});
watchEffect(() => {
  const addr = addressStore.defaultAddress;
  if (addr) {
    receiver.value.address = `${addr.province} ${addr.city} ${addr.county} ${addr.addressDetail}`;
  }

  updateShippingAddress(id.value, receiver.value.address).then((res) => {});
});

const visibleItems = computed(() => {
  return showAll.value ? orderData.value : orderData.value.slice(0, 2);
});

const totalPrice = computed(() =>
  orderData.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

const submitOrder = () => {
  if (!receiver.value.address) {
    showToast({
      message: "请先选择收货地址",
      type: "fail",
    });
  }
  console.log("提交订单", {
    items: orderData.value,
    address: receiver.value,
  });
  // 调用下单接口
  payParams.value = {
    orderNo: orderNo.value,
    totalAmount: totalPrice.value,
    subject: "订单编号：" + orderNo.value,
  };
  pay(payParams.value)
    .then((htmlForm) => {
      // htmlForm 是支付宝返回的支付表单（字符串）
      if (htmlForm) {
        // 创建一个容器插入到 body
        const div = document.createElement("div");
        div.style.display = "none";
        div.innerHTML = htmlForm;
        document.body.appendChild(div);

        // 自动提交表单，支付宝页面会跳转
        const form = div.querySelector("form");
        if (form) {
          form.submit();
        } else {
          showToast({ message: "支付表单解析失败", type: "fail" });
        }
      } else {
        showToast({ message: "支付失败，未返回支付表单", type: "fail" });
      }
    })
    .catch(() => {
      showToast({ message: "支付请求失败", type: "fail" });
    });

  updateShippingAddress(id.value, receiver.value.address).then((res) => {
    if (res.code === 0) {
    } else {
      showToast(res.message);
    }
  });
};

const selectAddress = () => {
  router.push({ path: "/address", query: { from: "select" } });
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.order-confirm-page {
  padding-bottom: 60px;
}

.compact-card {
  margin: 8px 16px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
}

/* 卡片压缩高度 */
.compact-card .van-card__content {
  padding-top: 8px;
  padding-bottom: 8px;
}
</style>
