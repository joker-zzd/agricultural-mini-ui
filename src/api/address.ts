import request from "../utils/request";

export interface SearchParams {
  currentPage: number;
  pageSize: number;
}

export interface AddAddressDTO {
  name: string;
  tel: string;
  province: string;
  city: string;
  county: string;
  addressDetail: string;
  defaulted: boolean;
}

export const findByPage = (params: SearchParams) => {
  return request.get({
    url: "/api/address/findByPage",
    params,
  });
};

export const addAddress = (data: AddAddressDTO) => {
  return request.post({
    url: "api/address/add",
    data,
  });
};

export function deleteAllById(ids: number[]) {
  return request.delete({
    url: "/api/address/delete",
    data: ids,
  });
}

export const updateDefaulted = (id: number) => {
  return request.put({
    url: `/api/address/delete?id=${id}`,
  });
};
