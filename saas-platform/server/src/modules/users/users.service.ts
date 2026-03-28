import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, pageSize: number = 20, keyword?: string) {
    const where = keyword
      ? {
          OR: [
            { account: { contains: keyword } },
          ],
        }
      : {};

    const [total, users] = await Promise.all([
      this.prisma.baseUser.count({ where }),
      this.prisma.baseUser.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      list: users.map((user) => {
        const { password, ...userInfo } = user;
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

  async findOne(id: string) {
    const user = await this.prisma.baseUser.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const { password, ...userInfo } = user;
    return userInfo;
  }

  async create(data: any) {
    const existing = await this.prisma.baseUser.findFirst({
      where: { account: data.account },
    });

    if (existing) {
      throw new BadRequestException('账户已存在');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.baseUser.create({
      data: {
        account: data.account,
        password: hashedPassword,
      },
    });

    const { password, ...userInfo } = user;
    return userInfo;
  }

  async update(id: string, data: any) {
    const user = await this.prisma.baseUser.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await this.prisma.baseUser.update({
      where: { id },
      data,
    });

    const { password, ...userInfo } = updated;
    return userInfo;
  }

  async remove(id: string) {
    const user = await this.prisma.baseUser.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    await this.prisma.baseUser.delete({
      where: { id },
    });

    return { message: '删除成功' };
  }
}
