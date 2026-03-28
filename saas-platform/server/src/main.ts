import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 获取配置
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3000);
  const swaggerEnabled = configService.get('SWAGGER_ENABLED', true);
  const swaggerPath = configService.get('SWAGGER_PATH', '/api/docs');

  // 全局配置
  app.setGlobalPrefix('api/v1');



  // 启用 CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Swagger 文档
  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('SaaS 平台 API')
      .setDescription('SaaS 平台统一后端服务 API 文档')
      .setVersion('1.0.0')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      })
      .addTag('auth', '认证授权')
      .addTag('users', '用户管理')
      .addTag('roles', '角色管理')
      .addTag('dicts', '字典管理')
      .addTag('logs', '系统日志')
      .addTag('announcements', '公告管理')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerPath, app, document);
  }

  await app.listen(port);
  
  console.log(`
  ╔════════════════════════════════════════════════════════╗
  ║                                                        ║
  ║   🚀 SaaS Platform API Server                          ║
  ║                                                        ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}                            ║
  ║   Port: ${port}                                        ║
  ║   API Prefix: /api/v1                                  ║
  ║   Swagger: http://localhost:${port}${swaggerPath}                  ║
  ║                                                        ║
  ║   Database: MySQL 5.7 (Remote)                         ║
  ║   Host: 8.148.22.71                                    ║
  ║   Database: practice06                                 ║
  ║                                                        ║
  ╚════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
