import request from "../utils/request";

export interface SearchParams {
  currentPage: number;
  pageSize: number;
  name?: string;
  description?: string;
  price: string;
  min?: string;
  max?: string;
}

export interface SearchParamsById {
  currentPage: number;
  pageSize: number;
  name?: string;
  description?: string;
  categoryId: number;
  price: string;
  min?: string;
  max?: string;
}

export const categoriesList = () => {
  return request.get({
    url: "/api/categories/list",
  });
};

export const findByPage = (params: SearchParams) => {
  return request.get({
    url: "/api/product/findByPage",
    params,
  });
};

export const findByPageAndCategoryId = (params: SearchParams) => {
  return request.get({
    url: "/api/product/findByPageAndCategoryId",
    params,
  });
};

export const updateBySold = (id: number, quantity: number) => {
  return request.put({
    url: `/api/product/updateBySold?id=${id}&quantity=${quantity}`,
  });
};
