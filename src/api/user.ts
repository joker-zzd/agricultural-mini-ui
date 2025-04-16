import request from "../utils/request";

export interface UserLoginDTO {
  username: string;
  password: string;
}

export interface UpdatePasswordDTO {
  oldPassword: string;
  newPassword: string;
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

export const updateNickname = (nickname: string) => {
  return request.put({
    url: `/api/user/updateNickname?nickname=${nickname}`,
  });
};

export const updateSex = (sex: string) => {
  return request.put({
    url: `/api/user/updateSex?sex=${sex}`,
  });
};

export const updateavatar = (avatar: string) => {
  return request.put({
    url: `/api/user/updateAvatar?avatar=${avatar}`,
  });
};

export const updatePassword = (data: UpdatePasswordDTO) => {
  return request.post({
    url: `/api/user/updatePassword`,
    data,
  });
};
