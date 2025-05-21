import { url } from "inspector";
import request from "../utils/request";

export const findById = (id: number) => {
  return request.get({
    url: "/api/product/findById",
    params: { id },
  });
};

export interface AddCaerDTO {
  productId: number;
  skuId: number;
  quantity: number;
  name: string;
  description: string;
  image: string;
}

export const addCart = (data: AddCaerDTO) => {
  return request.post({
    url: "api/cart/add",
    data,
  });
};
