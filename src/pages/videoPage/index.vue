<template>
  <div class="video-list-page">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="商城视频介绍" left-arrow @click-left="goBack" />

    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多视频了"
      @load="onLoad"
      style="margin-top: 12px"
    >
      <div class="card-wrapper">
        <div
          class="image-and-title-wrapper"
          v-for="video in videoData"
          :key="video.id"
          @click="goToVideo(video.id)"
        >
          <div class="card-image">
            <img
              :src="video.coverImageUrl"
              alt="视频封面"
              class="cover-image"
            />
          </div>
          <div class="card-title">{{ video.title }}</div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { listOnlineVideos, Video } from "@/api/video";

const router = useRouter();
const goBack = () => router.back();

const videoData = ref<Video[]>([]);
const loading = ref(false);
const finished = ref(false);

let currentPage = 1;
const pageSize = 5;

// 模拟请求后端分页接口
const fetchVideos = async (page: number, size: number) => {
  // 这里用真实接口替换
  const res = listOnlineVideos({ currentPage: page, pageSize: size });
  console.log(res);

  return res;
};

const onLoad = async () => {
  loading.value = true;
  try {
    const res = await fetchVideos(currentPage, pageSize);
    videoData.value = [...videoData.value, ...res.data];

    if (videoData.value.length >= res.total) {
      finished.value = true; // 已加载完
    } else {
      currentPage += 1;
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const goToVideo = (id: number) => {
  router.push(`/videoPlay/${id}`);
};
</script>

<style scoped>
.video-list-page {
  min-height: 100vh;
}

.card-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  margin: auto;
  padding: 0 12px;
  width: calc(100% - 28px);
}

.image-and-title-wrapper {
  display: flex;
  flex-direction: column;
  width: 152px; /* 两列布局，保证两列能放下 */
}

.card-image {
  width: 100%;
  height: 86px;
  border-radius: 8px;
}
.cover-image {
  width: 100%;
  height: 100%;
  display: block; /* 去掉 img 默认 inline 间隙 */
  object-fit: cover;
  border-radius: 8px; /* 可以加圆角 */
}
.card-title {
  margin-top: 8px;
  font-size: 14px;
  color: #4d4d4d;
  text-align: center;
}

.play-icon {
  position: absolute;
  right: 8px;
  bottom: 8px;
  color: rgba(255, 255, 255, 0.8);
}
</style>
