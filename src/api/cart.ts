import request from "../utils/request";

export interface SearchParams {
  currentPage: number;
  pageSize: number;
}

export const findByPage = (params: SearchParams) => {
  return request.get({
    url: "/api/cart/findByPage",
    params,
  });
};

export function deleteAllById(ids: number[]) {
  return request.delete({
    url: "/api/cart/delete",
    data: ids,
  });
}
