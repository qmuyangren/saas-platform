import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 获取当前登录用户信息
 * @example
 * @Get('profile')
 * getProfile(@CurrentUser() user: any) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
