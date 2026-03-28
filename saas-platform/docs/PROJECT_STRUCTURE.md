# 项目目录结构规范

**版本**: v1.0  
**更新时间**: 2026-03-28  
**用途**: 统一项目目录结构

---

## 完整目录结构

```
/workspace/
│
├── 📁 .git/                    # Git 仓库
├── 📁 .openclaw/               # OpenClaw 配置
│
├── 📄 README.md                # 项目总说明
├── 📄 package.json             # 根 package 配置
├── 📄 pnpm-workspace.yaml      # pnpm 工作区配置
├── 📄 pnpm-lock.yaml           # 依赖锁定
├── 📄 .gitignore               # Git 忽略文件
│
├── 📁 apps/                    # 【应用代码】
│   ├── admin/                  # 后台管理系统 ⭐
│   │   ├── src/
│   │   │   ├── api/            # API 调用
│   │   │   ├── assets/         # 静态资源
│   │   │   ├── components/     # 业务组件
│   │   │   ├── hooks/          # 自定义 Hooks
│   │   │   ├── layouts/        # 布局组件
│   │   │   ├── pages/          # 页面
│   │   │   ├── router/         # 路由配置
│   │   │   ├── stores/         # 状态管理
│   │   │   ├── types/          # 类型定义
│   │   │   ├── utils/          # 工具函数
│   │   │   ├── App.tsx         # 根组件
│   │   │   ├── main.tsx        # 入口文件
│   │   │   └── index.css       # 全局样式
│   │   ├── public/             # 公共资源
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── README.md
│   │
│   ├── ecommerce/              # 电商系统 (后续)
│   ├── oa/                     # OA 系统 (后续)
│   └── cms/                    # CMS 系统 (后续)
│
├── 📁 backend/                 # 【后端代码】
│   ├── admin-api/              # 后台管理 API ⭐
│   │   ├── src/
│   │   │   ├── controllers/    # 控制器
│   │   │   ├── middleware/     # 中间件
│   │   │   ├── routes/         # 路由
│   │   │   ├── services/       # 服务层
│   │   │   ├── utils/          # 工具函数
│   │   │   └── index.ts        # 入口文件
│   │   ├── prisma/             # 数据库配置
│   │   │   ├── schema.prisma   # 数据模型
│   │   │   └── migrations/     # 数据库迁移
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   └── ecommerce-api/          # 电商 API (后续)
│
├── 📁 packages/                # 【共享包】
│   ├── ui/                     # UI 组件库
│   ├── utils/                  # 工具函数库
│   └── types/                  # 类型定义库
│
├── 📁 docs/                    # 【项目文档】
│   ├── 01-requirements/        # 需求文档
│   │   ├── user-login.md       # 用户登录需求
│   │   ├── oauth-config.md     # OAuth 配置
│   │   └── ...
│   │
│   ├── 02-technical/           # 技术文档
│   │   ├── api-specifications.md    # API 规范
│   │   ├── database-design.md       # 数据库设计
│   │   ├── admin-login-flow.md      # 登录流程
│   │   └── ...
│   │
│   ├── 03-guides/              # 使用指南
│   │   ├── CLAWTEAM_GUIDE.md   # ClawTeam 使用
│   │   ├── GIT_WORKFLOW.md     # Git 工作流
│   │   └── ...
│   │
│   └── 04-architecture/        # 架构设计
│       └── ...
│
├── 📁 knowledge/               # 【知识库】
│   ├── ai-basics/              # AI 基础
│   ├── saas-architecture/      # SaaS 架构
│   ├── mcp-protocol/           # MCP 协议
│   ├── feishu-integration/     # 飞书集成
│   ├── agent-development/      # Agent 开发
│   ├── business-systems/       # 业务系统
│   └── flowcharts/             # 流程图
│
├── 📁 skills/                  # 【AI 技能】
│   ├── product-ceo/            # 产品 CEO 技能
│   ├── architect/              # 架构师技能
│   ├── developer/              # 开发者技能
│   ├── qa-lead/                # QA 技能
│   ├── release-engineer/       # 发布工程师技能
│   ├── code-standards/         # 代码规范技能
│   ├── security-review/        # 安全审查技能
│   └── component-selector/     # 组件选型技能
│
├── 📁 memory/                  # 【记忆文件】
│   ├── 2026-03-27.md
│   ├── 2026-03-28.md
│   └── heartbeat-state.json
│
├── 📁 scripts/                 # 【脚本工具】
│   ├── setup.sh                # 初始化脚本
│   ├── deploy.sh               # 部署脚本
│   └── backup.sh               # 备份脚本
│
└── 📁 types/                   # 【全局类型】
    ├── user.ts
    ├── order.ts
    └── index.ts
```

---

## 目录说明

### 核心目录

| 目录 | 用途 | 说明 |
|------|------|------|
| `apps/` | 应用代码 | 前端应用（后台管理/电商/OA 等） |
| `backend/` | 后端代码 | 后端 API 服务 |
| `packages/` | 共享包 | 跨项目共享的库 |
| `docs/` | 项目文档 | 需求/技术/指南文档 |
| `knowledge/` | 知识库 | 结构化知识沉淀 |
| `skills/` | AI 技能 | AI Agent 技能定义 |
| `memory/` | 记忆文件 | AI 会话记忆 |

### 文档目录规范

```
docs/
├── 01-requirements/    # 需求文档（带编号，便于排序）
├── 02-technical/       # 技术文档
├── 03-guides/          # 使用指南
└── 04-architecture/    # 架构设计
```

**文档命名**：
- 使用小写字母
- 单词间用连字符（-）
- 语义清晰

**示例**：
- ✅ `user-login.md`
- ❌ `UserLogin.md`
- ❌ `user_login.md`

---

## 文件组织原则

### 1. 按功能分类，而非文件类型

```
✅ 正确：
apps/admin/src/pages/      # 所有页面
apps/admin/src/components/ # 所有组件

❌ 错误：
apps/admin/pages/          # 分散
apps/admin/components/
apps/admin/react-pages/    # 按技术分
apps/admin/vue-pages/
```

### 2. 保持扁平，避免过深嵌套

```
✅ 正确（3 层）：
apps/admin/src/pages/Login.tsx

❌ 错误（6 层）：
apps/admin/src/components/pages/login/LoginPage.tsx
```

### 3. 命名一致

```
✅ 正确：
apps/admin/
backend/admin-api/

❌ 错误：
apps/Admin/                # 大小写不一致
backend/AdminApi/
```

### 4. 及时清理

```
定期清理：
• 临时文件（tmp/ temp/）
• 无用文档
• 过时的配置
```

---

## 文档分类说明

### 01-requirements/ (需求文档)

存放所有需求相关文档：

```
01-requirements/
├── user-login.md          # 用户登录需求
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

## 代码目录规范

### apps/admin/src/

```
src/
├── api/              # API 调用层
│   ├── request.ts    # axios 实例配置
│   ├── auth.ts       # 认证 API
│   ├── user.ts       # 用户 API
│   └── index.ts      # 统一导出
│
├── assets/           # 静态资源
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── components/       # 业务组件
│   ├── Layout/       # 布局组件
│   ├── Header/       # 头部组件
│   ├── Sidebar/      # 侧边栏
│   └── ...
│
├── hooks/            # 自定义 Hooks
│   ├── useAuth.ts
│   ├── usePermission.ts
│   └── ...
│
├── layouts/          # 布局组件
│   ├── BasicLayout.tsx
│   └── UserLayout.tsx
│
├── pages/            # 页面
│   ├── Login/
│   │   ├── index.tsx
│   │   └── index.css
│   ├── Dashboard/
│   └── ...
│
├── router/           # 路由配置
│   ├── index.tsx
│   └── routes.ts
│
├── stores/           # 状态管理
│   ├── authStore.ts
│   ├── userStore.ts
│   └── ...
│
├── types/            # 类型定义
│   ├── api.ts
│   ├── user.ts
│   └── index.ts
│
├── utils/            # 工具函数
│   ├── format.ts
│   ├── validate.ts
│   └── ...
│
├── App.tsx           # 根组件
├── main.tsx          # 入口文件
└── index.css         # 全局样式
```

### backend/admin-api/src/

```
src/
├── controllers/      # 控制器
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   └── ...
│
├── middleware/       # 中间件
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── ...
│
├── routes/           # 路由
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   └── ...
│
├── services/         # 服务层
│   ├── auth.service.ts
│   ├── user.service.ts
│   └── ...
│
├── utils/            # 工具函数
│   ├── logger.ts
│   ├── encryption.ts
│   └── ...
│
└── index.ts          # 入口文件
```

---

## 清理建议

### 需要整理的内容

```
当前问题：
1. docs/ 目录下文档没有分类
2. docs/notes/ 目录内容需要整理
3. docs/saas-launch-log.md 应该移到 memory/
4. 根目录文件过多

整理计划：
1. docs/ 创建编号子目录 (01-requirements/02-technical/...)
2. 移动文档到对应目录
3. 清理无用文件
4. 更新文档引用路径
```

---

**文档维护**: 小虾米  
**最后更新**: 2026-03-28
