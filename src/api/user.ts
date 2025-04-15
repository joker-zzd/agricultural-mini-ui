import request from "../utils/request";

export interface UserLoginDTO {
  username: string;
  password: string;
}

export interface LoginResponse {
  code?: number;
  message: string;
  data: {
    code: number;
    token: string;
    user: {
      id: number;
      username: string;
      password: string;
      nickname: string;
      telephone: string;
      headPortrait: string;
    };
  };
}

// 用户登录
export const login = (data: UserLoginDTO) => {
  return request.post<LoginResponse>({
    url: "/api/user/login",
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
