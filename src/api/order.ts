import request from "@/utils/request";

export interface CreateOrder {
  totalAmount: number;
  orderItems: {
    productId: number;
    quantity: number;
    price: number;
  }[];
}

export const orderStatusMap: Record<string, string> = {
  WAIT_PAYMENT: "待付款",
  WAIT_DELIVER: "待发货",
  WAIT_RECEIVE: "待收货",
  FINISHED: "已完成",
  CANCELED: "已取消",
};

export const createOrder = (data: CreateOrder) => {
  return request.post({
    url: "api/order/add",
    data,
  });
};

export const getOrderNo = () => {
  return request.get({
    url: "api/order/latestOrderNo",
  });
};

export const findByPage = (params: any) => {
  return request.get({
    url: "/api/order/pageByPage",
    params,
  });
};
