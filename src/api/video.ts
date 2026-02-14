import request from "../utils/request";

export interface SearchParams {
  currentPage: number;
  pageSize: number;
}

export interface Video {
  id: number;
  title: string;
  description: string;
  coverImageUrl: string;
}

export const listOnlineVideos = (params: SearchParams) => {
  return request.get({
    url: "/api/video/listOnlineVideos",
    params
  })
}

export const findById = (id: number) => {
  return request.get({
    url: `/api/video/findById/${id}`
  })
}