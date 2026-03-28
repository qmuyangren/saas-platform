import request from './request';

export interface LoginCredentials {
  username: string;
  password: string;
  captcha?: string;
  captchaId?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  mustChangePassword: boolean;
}

export interface SystemConfig {
  systemName: string;
  systemLogo: string;
  loginConfig: {
    captchaEnabled: boolean;
    thirdPartyLogin: boolean;
  };
  securityPolicy: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
    };
  };
}

// 获取系统配置
export const getSystemConfig = () => {
  return request.get<SystemConfig>('/system/config');
};

// 获取验证码
export const getCaptcha = () => {
  return request.get<{ captchaId: string; captchaImage: string }>('/auth/captcha');
};

// 登录
export const login = (data: LoginCredentials) => {
  return request.post<LoginResponse>('/auth/login', data);
};

// 获取用户信息
export const getUserInfo = () => {
  return request.get<UserInfo>('/users/me');
};

// 修改密码
export const changePassword = (data: { oldPassword: string; newPassword: string }) => {
  return request.put('/users/me/password', data);
};

// 登出
export const logout = () => {
  return request.post('/auth/logout');
};
