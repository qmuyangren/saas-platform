/**
 * 认证工具
 */

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_INFO_KEY = 'user_info';

/**
 * 设置 Token
 */
export const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('setToken error:', error);
  }
};

/**
 * 获取 Token
 */
export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('getToken error:', error);
    return null;
  }
};

/**
 * 删除 Token
 */
export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
  } catch (error) {
    console.error('removeToken error:', error);
  }
};

/**
 * 设置 Refresh Token
 */
export const setRefreshToken = (token: string): void => {
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error('setRefreshToken error:', error);
  }
};

/**
 * 获取 Refresh Token
 */
export const getRefreshToken = (): string | null => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('getRefreshToken error:', error);
    return null;
  }
};

/**
 * 设置用户信息
 */
export const setUserInfo = (userInfo: any): void => {
  try {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  } catch (error) {
    console.error('setUserInfo error:', error);
  }
};

/**
 * 获取用户信息
 */
export const getUserInfo = (): any => {
  try {
    const item = localStorage.getItem(USER_INFO_KEY);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('getUserInfo error:', error);
    return null;
  }
};

/**
 * 检查是否已登录
 */
export const isLoggedIn = (): boolean => {
  const token = getToken();
  return !!token;
};

/**
 * 退出登录
 */
export const logout = (): void => {
  removeToken();
  window.location.href = '/login';
};
