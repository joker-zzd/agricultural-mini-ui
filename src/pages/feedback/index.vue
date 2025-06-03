<template>
  <div class="feedback-page">
    <van-nav-bar @click-left="goBack" title="意见反馈" left-arrow />

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
          v-model="fileList"
          :after-read="onImageRead"
          :max-count="1"
          @delete="onImageDelete"
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

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { submitFeedback, uploadFeedbackImage } from "@/api/feedback";

const router = useRouter();

const form = ref({
  content: "",
  image: [] as string[], // 存储上传的图片URL
  contactDetails: "",
});

const fileList = ref<{ url: string }[]>([]); // 展示用

const onImageRead = async (file: any) => {
  uploadFeedbackImage(file)
    .then((res) => {
      if (res?.code === 0) {
        const url = res.data;
        form.value.image = [url];
        fileList.value = [{ url }];
        console.log(fileList.value);
      } else {
        showToast(res.message || "图片上传失败");
      }
    })
    .catch(() => {
      showToast("图片上传失败");
    });
};

const onImageDelete = () => {
  form.value.image = [];
  fileList.value = [];
};

const handleSubmit = async () => {
  try {
    const formData = {
      content: form.value.content,
      image: form.value.image[0] || "", // 只上传第一张图片
      contactDetails: form.value.contactDetails,
    };

    const res = await submitFeedback(formData);
    if (res.code === 0) {
      showToast("反馈提交成功");
      router.back();
    } else {
      showToast(res.message || "提交失败");
    }
  } catch (err) {
    showToast("提交失败");
  }
};

const goBack = () => {
  router.back();
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
