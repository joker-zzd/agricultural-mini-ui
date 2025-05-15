<template>
  <!-- 顶部导航栏 -->
  <van-nav-bar
    title="新增收货地址"
    left-text="返回"
    left-arrow
    @click-left="onBack"
  />

  <!-- 页面容器加 padding-top -->
  <div class="page-container">
    <!-- 地址表单 -->
    <van-form @submit="onSubmit" :show-error="true">
      <van-field
        v-model="form.name"
        name="name"
        label="收件人"
        placeholder="请输入收件人姓名"
        :rules="[{ required: true, message: '收件人不能为空' }]"
      />

      <van-field
        v-model="form.tel"
        name="tel"
        label="手机号"
        placeholder="请输入手机号"
        type="tel"
        :rules="[
          { required: true, message: '手机号不能为空' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误' },
        ]"
      />

      <van-field
        readonly
        clickable
        name="area"
        label="所在地区"
        v-model="areaDisplay"
        placeholder="请选择省市区"
        @click="showArea = true"
        :rules="[{ required: true, message: '请选择地区' }]"
      />
      <van-popup v-model:show="showArea" position="bottom">
        <van-area
          :area-list="areaList"
          @confirm="onAreaConfirm"
          @cancel="showArea = false"
        />
      </van-popup>

      <van-field
        v-model="form.addressDetail"
        name="detail"
        label="详细地址"
        placeholder="请输入详细地址"
        :rules="[{ required: true, message: '详细地址不能为空' }]"
      />

      <van-cell-group inset>
        <van-switch v-model="form.defaulted" size="20px" active-color="#89c3eb">
          <template #title>
            <span>设为默认地址</span>
          </template>
        </van-switch>
      </van-cell-group>

      <div style="margin: 16px">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          color="#89c3eb"
        >
          保存地址
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { areaList } from "@vant/area-data";
import { addAddress, AddAddressDTO, updateDefaulted } from "@/api/address";

// 路由控制
const router = useRouter();
const onBack = () => {
  router.back();
};

// 表单数据结构
const form = ref<AddAddressDTO>({
  id: 0,
  name: "",
  tel: "",
  province: "",
  city: "",
  county: "",
  addressDetail: "",
  defaulted: false,
});

const showArea = ref(false);

const areaDisplay = computed(() => {
  return [form.value.province, form.value.city, form.value.county]
    .filter(Boolean)
    .join(" ");
});

// 地区选择确认
const onAreaConfirm = ({ selectedOptions }: any) => {
  form.value.province = selectedOptions[0]?.text || "";
  form.value.city = selectedOptions[1]?.text || "";
  form.value.county = selectedOptions[2]?.text || "";
  showArea.value = false;
};

// 提交表单
const onSubmit = async () => {
  try {
    const res = await addAddress(form.value);
    if (res.code === 0) {
      showToast("地址保存成功");
      router.back(); // 保存后自动返回
      if (form.value.defaulted === true) {
        let id = res.data;
        updateDefaulted(id).then((res1) => {});
      }
    } else {
      showToast("保存失败：" + res.message);
    }
  } catch (error: any) {
    showToast(error.message || "请求失败");
  }
};
</script>

<style scoped>
.page-container {
  padding-top: 20px;
}
.van-switch {
  margin-left: 16px;
}
</style>
