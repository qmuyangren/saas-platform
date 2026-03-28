# SaaS 平台

> 模块化 SaaS 平台，支持多业务系统

**版本**: 1.0.0  
**创建时间**: 2026-03-28  
**仓库**: https://github.com/qmuyangren/saas-platform

---

## 项目简介

基于 Node.js + React 的模块化 SaaS 平台，支持：
- 统一认证中心 (SSO)
- 多租户架构
- 多业务系统 (电商/OA/CMS/党建/校园等)
- AI 能力集成
- MCP 工具提供

---

## 技术栈

### 前端
- React 18 + TypeScript 5
- Vite 5
- shadcn/ui + Ant Design 5
- Zustand (状态管理)
- React Router 6

### 后端
- Fastify 4 / NestJS 10
- Node.js 20 + TypeScript 5
- Prisma 5 (ORM)
- MySQL 8.0
- Redis 7

### 移动端
- uni-app 3 + Vue 3

---

## 项目结构

```
/workspace/
├── apps/                    # 应用代码
│   ├── admin/              # 后台管理系统 ⭐
│   ├── ecommerce/          # 电商系统 (后续)
│   ├── oa/                 # OA 系统 (后续)
│   └── cms/                # CMS 系统 (后续)
│
├── packages/                # 共享包
│   ├── ui/                 # UI 组件库
│   ├── utils/              # 工具函数
│   └── types/              # 类型定义
│
├── backend/                 # 后端代码
│   ├── admin-api/          # 后台管理 API ⭐
│   └── ecommerce-api/      # 电商 API (后续)
│
├── docs/                    # 所有文档
├── types/                   # 全局类型定义
└── scripts/                 # 脚本工具
```

---

## 快速开始

### 环境要求
- Node.js >= 20
- pnpm >= 8
- MySQL >= 8.0
- Redis >= 7

### 安装依赖
```bash
# 安装 pnpm
npm install -g pnpm

# 安装所有依赖
pnpm install
```

### 开发模式
```bash
# 启动后台管理前端
cd apps/admin
pnpm dev

# 启动后端 API
cd backend/admin-api
pnpm dev
```

### 构建
```bash
# 构建所有项目
pnpm build

# 构建单个项目
cd apps/admin
pnpm build
```

---

## 开发进度

### 第一阶段：后台管理 (进行中)
- [x] 需求分析
- [x] 数据库设计
- [x] API 规范设计
- [ ] 架构设计
- [ ] 后端开发
- [ ] 前端开发
- [ ] 测试验证

### 第二阶段：业务系统 (计划中)
- [ ] 电商系统
- [ ] OA 系统
- [ ] CMS 系统
- [ ] 党建系统
- [ ] 校园系统

---

## 文档

- [需求文档](docs/requirements/)
- [技术规范](docs/technical/)
- [使用指南](docs/guides/)

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
feat(admin): 实现后台登录功能
fix(auth): 修复 Token 刷新问题
docs(readme): 更新项目说明
refactor(api): 重构 API 调用层
test(login): 添加登录测试用例
```

---

## 核心功能

### 认证授权
- 账号密码登录
- 手机/邮箱验证码登录
- 第三方登录 (微信/钉钉/GitHub)
- 自动注册
- 强制改密
- IP 黑名单
- 用户状态管理 (启用/禁用/锁定)

### 用户管理
- 用户 CRUD
- 角色权限
- 批量操作
- 导入导出

### 系统配置
- 系统基本信息
- 短信/邮箱配置
- 存储配置
- 字典管理
- 通知公告

---

## 许可证

MIT

---

**维护者**: 小虾米  
**创建时间**: 2026-03-28
