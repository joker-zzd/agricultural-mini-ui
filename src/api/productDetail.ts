import request from "../utils/request";

export const findById = (id: number) => {
  return request.get({
    url: "/api/product/findById",
    params: { id },
  });
};
