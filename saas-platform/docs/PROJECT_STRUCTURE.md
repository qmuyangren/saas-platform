# 项目目录结构规范

**版本**: v2.0  
**更新时间**: 2026-03-28  
**用途**: 统一项目目录结构

---

## 完整目录结构

```
saas-platform/                    # 一个 Git 仓库 ⭐
│
├── 📁 server/                    # 【统一后端服务】
│   ├── src/
│   │   ├── controllers/          # 控制器
│   │   ├── services/             # 服务层
│   │   ├── routes/               # 路由
│   │   ├── middleware/           # 中间件
│   │   ├── utils/                # 工具函数
│   │   └── index.ts              # 入口文件
│   ├── prisma/
│   │   ├── schema.prisma         # 数据模型
│   │   └── migrations/           # 数据库迁移
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── 📁 admin-frontend/            # 【后台管理前端】⭐
│   ├── src/
│   │   ├── api/                  # API 调用
│   │   │   ├── request.ts        # axios 实例
│   │   │   └── auth.ts           # 认证 API
│   │   ├── assets/               # 静态资源
│   │   ├── components/           # 业务组件
│   │   ├── hooks/                # 自定义 Hooks
│   │   ├── layouts/              # 布局组件
│   │   ├── pages/                # 页面
│   │   │   ├── Login.tsx         # 登录页
│   │   │   ├── ChangePassword.tsx # 改密页
│   │   │   └── Dashboard.tsx     # 首页
│   │   ├── router/               # 路由配置
│   │   ├── stores/               # 状态管理
│   │   │   └── authStore.ts      # 认证状态
│   │   ├── types/                # 类型定义
│   │   ├── utils/                # 工具函数
│   │   ├── App.tsx               # 根组件
│   │   ├── main.tsx              # 入口文件
│   │   └── index.css             # 全局样式
│   ├── public/                   # 公共资源
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md
│
├── 📁 ecommerce-frontend/        # 【电商前端】(后续)
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── 📁 oa-frontend/               # 【OA 前端】(后续)
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── 📁 cms-frontend/              # 【CMS 前端】(后续)
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── 📁 docs/                      # 【项目文档】
│   ├── 01-requirements/          # 需求文档
│   │   ├── user-login.md         # 用户登录需求
│   │   ├── oauth-config.md       # OAuth 配置
│   │   ├── system-config.md      # 系统配置
│   │   ├── base-tables.md        # 基础表设计
│   │   └── ...
│   │
│   ├── 02-technical/             # 技术文档
│   │   ├── api-specifications.md # API 规范
│   │   ├── database-design.md    # 数据库设计
│   │   ├── admin-login-flow.md   # 登录流程
│   │   └── ...
│   │
│   ├── 03-guides/                # 使用指南
│   │   ├── CLAWTEAM_GUIDE.md     # ClawTeam 使用
│   │   ├── GIT_WORKFLOW.md       # Git 工作流
│   │   └── ...
│   │
│   ├── 04-architecture/          # 架构设计
│   │   └── ...
│   │
│   └── PROJECT_STRUCTURE.md      # 目录结构规范
│
├── 📄 README.md                  # 项目总说明
└── 📄 .gitignore                 # Git 忽略文件
```

---

## 目录说明

### 核心目录

| 目录 | 用途 | 说明 |
|------|------|------|
| `server/` | 统一后端服务 | 所有业务共用的后端 API 服务 |
| `admin-frontend/` | 后台管理前端 | 后台管理系统前端 |
| `ecommerce-frontend/` | 电商前端 | 电商系统前端 (后续) |
| `oa-frontend/` | OA 前端 | OA 系统前端 (后续) |
| `cms-frontend/` | CMS 前端 | CMS 系统前端 (后续) |
| `docs/` | 项目文档 | 需求/技术/指南文档 |

---

## 命名规范

### 目录命名

```
✅ 正确:
• admin-frontend/     # 后台管理前端
• ecommerce-frontend/ # 电商前端
• server/             # 后端服务

❌ 错误:
• AdminFrontend/      # 驼峰命名
• admin_frontend/     # 下划线命名
• frontend-admin/     # 顺序不一致
```

### 文件命名

```
✅ 正确:
• user-login.md       # 需求文档
• api-specifications.md # 技术文档
• Login.tsx           # React 组件

❌ 错误:
• UserLogin.md        # 驼峰命名
• api_specifications.md # 下划线命名
• login.tsx           # 首字母小写 (组件应该大写)
```

---

## 文档分类规范

### 01-requirements/ (需求文档)

存放所有需求相关文档：

```
01-requirements/
├── user-login.md          # 用户登录需求
├── user-login-v2.md       # v2 版本
├── user-login-v2.1.md     # v2.1 版本
├── user-login-v2.2.md     # v2.2 版本 (完整版)
├── oauth-config.md        # OAuth 配置需求
├── system-config.md       # 系统配置需求
├── base-tables.md         # 基础表设计
├── business-tables.md     # 业务表设计
└── ip-blacklist.md        # IP 黑名单需求
```

### 02-technical/ (技术文档)

存放所有技术相关文档：

```
02-technical/
├── api-specifications.md  # API 接口规范
├── database-design.md     # 数据库设计规范
├── admin-login-flow.md    # 后台登录流程
├── base-sys-log.md        # 系统日志表设计
└── ...
```

### 03-guides/ (使用指南)

存放所有使用指南：

```
03-guides/
├── CLAWTEAM_GUIDE.md      # ClawTeam 使用指南
├── GIT_WORKFLOW.md        # Git 工作流
├── HUMAN_INTERVENTION.md  # 人工介入指南
├── MODEL_CONFIG.md        # 模型配置指南
├── WORKSPACE_GUIDE.md     # 工作目录规范
└── ...
```

### 04-architecture/ (架构设计)

存放架构设计文档：

```
04-architecture/
├── system-overview.md     # 系统总览
├── multi-tenancy.md       # 多租户设计
└── ...
```

---

## Git 规范

### 目录前缀

提交时使用目录前缀：

```bash
# 前端相关
feat(admin-frontend): 实现登录功能
fix(admin-frontend): 修复 Token 刷新问题

# 后端相关
feat(server): 实现用户管理 API
fix(server): 修复数据库连接问题

# 文档相关
docs(readme): 更新项目说明
docs(requirements): 更新登录需求
```

### 分支策略

```
main                # 生产环境
develop            # 开发分支
feature/login      # 登录功能
feature/user-mgmt  # 用户管理功能
fix/auth-bug       # 认证 Bug 修复
```

---

## 清理建议

### 定期清理

```bash
# 清理 node_modules
find . -name "node_modules" -type d -exec rm -rf {} +

# 清理构建输出
find . -name "dist" -type d -exec rm -rf {} +
find . -name "build" -type d -exec rm -rf {} +

# 清理临时文件
find . -name ".cache" -type d -exec rm -rf {} +
find . -name "*.log" -type f -exec rm -f {} +
```

### .gitignore

```gitignore
# 依赖
node_modules/
.pnpm-store/

# 构建输出
dist/
build/
.next/

# 环境文件
.env
.env.local
.env.production

# 日志
logs/
*.log

# 编辑器
.idea/
.vscode/
*.swp

# 系统文件
.DS_Store
Thumbs.db

# 临时文件
.cache/
tmp/
```

---

## 项目启动流程

### 第一次启动

```bash
# 1. 克隆项目
git clone https://github.com/qmuyangren/saas-platform.git
cd saas-platform

# 2. 启动后台管理前端
cd admin-frontend
pnpm install
pnpm dev

# 3. 启动后端服务 (待创建)
cd server
pnpm install
pnpm dev
```

### 开发流程

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 创建功能分支
git checkout -b feature/login

# 3. 开发并提交
git add .
git commit -m "feat(admin-frontend): 实现登录功能"

# 4. 推送分支
git push origin feature/login

# 5. 创建 PR
# 在 GitHub 上创建 Pull Request
```

---

## 常见问题

### Q1: 为什么要用多前端 + 统一后端架构？

**A**: 
- 所有业务共用一套用户体系和权限系统
- 数据集中管理，避免数据孤岛
- 后端统一维护，降低运维成本
- 前端独立开发部署，灵活高效

### Q2: 为什么所有项目在一个 Git 仓库？

**A**:
- 统一管理，方便协调
- 文档和代码在一起
- 版本一致性好
- 适合中小团队

### Q3: 如何添加新的业务前端？

**A**:
```bash
# 1. 创建目录
mkdir ecommerce-frontend

# 2. 初始化项目
cd ecommerce-frontend
pnpm create vite . --template react-ts

# 3. 提交到 Git
git add .
git commit -m "feat(ecommerce-frontend): 初始化电商前端"
```

---

**文档维护**: 小虾米  
**最后更新**: 2026-03-28
