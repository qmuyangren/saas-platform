/**
 * 验证工具
 */

/**
 * 验证邮箱
 */
export const isEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * 验证手机号 (中国大陆)
 */
export const isPhone = (phone: string): boolean => {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phone);
};

/**
 * 验证 URL
 */
export const isUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 验证身份证 (中国大陆)
 */
export const isIdCard = (idCard: string): boolean => {
  const regex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return regex.test(idCard);
};

/**
 * 验证密码强度
 */
export const validatePassword = (password: string): {
  valid: boolean;
  message: string;
} => {
  if (password.length < 6) {
    return { valid: false, message: '密码长度至少 6 位' };
  }
  if (password.length > 20) {
    return { valid: false, message: '密码长度不能超过 20 位' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: '密码必须包含小写字母' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: '密码必须包含大写字母' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: '密码必须包含数字' };
  }
  return { valid: true, message: '密码强度足够' };
};

/**
 * 验证用户名
 */
export const validateUsername = (username: string): {
  valid: boolean;
  message: string;
} => {
  if (username.length < 3) {
    return { valid: false, message: '用户名长度至少 3 位' };
  }
  if (username.length > 20) {
    return { valid: false, message: '用户名长度不能超过 20 位' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, message: '用户名只能包含字母、数字和下划线' };
  }
  return { valid: true, message: '用户名可用' };
};

/**
 * 验证是否为空
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === 'string') {
    return value.trim() === '';
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  return false;
};

/**
 * 验证长度范围
 */
export const validateLength = (
  value: string,
  min: number,
  max: number
): { valid: boolean; message: string } => {
  const length = value.length;
  if (length < min) {
    return { valid: false, message: `长度至少${min}位` };
  }
  if (length > max) {
    return { valid: false, message: `长度不能超过${max}位` };
  }
  return { valid: true, message: '长度符合要求' };
};
