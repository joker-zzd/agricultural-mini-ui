import request from "@/utils/request";

//支付
export const pay = (id: number) => {
  return request.get({
    url: `/api/alipay/pay?id=${id}`,
  });
};
