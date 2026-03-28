import * as bcrypt from 'bcrypt';

/**
 * 密码加密
 * @param password 明文密码
 * @param saltRounds 加密轮数 (默认 10)
 * @returns 加密后的密码
 */
export async function hashPassword(password: string, saltRounds: number = 10): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

/**
 * 验证密码
 * @param password 明文密码
 * @param hashedPassword 加密后的密码
 * @returns 是否匹配
 */
export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
