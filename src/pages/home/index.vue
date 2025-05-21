<template>
  <div class="home-page">
    <!-- 顶部搜索栏 -->
    <van-search
      v-model="search"
      placeholder="搜索农资商品"
      @search="onSearch"
    />

    <!-- 分类 Tabs -->
    <van-tabs v-model:active="activeCategory" swipeable @change="changeActive">
      <van-tab
        v-for="item in categoriesData"
        :title="item.name"
        :key="item.id"
        :name="item.id"
      >
        <!-- 筛选区 -->
        <div class="filter-bar">
          <van-field
            v-model="priceRange.min"
            type="number"
            label="价格从"
            placeholder="最低价"
            input-align="left"
            label-width="60px"
          />
          <van-field
            v-model="priceRange.max"
            type="number"
            label="到"
            placeholder="最高价"
            input-align="left"
            label-width="30px"
          />
          <van-button size="small" type="primary" @click="onFilter"
            >筛选</van-button
          >
        </div>

        <!-- 商品列表 -->
        <van-card
          v-for="product in filteredGoods(item.id)"
          :key="product.id"
          :title="product.name"
          :desc="product.description"
          :thumb="product.imageUrl"
          :price="product.price"
          :origin-price="product.originalPrice"
          currency="¥"
        >
          <template #thumb>
            <van-image
              @click="handleSkipDetail(product.id)"
              width="88"
              height="88"
              fit="cover"
              :src="product.imageUrl"
            />
          </template>
          <template #footer>
            <van-button
              size="small"
              type="primary"
              @click="toPayment(product.id)"
              >立即购买</van-button
            >
          </template>
        </van-card>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  categoriesList,
  findByPage,
  findByPageAndCategoryId,
  SearchParams,
  SearchParamsById,
} from "@/api/home";
import { showToast, Image as VanImage } from "vant";
import { useRouter } from "vue-router";
import { createOrder, CreateOrder } from "@/api/order";

const router = useRouter();
const search = ref("");
const activeCategory = ref(0);

const searchParams = ref<SearchParams>({
  currentPage: 1,
  pageSize: 10,
  name: "",
  description: "",
  price: "",
  min: "",
  max: "",
});

const searchParamsById = ref<SearchParamsById>({
  currentPage: 1,
  pageSize: 10,
  name: "",
  description: "",
  price: "",
  categoryId: 0,
  min: "",
  max: "",
});

const goods = ref<any[]>([]);

const priceRange = ref({
  min: "",
  max: "",
});

const categoriesData = ref([{ id: 0, name: "全部" }]);

const createOrderParams = ref<CreateOrder>({
  totalAmount: 0,
  orderItems: [],
});

//方法区

const onSearch = () => {
  // 搜索逻辑可以根据 search.value 模糊匹配
};

const onFilter = () => {
  // 触发 computed 重新计算
};

const getGoodsList = () => {
  const category = categoriesData.value.find(
    (item) => item.id === activeCategory.value
  );

  if (!category) return;

  const isAllCategory = category.id === 0;

  const min = priceRange.value.min;
  const max = priceRange.value.max;

  if (isAllCategory) {
    searchParams.value.name = search.value;
    searchParams.value.min = min;
    searchParams.value.max = max;

    findByPage(searchParams.value)
      .then((res) => {
        if (res.code === 0) {
          goods.value = res.data;
        }
      })
      .catch((err) => showToast(err.message));
  } else {
    searchParamsById.value.name = search.value;
    searchParamsById.value.min = min;
    searchParamsById.value.max = max;
    searchParamsById.value.categoryId = category.id;

    findByPageAndCategoryId(searchParamsById.value)
      .then((res) => {
        if (res.code === 0) {
          goods.value = res.data;
        }
      })
      .catch((err) => showToast(err.message));
  }
};

const filteredGoods = (categoryId: number) => {
  return goods.value.filter((item) => {
    const matchCategory = categoryId === 1 || item.categoryId === categoryId;
    const matchMin =
      !priceRange.value.min || item.price >= Number(priceRange.value.min);
    const matchMax =
      !priceRange.value.max || item.price <= Number(priceRange.value.max);
    const matchSearch = !search.value || item.name.includes(search.value);
    return matchCategory && matchMin && matchMax && matchSearch;
  });
};

const getCategoriesList = () => {
  categoriesList()
    .then((res) => {
      if (res.code === 0) {
        categoriesData.value = res.data;
      }
    })
    .catch((e) => [showToast(e.message)]);
};

const handleSkipDetail = (id: number) => {
  router.push(`/productDetail?id=${id}`);
};
const toPayment = (id: number) => {
  createOrderParams.value = {
    totalAmount: goods.value.find((item) => item.id === id).price,
    orderItems: [
      {
        productId: id,
        quantity: 1,
        price: goods.value.find((item) => item.id === id).price,
        image: goods.value.find((item: any) => item.id === id).imageUrl,
        name: goods.value.find((item) => item.id === id).name,
        description: goods.value.find((item) => item.id === id).description,
      },
    ],
  };

  createOrder({
    ...createOrderParams.value,
  }).then((res) => {
    if (res.code === 0) {
    } else {
      showToast(res.message || "订单创建失败");
    }
  });

  const selected = goods.value.find((g) => g.id === id);
  if (!selected) return;

  // 默认数量设为 1（可以根据业务调整）
  const orderItem = {
    ...selected,
    quantity: 1,
  };

  const data = encodeURIComponent(JSON.stringify([orderItem]));
  router.push({
    path: "/orderConfirm",
    query: {
      data,
    },
  });
};

const changeActive = (active: number) => {};
onMounted(() => {
  getGoodsList();
  getCategoriesList();
});
</script>

<style scoped>
.home-page {
  padding-bottom: 60px;
  overflow-y: auto;
}

.filter-bar {
  padding: 10px;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
