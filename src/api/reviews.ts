import request from "../utils/request";

export const findByPageAndProductId = (productId: number) => {
  return request.get({
    url: "/api/reviews/findByPageAndProductId",
    params: { productId },
  });
};
