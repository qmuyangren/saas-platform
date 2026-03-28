import request from './request';

export interface UserInfo {
  id: string;
  account: string;
  realName?: string;
  nickName?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  role?: string;
  permissions?: string[];
}

export interface UserListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export interface UserListResponse {
  list: UserInfo[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// 获取当前用户信息
export const getCurrentUser = () => request.get<UserInfo>('/auth/me');

// 获取用户列表
export const getUserList = (params: UserListParams) =>
  request.get<UserListResponse>('/users', { params });

// 获取用户详情
export const getUserDetail = (id: string) => request.get<UserInfo>(`/users/${id}`);

// 创建用户
export const createUser = (data: Partial<UserInfo>) => request.post<UserInfo>('/users', data);

// 更新用户
export const updateUser = (id: string, data: Partial<UserInfo>) =>
  request.put<UserInfo>(`/users/${id}`, data);

// 删除用户
export const deleteUser = (id: string) => request.del(`/users/${id}`);
