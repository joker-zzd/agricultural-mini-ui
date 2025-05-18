import request from "@/utils/request";

export interface CreateOrder {
  totalAmount: number;
  orderItems: {
    productId: number;
    quantity: number;
    price: number;
  }[];
}

export const createOrder = (data: CreateOrder) => {
  return request.post({
    url: "api/order/add",
    data,
  });
};
