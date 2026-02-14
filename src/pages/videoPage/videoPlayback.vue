<template>
  <div class="video-play-page">
    <!-- 顶部导航 -->
    <van-nav-bar title="视频播放" left-arrow @click-left="goBack" />

    <!-- 视频区域 -->
    <div class="video-container">
      <video
        ref="videoRef"
        class="video-player"
        :src="videoUrl"
        controls
        playsinline
        webkit-playsinline
        preload="auto"
      ></video>
    </div>

    <!-- 视频信息 -->
    <div class="video-info">
      <div class="title">{{ videoDetail.title }}</div>
      <div class="desc">{{ videoDetail.description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "@/router/idnex";
import { findById } from "@/api/video";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";

const route = useRoute();
const videoUrl = ref("");
const videoId = Number(route.params.id);
const videoDetail = ref({
  title: "",
  description: "",
});

const videoRef = ref<HTMLVideoElement | null>(null);

const fetchVideoDetail = async () => {
  const res = await findById(videoId);
  videoUrl.value = res.data.url;
  videoDetail.value = res.data;
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  fetchVideoDetail();
});
</script>

<style scoped>
.video-play-page {
  min-height: 100vh;
}

.video-container {
  width: 100%;
}

.video-player {
  width: 100%;
  height: 210px;
  background: #000;
  object-fit: contain;
}

.video-info {
  padding: 12px;
  background: #fff;
}

.title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}

.desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}
</style>
