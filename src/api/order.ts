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

export const getOrderNo = () => {
  return request.get({
    url: "api/order/latestOrderNo",
  });
};

// export const updateOrderStatusAndPaymentMethod = (
//   orderNo: string,
//   status: string,
//   paymentMethod: string
// ) => {
//   return request.put({
//     url: "api/order/updateOrderStatusAndPaymentMethod",
//     data: {
//       orderNo,
//       status,
//       paymentMethod,
//     },
//   });
// };
