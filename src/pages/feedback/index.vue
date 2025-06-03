<template>
  <div class="feedback-page">
    <van-nav-bar title="意见反馈" left-arrow @click-left="goBack" />

    <van-form @submit="handleSubmit" style="margin-top: 12px">
      <div class="form-item">
        <van-field
          v-model="form.content"
          name="content"
          label="反馈内容"
          type="textarea"
          placeholder="请输入您的反馈内容"
          :rules="[{ required: true, message: '请填写反馈内容' }]"
        />
      </div>

      <div class="form-item">
        <van-uploader
          v-model="form.imageList"
          :max-count="1"
          :after-read="handleImageUpload"
        >
          <van-cell title="上传图片（可选）" icon="photo-o" is-link />
        </van-uploader>
      </div>

      <div class="form-item">
        <van-field
          v-model="form.contactDetails"
          name="contactDetails"
          label="联系方式"
          placeholder="如手机号、微信号"
          :rules="[{ required: true, message: '请填写联系方式' }]"
        />
      </div>

      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">
          提交反馈
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { showToast } from "vant";
import { useRouter } from "vue-router";
import request from "@/utils/request";

const router = useRouter();

const form = ref({
  content: "",
  image: "",
  imageList: [],
  contactDetails: "",
});

const goBack = () => {
  router.back();
};

const handleImageUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file.file);

  try {
    const res = await request.post("/api/file/upload", formData);
    form.value.image = res.data;
    showToast("图片上传成功");
  } catch (err) {
    showToast("上传失败");
  }
};

const handleSubmit = async () => {
  try {
    const payload = {
      content: form.value.content,
      image: form.value.image,
      contactDetails: form.value.contactDetails,
    };
    await request.post("/api/feedback/save", payload);
    showToast("提交成功");
    form.value = {
      content: "",
      image: "",
      imageList: [],
      contactDetails: "",
    };
  } catch (err) {
    showToast("提交失败");
  }
};
</script>

<style scoped>
.feedback-page {
  padding: 12px;
}
.form-item {
  margin-bottom: 8px;
}
</style>
