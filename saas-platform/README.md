# SaaS 平台项目

> 模块化 SaaS 平台，多前端 + 统一后端架构

**版本**: 1.0.0  
**创建时间**: 2026-03-28  
**仓库**: https://github.com/qmuyangren/saas-platform

---

## 项目简介

基于 NestJS + React 的模块化 SaaS 平台，采用 **多前端 + 统一后端** 架构：
- 统一认证中心 (SSO)
- 多租户架构
- 多业务前端 (电商/OA/CMS/党建/校园等)
- 统一后端服务 (NestJS)
- AI 能力集成
- MCP 工具提供

---

## 目录结构

```
saas-platform/                    # 一个 Git 仓库 ⭐
├── server/                       # 后端服务 (NestJS) ✅
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── prisma/
│   │   └── modules/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── README.md
│
├── admin-frontend/               # 后台管理前端 ✅
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── ecommerce-frontend/           # 电商前端 (后续)
├── oa-frontend/                  # OA 前端 (后续)
├── cms-frontend/                 # CMS 前端 (后续)
│
├── docs/                         # 项目文档
│   ├── 01-requirements/
│   ├── 02-technical/
│   ├── 03-guides/
│   └── 04-architecture/
│
└── README.md                     # 项目说明
```

---

## 技术栈

### 前端
- React 18 + TypeScript 5
- Vite 5
- Ant Design 6
- Zustand
- React Router 7

### 后端
- NestJS 11
- TypeScript 5
- Prisma 5
- MySQL 5.7/8.0
- Passport + JWT
- Swagger

---

## 快速开始

### 后端服务

```bash
cd server
pnpm install
cp .env.example .env
pnpm prisma:generate
pnpm run start:dev

# http://localhost:3000
# http://localhost:3000/api/docs
```

### 后台管理前端

```bash
cd admin-frontend
pnpm install
pnpm run dev

# http://localhost:5173
```

---

## 项目状态

| 项目 | 状态 | 说明 |
|------|------|------|
| server | ✅ 完成 | NestJS 后端服务 |
| admin-frontend | ✅ 完成 | 后台管理前端 |
| ecommerce-frontend | ⏳ 计划中 | 电商前端 |
| oa-frontend | ⏳ 计划中 | OA 前端 |
| cms-frontend | ⏳ 计划中 | CMS 前端 |

---

## API 文档

- **Swagger**: http://localhost:3000/api/docs
- **健康检查**: GET /api/v1/health
- **登录**: POST /api/v1/auth/login
- **用户管理**: /api/v1/users
- **角色管理**: /api/v1/roles
- **字典管理**: /api/v1/dicts
- **日志管理**: /api/v1/logs
- **公告管理**: /api/v1/announcements

---

## 开发进度

### 第一阶段：后台管理 (进行中)
- [x] 需求分析
- [x] 数据库设计
- [x] API 规范设计
- [x] NestJS 项目创建
- [x] 认证模块实现
- [x] 用户模块实现
- [x] 角色/字典/日志/公告模块框架
- [ ] 前后端联调
- [ ] 测试验证

### 第二阶段：业务系统 (计划中)
- [ ] 电商系统
- [ ] OA 系统
- [ ] CMS 系统
- [ ] 党建系统
- [ ] 校园系统

---

## 文档

- [需求文档](docs/01-requirements/)
- [技术文档](docs/02-technical/)
- [使用指南](docs/03-guides/)
- [架构设计](docs/04-architecture/)

---

## Git 规范

### 分支策略
- `main` - 生产环境
- `develop` - 开发分支
- `feature/*` - 功能分支
- `fix/*` - 修复分支
- `release/*` - 发布分支

### 提交规范
```bash
feat(server): 实现 JWT 认证
fix(admin): 修复登录跳转问题
docs(readme): 更新项目说明
refactor(server): 重构用户服务
test(auth): 添加认证测试
```

---

## 许可证

MIT

---

**维护者**: 小虾米  
**创建时间**: 2026-03-28  
**最后更新**: 2026-03-28
