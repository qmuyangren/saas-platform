// SaaS 平台共享类型定义

// ==================== API 响应类型 ====================

// 基础响应结构
export interface ApiResponse<T = any> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  timestamp: number;
  traceId: string;
}

// 成功响应
export interface SuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
  code: 'SUCCESS' | string;
}

// 错误响应
export interface ErrorResponse extends ApiResponse<null> {
  success: false;
  code: string;
  details?: {
    field: string;
    reason: string;
  };
}

// 分页参数
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// 分页响应
export interface PaginatedResponse<T = any> extends SuccessResponse<{
  list: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}> {}

// ==================== 用户类型 ====================

// 用户状态
export type UserStatus = 'ACTIVE' | 'DISABLED' | 'LOCKED';

// 用户角色
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR' | 'AUDITOR' | 'USER';

// 用户信息
export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  nickname?: string;
  role: UserRole;
  status: UserStatus;
  permissions: string[];
  isFirstLogin: boolean;
  mustChangePassword: boolean;
  lastLoginAt?: string;
  lastLoginIp?: string;
  createdAt: string;
  updatedAt: string;
}

// 创建用户
export interface CreateUserInput {
  username: string;
  email: string;
  phone?: string;
  password: string;
  role?: UserRole;
}

// 更新用户
export interface UpdateUserInput {
  username?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  nickname?: string;
  role?: UserRole;
  status?: UserStatus;
}

// ==================== 认证类型 ====================

// 登录请求
export interface LoginCredentials {
  username: string;
  password: string;
  captcha?: string;
  captchaId?: string;
}

// 登录响应
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

// 修改密码
export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

// 验证码
export interface CaptchaResponse {
  captchaId: string;
  captchaImage: string;
  expiresIn: number;
}

// ==================== 系统配置类型 ====================

// 系统配置
export interface SystemConfig {
  systemName: string;
  systemLogo: string;
  systemFavicon: string;
  loginConfig: {
    captchaEnabled: boolean;
    thirdPartyLogin: boolean;
    allowedLoginMethods: string[];
  };
  securityPolicy: {
    passwordPolicy: {
      minLength: number;
      maxLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecial: boolean;
    };
    lockoutPolicy: {
      maxFailedAttempts: number;
      lockoutDuration: number;
    };
  };
}

// ==================== 字典类型 ====================

// 字典类型
export interface DictType {
  id: string;
  name: string;
  code: string;
  description?: string;
  enabled: boolean;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

// 字典项
export interface DictItem {
  id: string;
  typeId: string;
  label: string;
  value: string;
  code?: string;
  sortOrder: number;
  color?: string;
  icon?: string;
  enabled: boolean;
  extra?: any;
}

// ==================== 通知公告类型 ====================

// 公告类型
export type AnnouncementType = 'notice' | 'announcement' | 'activity' | 'system';

// 公告优先级
export type AnnouncementPriority = 'low' | 'normal' | 'high' | 'urgent';

// 公告状态
export type AnnouncementStatus = 'draft' | 'published' | 'archived';

// 公告
export interface Announcement {
  id: string;
  title: string;
  content: string;
  summary?: string;
  type: AnnouncementType;
  category?: string;
  scope: 'all' | 'public' | 'internal' | 'specific';
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  publishedBy?: string;
  publishedAt?: string;
  startTime?: string;
  endTime?: string;
  isTop: boolean;
  topUntil?: string;
  viewCount: number;
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
