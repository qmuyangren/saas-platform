import { Controller, Post, Get, Put, Body, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService, LoginDto } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth', '认证授权')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 401, description: '认证失败' })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return result;
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getMe(@CurrentUser() user: any) {
    const userInfo = await this.authService.getUserInfo(user.sub);
    return userInfo;
  }

  @Put('me/password')
  @ApiBearerAuth()
  @ApiOperation({ summary: '修改密码' })
  @ApiResponse({ status: 200, description: '修改成功' })
  async changePassword(@CurrentUser() user: any, @Body() body: { oldPassword: string; newPassword: string }) {
    const result = await this.authService.changePassword(
      user.sub,
      body.oldPassword,
      body.newPassword,
    );
    return result;
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: '用户登出' })
  @ApiResponse({ status: 200, description: '登出成功' })
  async logout() {
    // TODO: 实现登出逻辑（使 token 失效）
    return {
      success: true,
      code: 'LOGOUT_SUCCESS',
      message: '登出成功',
      data: null,
    };
  }
}
