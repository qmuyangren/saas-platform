# 项目目录结构规范

**最后更新**: 2026-03-28  
**项目根目录**: `/Users/nick/.openclaw/workspace`

---

## 目录结构

```
/workspace/
│
├── apps/                      # 应用代码 (按业务划分)
│   ├── ecommerce/             # 电商业务
│   │   ├── frontend/          # 电商前端 (React)
│   │   ├── backend/           # 电商后端 (Node.js)
│   │   └── mobile/            # 电商移动端 (uni-app)
│   │
│   ├── oa/                    # OA 业务
│   │   ├── frontend/
│   │   ├── backend/
│   │   └── mobile/
│   │
│   ├── cms/                   # CMS 业务
│   │   ├── frontend/
│   │   ├── backend/
│   │   └── mobile/
│   │
│   ├── party-building/        # 党建业务
│   │   ├── frontend/
│   │   ├── backend/
│   │   └── mobile/
│   │
│   └── campus/                # 校园业务
│       ├── frontend/
│       ├── backend/
│       └── mobile/
│
├── packages/                  # 共享包 (所有业务共用)
│   ├── shared/                # 共享工具/类型
│   │   ├── types/             # TypeScript 类型
│   │   ├── utils/             # 工具函数
│   │   ├── constants/         # 常量
│   │   └── api-client/        # API 客户端
│   │
│   ├── core/                  # 核心业务 (用户/权限/多租户)
│   │   ├── auth/
│   │   ├── user/
│   │   ├── tenant/
│   │   └── permission/
│   │
│   ├── ui/                    # UI 组件库
│   │   ├── Button/
│   │   ├── Input/
│   │   └── ...
│   │
│   └── config/                # 配置文件
│
├── services/                  # 独立服务 (可选)
│   ├── api-gateway/
│   ├── auth-service/
│   └── file-service/
│
├── docs/                      # 所有文档
│   ├── architecture/          # 架构设计
│   ├── api/                   # API 文档
│   ├── business-logic/        # 业务流程
│   ├── requirements/          # 需求文档
│   ├── ecommerce/             # 电商文档
│   ├── oa/                    # OA 文档
│   └── meetings/              # 会议记录
│
├── tests/                     # 测试代码
│   ├── unit/                  # 单元测试
│   ├── integration/           # 集成测试
│   └── e2e/                   # E2E 测试
│
├── infra/                     # 基础设施
│   ├── docker/                # Docker 配置
│   ├── k8s/                   # Kubernetes 配置
│   └── scripts/               # 部署脚本
│
├── knowledge/                 # 知识库 (同步飞书)
│   ├── ai-basics/
│   ├── saas-architecture/
│   ├── mcp-protocol/
│   ├── feishu-integration/
│   ├── agent-development/
│   ├── business-systems/
│   └── flowcharts/
│
├── memory/                    # 记忆文件
│   ├── YYYY-MM-DD.md          # 每日记忆
│   └── heartbeat-state.json   # 心跳状态
│
├── skills/                    # OpenClaw 技能
│   └── [skill-name]/
│
├── notes/                     # 临时笔记 (定期清理)
│   └── YYYY-MM-DD-topic.md
│
├── .github/                   # GitHub Actions
│   └── workflows/
│
├── .clawhub/                  # ClawHub 配置
├── .git/                      # Git 仓库
├── .openclaw/                 # OpenClaw 配置
│
├── package.json               # 项目配置
├── pnpm-workspace.yaml        # pnpm workspace
├── turbo.json                 # Turborepo 配置
│
├── AGENTS.md                  # Agent 工作指南
├── USER.md                    # 用户信息
├── IDENTITY.md                # Agent 身份
├── SOUL.md                    # Agent 核心
├── TOOLS.md                   # 工具配置
├── HEARTBEAT.md               # 心跳任务
├── PROJECT_STRUCTURE.md       # 本规范
└── README.md                  # 项目说明
```

---

## 严格规则

### ✅ 允许的操作

1. **业务代码** → `apps/{业务名}/{frontend|backend|mobile}/`
2. **共享代码** → `packages/{shared|core|ui}/`
3. **文档文件** → `docs/` 或 `knowledge/`
4. **测试文件** → `tests/` 或 代码同目录
5. **配置文件** → 根目录或 `packages/config/`
6. **临时笔记** → `notes/` (需标注日期，定期清理)

### ❌ 禁止的操作

1. **禁止**在根目录直接创建新文件 (除非是配置文件)
2. **禁止**在 `~/.openclaw/` 其他位置创建项目文件
3. **禁止**创建未登记的目录结构
4. **禁止**将文档散落在代码目录中
5. **禁止**业务代码直接放在 `apps/` 下 (必须按业务分目录)

---

## 依赖规则

```
依赖方向 (只能向下，不能循环):

packages/shared   ← 最底层，无依赖
      ↓
packages/core     ← 依赖 shared
packages/ui       ← 依赖 shared
      ↓
apps/{业务}       ← 依赖 packages/*
```

---

## Agent 启动检查清单

每个 Agent 启动前必须：

- [ ] `cd /Users/nick/.openclaw/workspace`
- [ ] 读取本规范文档
- [ ] 确认要操作的目录位置
- [ ] 不确定时先询问，不要乱创建

---

## 文件命名规范

### 文档文件
- 格式：`YYYY-MM-DD-topic.md`
- 示例：`2026-03-28-user-login-requirements.md`

### 代码文件
- 格式：`kebab-case` 或 `camelCase`
- 示例：`user-service.ts`, `login-controller.ts`

### 测试文件
- 格式：`*.test.ts` 或 `*.spec.ts`
- 示例：`user.service.test.ts`

---

## 清理规则

- `notes/` 目录：每月清理一次
- 临时文件：完成任务后立即删除
- 过期文档：移动到 `docs/archive/`

---

## 违规处理

发现文件放错位置时：

1. 立即移动到正确位置
2. 更新相关文件引用
3. Git 提交说明原因

---

**所有 Agent 必须遵守此规范！**
