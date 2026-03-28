import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取用户列表
   */
  async findAll(page: number = 1, pageSize: number = 20, keyword?: string) {
    const where = keyword
      ? {
          OR: [
            { account: { contains: keyword } },
            { realName: { contains: keyword } },
            { mobilePhone: { contains: keyword } },
            { email: { contains: keyword } },
          ],
        }
      : {};

    const [total, users] = await Promise.all([
      this.prisma.baseUser.count({ where }),
      this.prisma.baseUser.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { sortCode: 'asc' },
      }),
    ]);

    return {
      list: users.map((user) => {
        const { password, secretkey, ...userInfo } = user;
        return userInfo;
      }),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * 获取用户详情
   */
  async findOne(id: string) {
    const user = await this.prisma.baseUser.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const { password, secretkey, ...userInfo } = user;
    return userInfo;
  }

  /**
   * 创建用户
   */
  async create(data: any) {
    // 检查账户是否已存在
    const existing = await this.prisma.baseUser.findFirst({
      where: { account: data.account },
    });

    if (existing) {
      throw new BadRequestException('账户已存在');
    }

    // TODO: 密码加密

    const user = await this.prisma.baseUser.create({
      data,
    });

    const { password, secretkey, ...userInfo } = user;
    return userInfo;
  }

  /**
   * 更新用户
   */
  async update(id: string, data: any) {
    const user = await this.prisma.baseUser.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const updated = await this.prisma.baseUser.update({
      where: { id },
      data,
    });

    const { password, secretkey, ...userInfo } = updated;
    return userInfo;
  }

  /**
   * 删除用户（软删除）
   */
  async remove(id: string, userId: string) {
    const user = await this.prisma.baseUser.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    await this.prisma.baseUser.update({
      where: { id },
      data: {
        deleteMark: 1,
        deleteTime: new Date(),
        deleteUserId: userId,
      },
    });

    return { message: '删除成功' };
  }
}
