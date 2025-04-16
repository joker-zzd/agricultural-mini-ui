<template>
  <div class="profile-edit-page">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="个人资料"
      left-text="返回"
      left-arrow
      @click-left="onBack"
    />

    <van-cell-group style="margin-top: 20px">
      <!-- 头像上传 -->
      <van-cell title="头像" is-link @click="onUploadAvatar">
        <template #right-icon>
          <van-image round width="40" height="40" :src="user.avatar" />
        </template>
      </van-cell>

      <!-- 用户昵称 -->
      <van-field
        v-model="user.nickname"
        label="昵称"
        placeholder="请输入昵称"
        @blur="handleUpdateNickname"
      />

      <!-- 性别选择 -->
      <van-cell
        title="性别"
        :value="user.sex"
        is-link
        @click="showGenderPicker = true"
      />
    </van-cell-group>

    <!-- 性别选择器 -->
    <van-action-sheet
      v-model:show="showGenderPicker"
      title="选择性别"
      @select="updateGender"
      :actions="genderOptions"
    />

    <!-- 头像上传组件（隐藏，自动触发） -->
    <input
      ref="avatarInputRef"
      type="file"
      accept="image/*"
      style="display: none"
      @change="onAvatarSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { showToast } from "vant";
import { updateNickname, updateSex, updateavatar } from "@/api/user";
import { useUserStore } from "@/store/user";

// 用户数据存储
const userStore = useUserStore();
const user = userStore.user;

// 性别选择
const showGenderPicker = ref(false);
const genderOptions = [
  { name: "男", value: "男" },
  { name: "女", value: "女" },
];

// 更新昵称
const handleUpdateNickname = () => {
  updateNickname(user.nickname)
    .then((res) => {
      if (res.code === 0) {
        showToast("昵称已修改");
      } else {
        showToast(res.message);
      }
    })
    .catch((e) => showToast(e.message));
};

// 更新性别
const updateGender = (option: any) => {
  user.gender = option.value;
  showGenderPicker.value = false;
  updateSex(user.gender)
    .then((res) => {
      if (res.code === 0) {
        showToast("性别已修改");
      } else {
        showToast(res.message);
      }
    })
    .catch((e) => {
      showToast(e.message);
    });
};

// 头像上传
const avatarInputRef = ref<HTMLInputElement | null>(null);
const onUploadAvatar = () => {
  avatarInputRef.value?.click();
};

const onAvatarSelected = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    // 创建 FormData 并上传文件到服务器
    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadResponse = await fetch(
        "http://127.0.0.1:8082/mini/api/file/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await uploadResponse.json();
      console.log("result", result.url);

      if (result.code === 0) {
        const avatarUrl = result.url; // 获取上传的头像 URL
        // 调用封装好的更新头像接口
        updateavatar(avatarUrl)
          .then((updateRes: any) => {
            if (updateRes.code === 0) {
              // 更新用户头像
              user.avatar = avatarUrl;
              showToast("头像已更新");
            } else {
              showToast(updateRes.message);
            }
          })
          .catch((e) => {
            showToast(e.message || "头像更新失败");
          });
      } else {
        showToast(result.message);
      }
    } catch (error: any) {
      showToast(error.message || "头像上传失败");
    }
  }
};

// 返回
const onBack = () => history.back();
</script>

<style scoped>
.profile-edit-page {
  background-color: #f8f8f8;
  min-height: 100vh;
}
</style>
