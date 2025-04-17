<template>
  <div class="page-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="收货地址"
      left-text="返回"
      left-arrow
      @click-left="onBack"
    />

    <!-- 地址列表 -->
    <van-cell-group style="margin-top: 20px">
      <van-cell
        v-for="(address, index) in addresses"
        :key="index"
        :title="address.name"
        :label="address.areaText"
        :value="address.detail"
        @click="onEditAddress(index)"
        v-long-press="() => onLongPress(index)"
      />
    </van-cell-group>

    <!-- 添加地址按钮 -->
    <div class="add-address-btn">
      <van-button block type="primary" icon="plus" @click="onAddAddress">
        添加新地址
      </van-button>
    </div>

    <!-- 操作菜单 -->
    <van-action-sheet
      v-model:show="showAction"
      :actions="actions"
      cancel-text="取消"
      @select="onActionSelect"
    />

    <!-- 删除确认弹窗 -->
    <van-dialog
      v-model:show="showConfirm"
      title="确认删除"
      message="确定要删除该地址吗？"
      show-cancel-button
      @confirm="confirmDelete"
    />

    <!-- 编辑地址弹窗 -->
    <van-popup
      v-model:show="showEditPopup"
      position="bottom"
      round
      :style="{ height: '60%' }"
    >
      <div class="popup-content">
        <van-form @submit="onSaveEdit">
          <van-field v-model="editForm.name" label="姓名" required />
          <van-field v-model="editForm.areaText" label="地区" required />
          <van-field v-model="editForm.detail" label="详细地址" required />
          <div style="margin: 16px">
            <van-button block type="primary" native-type="submit"
              >保存</van-button
            >
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";

const router = useRouter();

const addresses = ref([
  {
    name: "张三",
    areaText: "北京市 朝阳区",
    detail: "北京市朝阳区某街道123号",
  },
  {
    name: "李四",
    areaText: "上海市 浦东新区",
    detail: "上海市浦东新区某大厦456号",
  },
]);

const showAction = ref(false);
const showConfirm = ref(false);
const selectedIndex = ref<number | null>(null);

// 编辑弹窗控制
const showEditPopup = ref(false);
const editForm = ref({
  name: "",
  areaText: "",
  detail: "",
});

// 打开编辑弹窗
const onEditAddress = (index: number) => {
  selectedIndex.value = index;
  const addr = addresses.value[index];
  editForm.value = { ...addr };
  showEditPopup.value = true;
};

// 保存编辑
const onSaveEdit = () => {
  if (selectedIndex.value !== null) {
    addresses.value[selectedIndex.value] = { ...editForm.value };
    showToast("保存成功");
    showEditPopup.value = false;
  }
};

// 删除地址相关逻辑
const onLongPress = (index: number) => {
  selectedIndex.value = index;
  showAction.value = true;
};

const actions = [{ name: "删除" }];

const onActionSelect = (action: any) => {
  if (action.name === "删除") {
    showAction.value = false;
    showConfirm.value = true;
  }
};

const confirmDelete = () => {
  if (selectedIndex.value !== null) {
    addresses.value.splice(selectedIndex.value, 1);
    showToast("删除成功");
    selectedIndex.value = null;
  }
};

// 添加地址跳转（这里你可以也改成弹窗编辑）
const onAddAddress = () => {
  showEditPopup.value = true;
  selectedIndex.value = addresses.value.length;
  editForm.value = {
    name: "",
    areaText: "",
    detail: "",
  };
};

// 返回上一页
const onBack = () => {
  router.back();
};
</script>

<style scoped>
.add-address-btn {
  position: fixed;
  bottom: 16px;
  left: 16px;
  right: 16px;
}
.popup-content {
  padding: 16px;
}
</style>
