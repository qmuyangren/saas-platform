/**
 * 本地存储工具
 */

const STORAGE_PREFIX = 'saas_';

/**
 * 设置 localStorage
 */
export const setLocal = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, serializedValue);
  } catch (error) {
    console.error('setLocal error:', error);
  }
};

/**
 * 获取 localStorage
 */
export const getLocal = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('getLocal error:', error);
    return null;
  }
};

/**
 * 删除 localStorage
 */
export const removeLocal = (key: string): void => {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch (error) {
    console.error('removeLocal error:', error);
  }
};

/**
 * 清空所有 localStorage
 */
export const clearLocal = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('clearLocal error:', error);
  }
};

/**
 * 设置 sessionStorage
 */
export const setSession = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, serializedValue);
  } catch (error) {
    console.error('setSession error:', error);
  }
};

/**
 * 获取 sessionStorage
 */
export const getSession = <T>(key: string): T | null => {
  try {
    const item = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('getSession error:', error);
    return null;
  }
};

/**
 * 删除 sessionStorage
 */
export const removeSession = (key: string): void => {
  try {
    sessionStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch (error) {
    console.error('removeSession error:', error);
  }
};
