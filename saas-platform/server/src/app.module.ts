import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { DictsModule } from './modules/dicts/dicts.module';
import { LogsModule } from './modules/logs/logs.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 公共模块 (全局)
    CommonModule,

    // 数据库模块
    PrismaModule,

    // 业务模块
    AuthModule,
    UsersModule,
    RolesModule,
    DictsModule,
    LogsModule,
    AnnouncementsModule,
  ],
})
export class AppModule {}
