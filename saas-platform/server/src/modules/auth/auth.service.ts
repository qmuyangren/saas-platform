import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export interface LoginDto {
  account: string;
  password: string;
}

export interface AuthVo {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * 用户登录
   */
  async login(loginDto: LoginDto): Promise<AuthVo> {
    const { account, password } = loginDto;

    // 1. 查询用户（支持账户/手机/邮箱登录）
    const user = await this.findUserByAccount(account);

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    // 2. 检查用户状态
    if (user.enabledMark === 0) {
      throw new UnauthorizedException('账号已被禁用，请联系管理员');
    }

    // 3. 检查是否锁定
    if (user.lockMark === 1) {
      if (user.unlockTime && user.unlockTime > new Date()) {
        throw new UnauthorizedException(
          `账号已锁定，请在 ${user.unlockTime.toLocaleString('zh-CN')} 后重试`,
        );
      } else {
        // 锁已过期，自动解锁
        await this.prisma.baseUser.update({
          where: { id: user.id },
          data: { lockMark: 0, unlockTime: null },
        });
      }
    }

    // 4. 验证密码
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      // 增加失败次数
      const logErrorCount = (user.logErrorCount || 0) + 1;
      if (logErrorCount >= 5) {
        // 锁定账号 15 分钟
        const unlockTime = new Date(Date.now() + 15 * 60 * 1000);
        await this.prisma.baseUser.update({
          where: { id: user.id },
          data: {
            lockMark: 1,
            unlockTime,
            logErrorCount,
          },
        });
        throw new UnauthorizedException('密码错误次数过多，账号已锁定 15 分钟');
      }

      await this.prisma.baseUser.update({
        where: { id: user.id },
        data: { logErrorCount },
      });

      throw new UnauthorizedException('密码错误');
    }

    // 5. 重置失败次数，更新登录信息
    await this.prisma.baseUser.update({
      where: { id: user.id },
      data: {
        logErrorCount: 0,
        logSuccessCount: (user.logSuccessCount || 0) + 1,
        lastLogTime: new Date(),
        lastLogIp: '', // TODO: 从请求中获取
      },
    });

    // 6. 生成 Token
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    // 7. 保存 Session
    await this.prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 7200,
    };
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(userId: string) {
    const user = await this.prisma.baseUser.findUnique({
      where: { id: userId },
      include: {
        relations: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    // 移除敏感字段
    const { password, secretkey, ...userInfo } = user;

    return {
      id: userInfo.id,
      account: userInfo.account,
      realName: userInfo.realName,
      nickName: userInfo.nickName,
      headIcon: userInfo.headIcon,
      gender: userInfo.gender,
      mobilePhone: userInfo.mobilePhone,
      email: userInfo.email,
      isAdministrator: userInfo.isAdministrator,
      organizeId: userInfo.organizeId,
      positionId: userInfo.positionId,
      roleId: userInfo.roleId,
      enabledMark: userInfo.enabledMark,
    };
  }

  /**
   * 修改密码
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.baseUser.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    // 验证旧密码
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      throw new BadRequestException('原密码错误');
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await this.prisma.baseUser.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        changePasswordDate: new Date(),
      },
    });

    // 使所有 Session 失效
    await this.prisma.session.deleteMany({
      where: { userId },
    });

    return { message: '密码修改成功，请重新登录' };
  }

  /**
   * 查询用户（支持账户/手机/邮箱）
   */
  private async findUserByAccount(account: string) {
    // 判断是手机还是邮箱
    const isPhone = /^1[3-9]\d{9}$/.test(account);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account);

    if (isPhone) {
      return this.prisma.baseUser.findFirst({
        where: { mobilePhone: account },
      });
    }

    if (isEmail) {
      return this.prisma.baseUser.findFirst({
        where: { email: account },
      });
    }

    return this.prisma.baseUser.findFirst({
      where: { account: account },
    });
  }

  /**
   * 生成 Access Token
   */
  private async generateAccessToken(user: any): Promise<string> {
    const payload = {
      sub: user.id,
      account: user.account,
      isAdministrator: user.isAdministrator,
    };

    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRATION', '2h'),
    });
  }

  /**
   * 生成 Refresh Token
   */
  private async generateRefreshToken(user: any): Promise<string> {
    const payload = {
      sub: user.id,
      type: 'refresh',
    };

    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
    });
  }
}
