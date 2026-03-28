# 后台管理登录流程与项目结构

**版本**: v1.0  
**更新时间**: 2026-03-28 16:14  
**用途**: 登录流程/Git 仓库/项目目录

---

## 一、后台管理登录流程

### 1.1 完整登录流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                    后台管理登录流程                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: 打开后台管理前端                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  URL: https://admin.xxx.com                              │  │
│  │  加载：应用初始化                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  Step 2: 获取系统基本配置 (匿名可访问)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  GET /api/v1/system/config                               │  │
│  │  响应：                                                   │  │
│  │  {                                                        │  │
│  │    "success": true,                                      │  │
│  │    "data": {                                              │  │
│  │      "systemName": "SaaS 平台管理后台",                    │  │
│  │      "systemLogo": "/images/logo.png",                   │  │
│  │      "loginConfig": {                                     │  │
│  │        "captchaEnabled": true,                           │  │
│  │        "thirdPartyLogin": false  // 后台不支持第三方登录  │  │
│  │      },                                                   │  │
│  │      "securityPolicy": {                                  │  │
│  │        "passwordPolicy": {                                │  │
│  │          "minLength": 6,                                 │  │
│  │          "requireUppercase": true                        │  │
│  │        }                                                  │  │
│  │      }                                                    │  │
│  │    }                                                      │  │
│  │  }                                                        │  │
│  │                                                           │  │
│  │  缓存：localStorage.setItem('systemConfig', ...)          │  │
│  │  有效期：1 小时                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  Step 3: 显示登录页面                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • 显示系统名称和 logo                                   │  │
│  │  • 显示用户名输入框                                      │  │
│  │  • 显示密码输入框                                        │  │
│  │  • 显示验证码 (根据配置)                                 │  │
│  │  • 显示登录按钮                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  Step 4: 用户提交登录                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  POST /api/v1/auth/login                                 │  │
│  │  Request:                                                 │  │
│  │  {                                                        │  │
│  │    "username": "admin",                                  │  │
│  │    "password": "Admin123",                               │  │
│  │    "captcha": "abcd"  // 如果需要                        │  │
│  │  }                                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  Step 5: 验证成功，返回 Token                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Response:                                                │  │
│  │  {                                                        │  │
│  │    "success": true,                                      │  │
│  │    "code": "LOGIN_SUCCESS",                              │  │
│  │    "data": {                                              │  │
│  │      "accessToken": "eyJhbGc...",  // 2 小时              │  │
│  │      "refreshToken": "eyJhbGc...", // 7 天                │  │
│  │      "tokenType": "Bearer",                              │  │
│  │      "expiresIn": 7200  // 秒                            │  │
│  │    }                                                      │  │
│  │  }                                                        │  │
│  │                                                           │  │
│  │  存储：                                                    │  │
│  │  • accessToken → localStorage / sessionStorage           │  │
│  │  • refreshToken → httpOnly cookie (更安全)               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  Step 6: 获取用户详情 (包含权限信息)                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  GET /api/v1/users/me                                    │  │
│  │  Headers: Authorization: Bearer {accessToken}            │  │
│  │  Response:                                                │  │
│  │  {                                                        │  │
│  │    "success": true,                                      │  │
│  │    "data": {                                              │  │
│  │      "id": "admin-uuid-1",                               │  │
│  │      "username": "admin",                                │  │
│  │      "email": "admin@xxx.com",                           │  │
│  │      "role": "SUPER_ADMIN",                              │  │
│  │      "permissions": [                                     │  │
│  │        "user:view",                                      │  │
│  │        "user:edit",                                      │  │
│  │        "system:config"                                   │  │
│  │      ],                                                   │  │
│  │      "isFirstLogin": true,  // 是否首次登录 (初始密码)    │  │
│  │      "mustChangePassword": true  // 是否强制改密          │  │
│  │    }                                                      │  │
│  │  }                                                        │  │
│  │                                                           │  │
│  │  缓存：                                                    │  │
│  │  • userInfo → Zustand store (全局状态)                   │  │
│  │  • permissions → Zustand store                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  Step 7: 判断是否强制改密                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  if (userInfo.mustChangePassword === true) {             │  │
│  │    // 强制跳转到改密页面                                 │  │
│  │    router.push('/auth/change-password');                 │  │
│  │  } else {                                                 │  │
│  │    // 进入后台首页                                       │  │
│  │    router.push('/dashboard');                            │  │
│  │  }                                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  Step 8: 强制修改密码 (如果是初始密码)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  改密页面：                                               │  │
│  │  • 原密码输入框                                          │  │
│  │  • 新密码输入框                                          │  │
│  │  • 确认新密码输入框                                      │  │
│  │  • 密码强度提示                                          │  │
│  │                                                           │  │
│  │  PUT /api/v1/users/me/password                           │  │
│  │  Request:                                                 │  │
│  │  {                                                        │  │
│  │    "oldPassword": "Admin123",                            │  │
│  │    "newPassword": "NewAdmin456!"                         │  │
│  │  }                                                        │  │
│  │                                                           │  │
│  │  Response:                                                │  │
│  │  {                                                        │  │
│  │    "success": true,                                      │  │
│  │    "message": "密码修改成功，请重新登录"                  │  │
│  │  }                                                        │  │
│  │                                                           │  │
│  │  修改成功后：                                             │  │
│  │  • 清除 Token                                             │  │
│  │  • 跳转回登录页                                           │  │
│  │  • 提示用户重新登录                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  Step 9: 进入后台管理系统                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • 根据权限渲染菜单                                      │  │
│  │  • 根据权限控制按钮显示/隐藏                             │  │
│  │  • 根据权限控制路由访问                                  │  │
│  │  • 加载 Dashboard 数据                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 1.2 API 接口详细定义

```typescript
// 1. 获取系统配置
GET /api/v1/system/config
Response: {
  success: true;
  data: {
    systemName: string;
    systemLogo: string;
    systemFavicon: string;
    loginConfig: {
      captchaEnabled: boolean;
      thirdPartyLogin: boolean;
      allowedLoginMethods: string[]; // ['password']
    };
    securityPolicy: {
      passwordPolicy: {
        minLength: number;
        maxLength: number;
        requireUppercase: boolean;
        requireLowercase: boolean;
        requireNumbers: boolean;
        requireSpecial: boolean;
      };
      lockoutPolicy: {
        maxFailedAttempts: number;
        lockoutDuration: number; // 秒
      };
    };
  };
}

// 2. 登录
POST /api/v1/auth/login
Request: {
  username: string;
  password: string;
  captcha?: string;
  captchaId?: string;
}
Response: {
  success: true;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: 'Bearer';
    expiresIn: number; // 秒
  };
}

// 3. 获取用户详情
GET /api/v1/users/me
Headers: {
  Authorization: 'Bearer {accessToken}';
}
Response: {
  success: true;
  data: {
    id: string;
    username: string;
    email: string;
    phone?: string;
    avatar?: string;
    nickname?: string;
    role: 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR' | 'AUDITOR';
    permissions: string[];
    isFirstLogin: boolean;
    mustChangePassword: boolean;
  };
}

// 4. 修改密码
PUT /api/v1/users/me/password
Request: {
  oldPassword: string;
  newPassword: string;
}
Response: {
  success: true;
  message: '密码修改成功，请重新登录';
}

// 5. 获取验证码 (如果需要)
GET /api/v1/auth/captcha
Response: {
  success: true;
  data: {
    captchaId: string;
    captchaImage: string; // base64 图片
    expiresIn: number; // 秒
  };
}
```

---

### 1.3 前端状态管理 (Zustand)

```typescript
// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  // Token
  accessToken: string | null;
  refreshToken: string | null;
  
  // 用户信息
  userInfo: {
    id: string;
    username: string;
    email: string;
    role: string;
    permissions: string[];
    mustChangePassword: boolean;
  } | null;
  
  // 系统配置
  systemConfig: {
    systemName: string;
    systemLogo: string;
    loginConfig: any;
    securityPolicy: any;
  } | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  fetchUserInfo: () => Promise<void>;
  fetchSystemConfig: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      userInfo: null,
      systemConfig: null,
      
      login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        const { accessToken, refreshToken } = response.data;
        
        set({ accessToken, refreshToken });
        
        // 获取用户信息
        await get().fetchUserInfo();
      },
      
      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          userInfo: null,
        });
        localStorage.removeItem('auth');
      },
      
      fetchUserInfo: async () => {
        const response = await api.get('/users/me');
        set({ userInfo: response.data });
      },
      
      fetchSystemConfig: async () => {
        const response = await api.get('/system/config');
        set({ systemConfig: response.data });
      },
      
      changePassword: async (data) => {
        await api.put('/users/me/password', data);
        // 修改成功后清除登录状态
        get().logout();
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
```

---

### 1.4 路由守卫

```typescript
// router/guards.ts
import { useAuthStore } from '@/stores/authStore';

// 路由守卫
export const setupRouteGuards = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    
    // 1. 检查是否已登录
    const isAuthenticated = !!authStore.accessToken;
    
    // 2. 如果是登录页，且已登录，直接跳转到首页
    if (to.path === '/login') {
      if (isAuthenticated) {
        next('/dashboard');
      } else {
        next();
      }
      return;
    }
    
    // 3. 需要认证的页面
    if (to.meta.requiresAuth) {
      if (!isAuthenticated) {
        next({ path: '/login', query: { redirect: to.fullPath } });
        return;
      }
      
      // 4. 检查用户信息是否已加载
      if (!authStore.userInfo) {
        try {
          await authStore.fetchUserInfo();
        } catch (error) {
          // Token 失效，清除登录状态
          authStore.logout();
          next({ path: '/login', query: { redirect: to.fullPath } });
          return;
        }
      }
      
      // 5. 检查是否强制改密
      if (authStore.userInfo?.mustChangePassword) {
        if (to.path !== '/auth/change-password') {
          next('/auth/change-password');
          return;
        }
      }
      
      // 6. 检查权限
      if (to.meta.permissions) {
        const hasPermission = to.meta.permissions.some((permission: string) =>
          authStore.userInfo?.permissions.includes(permission)
        );
        
        if (!hasPermission) {
          next('/403');
          return;
        }
      }
    }
    
    next();
  });
};
```

---

## 二、Git 仓库策略

### 2.1 Monorepo 目录结构

```
/workspace/                              # 工作目录
├── apps/                                # 应用代码
│   ├── admin/                           # 后台管理系统前端 ⭐ 先完成
│   │   ├── public/                      # 静态资源
│   │   ├── src/                         # 源代码
│   │   │   ├── api/                     # API 调用
│   │   │   ├── assets/                  # 资源文件
│   │   │   ├── components/              # 业务组件
│   │   │   ├── hooks/                   # 自定义 Hooks
│   │   │   ├── layouts/                 # 布局组件
│   │   │   ├── pages/                   # 页面
│   │   │   ├── router/                  # 路由配置
│   │   │   ├── stores/                  # 状态管理
│   │   │   ├── types/                   # 类型定义
│   │   │   ├── utils/                   # 工具函数
│   │   │   ├── App.tsx                  # 根组件
│   │   │   └── main.tsx                 # 入口文件
│   │   ├── package.json                 # 依赖配置
│   │   ├── tsconfig.json                # TypeScript 配置
│   │   ├── vite.config.ts               # Vite 配置
│   │   └── README.md                    # 项目说明
│   │
│   ├── ecommerce/                       # 电商系统前端 (后续)
│   ├── oa/                              # OA 系统前端 (后续)
│   └── cms/                             # CMS 系统前端 (后续)
│
├── packages/                            # 共享包
│   ├── ui/                              # 共享 UI 组件库
│   │   ├── src/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── utils/                           # 共享工具函数
│   │   ├── src/
│   │   │   ├── format.ts
│   │   │   ├── validate.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── types/                           # 共享类型定义
│       ├── src/
│       │   ├── api.ts
│       │   ├── user.ts
│       │   └── index.ts
│       └── package.json
│
├── backend/                             # 后端代码
│   ├── admin-api/                       # 后台管理 API ⭐ 先完成
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── ecommerce-api/                   # 电商 API (后续)
│
├── docs/                                # 所有文档
│   ├── requirements/                    # 需求文档
│   ├── technical/                       # 技术文档
│   └── ...
│
├── scripts/                             # 脚本工具
│   ├── setup.sh
│   ├── deploy.sh
│   └── ...
│
├── types/                               # 全局类型定义
│   ├── user.ts
│   ├── order.ts
│   └── index.ts
│
├── .gitignore                           # Git 忽略文件
├── package.json                         # 根 package.json
├── pnpm-workspace.yaml                  # pnpm 工作区配置
└── README.md                            # 项目总说明
```

---

### 2.2 Git 分支策略

```
┌─────────────────────────────────────────────────────────────────┐
│                    Git 分支策略                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  主分支：                                                       │
│  • main - 生产环境代码 (受保护)                                │
│  • develop - 开发分支                                          │
│                                                                 │
│  特性分支：                                                     │
│  • feature/admin-login - 后台登录功能                          │
│  • feature/admin-dashboard - 后台首页                          │
│  • feature/user-management - 用户管理                          │
│                                                                 │
│  修复分支：                                                     │
│  • fix/login-bug - 登录 Bug 修复                                │
│  • hotfix/security-fix - 安全修复                              │
│                                                                 │
│  发布分支：                                                     │
│  • release/v1.0.0 - v1.0.0 发布准备                             │
│                                                                 │
│  工作流程：                                                     │
│  1. 从 develop 创建 feature 分支                                │
│  2. 开发完成后提交 PR 到 develop                                │
│  3. 代码审查通过后合并到 develop                                │
│  4. 准备发布时创建 release 分支                                 │
│  5. 发布后合并到 main 和 develop                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 2.3 Git 提交规范

```bash
# Commit Message 格式
<type>(<scope>): <subject>

# type 类型:
• feat: 新功能
• fix: Bug 修复
• docs: 文档更新
• style: 代码格式 (不影响代码运行)
• refactor: 重构 (既不是新功能也不是 Bug 修复)
• test: 测试相关
• chore: 构建过程或辅助工具变动

# 示例:
git commit -m "feat(admin): 实现后台登录功能"
git commit -m "fix(auth): 修复 Token 刷新问题"
git commit -m "docs(readme): 更新项目说明"
git commit -m "refactor(api): 重构 API 调用层"
git commit -m "test(login): 添加登录测试用例"
```

---

### 2.4 .gitignore

```gitignore
# 依赖
node_modules/
.pnpm-store/

# 构建输出
dist/
build/
.next/
out/

# 环境文件
.env
.env.local
.env.production
.env.*.local

# 日志
logs/
*.log
npm-debug.log*

# 编辑器
.idea/
.vscode/
*.swp
*.swo

# 系统文件
.DS_Store
Thumbs.db

# 临时文件
tmp/
temp/
.cache/

# 测试覆盖率
coverage/

# TypeScript
*.tsbuildinfo

# 上传文件 (本地存储)
uploads/
public/uploads/
```

---

## 三、项目创建计划

### 3.1 第一阶段：后台管理 (当前)

```
✅ 需求分析 (已完成)
   • 用户登录功能需求
   • 系统配置需求
   • 权限管理需求

⏳ 架构设计 (下一步)
   • 技术架构设计
   • 数据库设计
   • API 设计

⏳ 后端开发
   • 创建 backend/admin-api 项目
   • 实现登录 API
   • 实现用户管理 API
   • 实现权限管理 API

⏳ 前端开发
   • 创建 apps/admin 项目
   • 实现登录页面
   • 实现首页
   • 实现权限路由

⏳ 测试验证
   • 单元测试
   • 集成测试
   • 手动测试
```

### 3.2 第二阶段：业务系统 (后续)

```
⏳ 电商系统 (apps/ecommerce)
⏳ OA 系统 (apps/oa)
⏳ CMS 系统 (apps/cms)
⏳ 其他业务系统...
```

---

## 四、立即开始

### 4.1 创建后台管理前端项目

```bash
# 进入工作目录
cd /Users/nick/.openclaw/workspace

# 创建后台管理前端项目
pnpm create vite apps/admin --template react-ts

# 安装依赖
cd apps/admin
pnpm install

# 安装核心依赖
pnpm add react-router-dom zustand axios @tanstack/react-query
pnpm add shadcn-ui antd tailwindcss
pnpm add -D @types/node
```

### 4.2 创建后端 API 项目

```bash
# 创建后端 API 项目
mkdir -p backend/admin-api
cd backend/admin-api

# 初始化项目
pnpm init
pnpm add fastify @fastify/cors @fastify/jwt bcrypt prisma @prisma/client
pnpm add -D typescript @types/node @types/bcrypt
```

---

**文档维护**: 小虾米  
**最后更新**: 2026-03-28 16:14
