# SaaS 平台后台管理系统

> 基于 React 18 + TypeScript + Ant Design 6

## 技术栈

- React 18
- TypeScript 5
- Vite 5
- Ant Design 6
- React Router 7
- Zustand (状态管理)
- Axios (HTTP 客户端)
- TanStack Query (数据获取)
- Tailwind CSS (样式)

## 目录结构

```
src/
├── api/              # API 调用
│   ├── request.ts    # axios 实例
│   └── auth.ts       # 认证相关 API
├── assets/           # 静态资源
├── components/       # 业务组件
├── hooks/            # 自定义 Hooks
├── layouts/          # 布局组件
├── pages/            # 页面
│   ├── Login.tsx     # 登录页
│   ├── ChangePassword.tsx  # 改密页
│   └── Dashboard.tsx # 首页
├── router/           # 路由配置
├── stores/           # 状态管理
│   └── authStore.ts  # 认证状态
├── types/            # 类型定义
├── utils/            # 工具函数
├── App.tsx           # 根组件
├── main.tsx          # 入口文件
└── index.css         # 全局样式
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

访问 http://localhost:5173

### 构建

```bash
pnpm build
```

### 预览

```bash
pnpm preview
```

## 功能特性

- ✅ 登录功能
- ✅ 验证码支持
- ✅ Token 管理
- ✅ 路由守卫
- ✅ 强制改密
- ✅ 系统配置获取
- ✅ 用户信息获取

## 待开发功能

- [ ] 用户管理
- [ ] 角色管理
- [ ] 菜单管理
- [ ] 字典管理
- [ ] 系统配置
- [ ] 日志管理

---

**创建时间**: 2026-03-28
