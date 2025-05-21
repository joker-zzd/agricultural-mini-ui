import request from "../utils/request";

export interface AddReview {
  productId: number;
  comment: string;
  rating: number;
  orderId: number;
}

export const findByPageAndProductId = (productId: number) => {
  return request.get({
    url: "/api/reviews/findByPageAndProductId",
    params: { productId },
  });
};

export const addReview = (data: AddReview) => {
  return request.post({
    url: "/api/reviews/add",
    data,
  });
};
