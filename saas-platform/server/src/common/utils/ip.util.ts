import { Request } from 'express';

/**
 * 获取客户端 IP 地址
 * @param request Express 请求对象
 * @returns IP 地址
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers['x-forwarded-for'];

  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }

  return request.ip || request.socket.remoteAddress || 'unknown';
}

/**
 * 获取 IP 所在城市 (需要集成 IP 定位服务)
 * @param ip IP 地址
 * @returns 城市名称
 */
export async function getIpLocation(ip: string): Promise<string> {
  // TODO: 集成 IP 定位服务 (如：淘宝 IP 库、高德 IP 定位)
  // 这里暂时返回未知
  return '未知';
}
