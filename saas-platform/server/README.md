# SaaS 平台后端服务 (NestJS)

> 基于 NestJS 的统一后端服务

**版本**: 1.0.0  
**技术栈**: NestJS 11 + TypeScript + Prisma + MySQL

---

## 项目简介

基于 NestJS 的 SaaS 平台统一后端服务，支持：
- 统一认证中心 (SSO)
- 多租户架构
- 多业务系统 API (电商/OA/CMS/党建/校园等)
- AI 能力集成
- MCP 工具提供

---

## 目录结构

```
server/
├── src/
│   ├── main.ts                    # 入口文件
│   ├── app.module.ts              # 根模块
│   │
│   ├── prisma/                    # Prisma 模块
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── modules/                   # 业务模块
│   │   ├── auth/                  # 认证模块
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── guards/
│   │   │   └── strategies/
│   │   ├── users/                 # 用户模块
│   │   ├── roles/                 # 角色模块
│   │   ├── dicts/                 # 字典模块
│   │   ├── logs/                  # 日志模块
│   │   └── announcements/         # 公告模块
│   │
│   └── common/                    # 公共模块 (待创建)
│       ├── filters/
│       ├── guards/
│       ├── interceptors/
│       └── pipes/
│
├── prisma/
│   └── schema.prisma              # 数据库模型
│
├── test/                          # 测试
├── nest-cli.json                  # NestJS 配置
├── package.json
├── tsconfig.json
└── README.md
```

---

## 快速开始

### 环境要求

- Node.js >= 20
- pnpm >= 8
- MySQL >= 5.7

### 安装依赖

```bash
cd server
pnpm install
```

### 配置环境变量

```bash
# 复制环境变量文件
cp .env.example .env

# 编辑 .env 文件，配置数据库连接
DATABASE_URL="mysql://root:password@host:3306/database"
```

### 生成 Prisma Client

```bash
pnpm prisma:generate
```

### 启动开发服务器

```bash
pnpm run start:dev

# 访问 http://localhost:3000
# API 文档 http://localhost:3000/api/docs
```

### 构建生产版本

```bash
pnpm run build
pnpm run start:prod
```

---

## API 文档

### 认证接口

- `POST /api/v1/auth/login` - 用户登录
- `GET /api/v1/auth/me` - 获取当前用户信息
- `PUT /api/v1/auth/me/password` - 修改密码
- `POST /api/v1/auth/logout` - 用户登出

### 用户接口

- `GET /api/v1/users` - 获取用户列表
- `GET /api/v1/users/:id` - 获取用户详情
- `POST /api/v1/users` - 创建用户
- `PUT /api/v1/users/:id` - 更新用户
- `DELETE /api/v1/users/:id` - 删除用户

### 其他接口

- 角色管理：`/api/v1/roles`
- 字典管理：`/api/v1/dicts`
- 公告管理：`/api/v1/announcements`
- 系统日志：`/api/v1/logs`

### Swagger 文档

访问 http://localhost:3000/api/docs 查看完整 API 文档

---

## 数据库设计

### 核心表 (11 张)

- `BaseUser` - 用户表
- `BaseUserDevice` - 用户设备表
- `BaseUserExtra` - 用户额外信息表
- `BaseUserOldPassword` - 旧密码记录表
- `BaseUserRelation` - 用户关系表
- `BaseRole` - 角色表
- `Session` - Session 表
- `BaseSysLog` - 系统日志表
- `BaseDictType` - 字典类型表
- `BaseDictItem` - 字典项表
- `BaseAnnouncement` - 公告表

---

## 技术栈

### 核心框架

- NestJS 11
- TypeScript 5
- Express (可切换 Fastify)

### 数据库

- Prisma 5 (ORM)
- MySQL 5.7/8.0

### 认证授权

- Passport
- JWT
- bcrypt

### API 文档

- Swagger/OpenAPI

### 工具库

- class-validator
- class-transformer
- reflect-metadata

---

## 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- 遵循 NestJS 最佳实践
- 使用 ESLint + Prettier

### Git 提交

```bash
feat(auth): 实现 JWT 认证
fix(users): 修复用户列表分页问题
docs(readme): 更新 API 文档
refactor(users): 重构用户服务
test(auth): 添加认证测试
```

### 模块结构

```
模块名/
├── 模块名.controller.ts    # 控制器 (路由)
├── 模块名.service.ts       # 服务 (业务逻辑)
├── 模块名.module.ts        # 模块定义
├── dto/                    # 数据传输对象
├── entities/               # 实体
├── guards/                 # 守卫
└── strategies/             # Passport 策略
```

---

## 部署

### Docker 部署

```bash
# 构建镜像
docker build -t saas-server .

# 运行容器
docker run -d -p 3000:3000 --env-file .env saas-server
```

### PM2 部署

```bash
# 安装 PM2
npm i -g pm2

# 启动
pm2 start dist/main.js --name saas-server

# 查看状态
pm2 status
```

---

## 许可证

MIT

---

**维护者**: 小虾米  
**创建时间**: 2026-03-28  
**最后更新**: 2026-03-28
