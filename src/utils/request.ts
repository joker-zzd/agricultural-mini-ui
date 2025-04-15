import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { showToast } from "vant";

const service = axios.create({
  // TODO
  baseURL: "http://127.0.0.1:8082/mini",
  timeout: 10000,
  withCredentials: true,
});

//请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = token; // 使用 token 设置请求头
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    showToast(error.message || "服务器错误");
    return Promise.reject(error);
  }
);

// 封装请求方法（支持泛型）
const request = {
  get<T = any>({
    url,
    params,
    config,
  }: {
    url: string;
    params?: any;
    config?: AxiosRequestConfig;
    headers?: any;
  }) {
    return service.get<any, T>(url, { params, ...config });
  },

  post<T = any>({
    url,
    data,
    config,
  }: {
    url: string;
    data?: any;
    config?: AxiosRequestConfig;
    headers?: any;
  }) {
    return service.post<any, T>(url, data, config);
  },

  put<T = any>({
    url,
    data,
    config,
  }: {
    url: string;
    data?: any;
    config?: AxiosRequestConfig;
    headers?: any;
  }) {
    return service.put<any, T>(url, data, config);
  },

  delete<T = any>({
    url,
    data,
    config,
  }: {
    url: string;
    data?: any;
    config?: AxiosRequestConfig;
    headers?: any;
  }) {
    return service.delete<any, T>(url, { data, ...config });
  },

  postForm<T = any>({
    url,
    data,
    config,
  }: {
    url: string;
    data: Record<string, any>;
    config?: AxiosRequestConfig;
  }) {
    const formData = new FormData();
    for (const key in data) {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    }

    return service.post<any, T>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...config,
    });
  },
};

export default request;
