import request from "@/utils/request";

export interface PayParams {
  orderNo: string;
  totalAmount: number;
  subject: string;
}

//支付
export const pay = (data: PayParams) => {
  return request.post({
    url: `/api/alipay/pay`,
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
