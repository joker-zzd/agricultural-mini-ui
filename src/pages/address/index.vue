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
        :key="address.id"
        :title="`${address.name}（${address.tel}）`"
        :label="`${address.province} ${address.city} ${address.county} ${address.addressDetail}`"
        @click="onEditAddress(index)"
        v-long-press="(e) => onLongPress(e, address.id)"
      >
        <!-- 右侧图标：表示默认地址 -->
        <template #right-icon>
          <van-icon
            name="star"
            :color="address.defaulted === true ? '#ee0a24' : '#ccc'"
            @click.stop="setAsDefault(address.id)"
          />
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 添加地址按钮 -->
    <div class="add-address-btn">
      <van-button block type="primary" icon="plus" @click="goToAddAddress">
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
      :style="{ height: '65%' }"
    >
      <div class="popup-content">
        <van-form @submit="onSaveEdit">
          <van-field v-model="editForm.name" label="姓名" required />
          <van-field v-model="editForm.tel" label="电话" required />
          <van-field v-model="editForm.province" label="省份" required />
          <van-field v-model="editForm.city" label="城市" required />
          <van-field v-model="editForm.county" label="区县" required />
          <van-field
            v-model="editForm.addressDetail"
            label="详细地址"
            required
          />
          <div style="margin: 16px">
            <van-button block type="primary" native-type="submit">
              保存
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { showToast } from "vant";
import {
  findByPage,
  SearchParams,
  deleteAllById,
  updateDefaulted,
  updateAddress,
} from "@/api/address";
import { useAddressStore } from "@/store/user";

const router = useRouter();
const route = useRoute();
const addressStore = useAddressStore();

const searchParams: SearchParams = {
  currentPage: 0,
  pageSize: 10,
};

const addresses = ref<any[]>([]);

const showAction = ref(false);
const showConfirm = ref(false);
const selectedIndex = ref<number | null>(null);
const deleteIds = ref<number[]>([]);
const defaultAddress = ref<any>({});

// 编辑弹窗控制
const showEditPopup = ref(false);
const editForm = ref({
  name: "",
  tel: "",
  province: "",
  city: "",
  county: "",
  addressDetail: "",
});

// 编辑地址
const onEditAddress = (index: number) => {
  const address = addresses.value[index];
  if (route.query.from === "select") {
    addressStore.setDefaultAddress(address);
    router.back();
    return;
  }
  selectedIndex.value = index;
  editForm.value = { ...addresses.value[index] };
  showEditPopup.value = true;
};

// 保存编辑
const onSaveEdit = () => {
  if (selectedIndex.value !== null) {
    const updatedAddress = {
      id: addresses.value[selectedIndex.value].id,
      name: editForm.value.name,
      tel: editForm.value.tel,
      province: editForm.value.province,
      city: editForm.value.city,
      county: editForm.value.county,
      addressDetail: editForm.value.addressDetail,
    };

    // 调用 updateAddress 接口
    updateAddress(updatedAddress)
      .then((res) => {
        if (res.code === 0) {
          getDataList();
          showToast("保存成功");
          showEditPopup.value = false; // 关闭编辑弹窗
        } else {
          showToast(res.message);
        }
      })
      .catch((e) => {
        showToast(e.message || "保存失败");
      });
  }
};

const setAsDefault = async (id: number) => {
  try {
    const res = await updateDefaulted(id);
    if (res.code === 0) {
      showToast("默认地址已设置");
      getDataList(); // 后端更新成功后再刷新列表
    } else {
      showToast(res.message);
    }
  } catch (e: any) {
    showToast(e.message || "设置失败");
  }
};

// 长按删除操作
const onLongPress = (e: Event, id: number) => {
  const target = e.target as HTMLElement;
  if (target.closest(".van-icon")) {
    // 如果长按的是星星图标，就不弹出删除菜单
    return;
  }

  deleteIds.value = [id];
  selectedIndex.value = id;
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
    deleteAllById(deleteIds.value)
      .then((res) => {
        if (res.code === 0) {
          showToast("删除成功");
          deleteIds.value = [];
          selectedIndex.value = null;
          getDataList();
        } else {
          showToast(res.message);
        }
      })
      .catch((e) => {
        showToast(e.message);
      });
  }
};

// 跳转添加地址页面
const goToAddAddress = () => {
  router.push("/addAddress");
};

// 获取地址列表
const getDataList = () => {
  findByPage(searchParams)
    .then((res) => {
      if (res.code === 0) {
        addresses.value = res.data;
      } else {
        showToast(res.message);
      }
    })
    .catch((e) => {
      showToast(e.message);
    });
};

// 返回上一页
const onBack = () => {
  router.back();
};

onMounted(() => {
  getDataList();
});
</script>

<style scoped>
.add-address-btn {
  position: fixed;
  bottom: 16px;
  left: 16px;
  right: 16px;
  z-index: 10;
}
.popup-content {
  padding: 16px;
}
</style>
