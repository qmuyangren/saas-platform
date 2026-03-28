import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

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

  async login(loginDto: LoginDto): Promise<AuthVo> {
    const { account, password } = loginDto;

    // 查询用户
    const user = await this.prisma.baseUser.findFirst({
      where: { account },
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    // 验证密码
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('密码错误');
    }

    // 生成 Token
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    // 保存 Session
    await this.prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken: refreshToken,
      },
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 7200,
    };
  }

  async getUserInfo(userId: string) {
    const user = await this.prisma.baseUser.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    const { password, ...userInfo } = user;
    return userInfo;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.baseUser.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      throw new Error('原密码错误');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.baseUser.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // 使所有 Session 失效
    await this.prisma.session.deleteMany({
      where: { userId },
    });

    return { message: '密码修改成功，请重新登录' };
  }

  private async generateAccessToken(user: any): Promise<string> {
    const payload = {
      sub: user.id,
      account: user.account,
    };

    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRATION', '2h'),
    });
  }

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
