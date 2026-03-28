# 项目目录结构规范

**最后更新**: 2026-03-28  
**项目根目录**: `/Users/nick/.openclaw/workspace`

---

## 目录结构

```
/workspace/
│
├── apps/                      # 应用代码
│   ├── web/                   # Web 前端 (React)
│   ├── mobile/                # 移动端 (uni-app)
│   ├── admin/                 # 管理后台
│   └── api/                   # API 服务 (Node.js)
│
├── packages/                  # 共享包
│   ├── core/                  # 核心业务逻辑
│   ├── shared/                # 共享工具/类型
│   ├── ui/                    # UI 组件库
│   └── config/                # 配置文件
│
├── docs/                      # 所有文档
│   ├── architecture/          # 架构设计
│   ├── api/                   # API 文档
│   ├── business-logic/        # 业务流程
│   ├── requirements/          # 需求文档
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
└── README.md                  # 项目说明
```

---

## 严格规则

### ✅ 允许的操作

1. **代码文件** → 只能放在 `apps/` 或 `packages/`
2. **文档文件** → 只能放在 `docs/` 或 `knowledge/`
3. **测试文件** → 只能放在 `tests/` 或 代码同目录
4. **配置文件** → 根目录或 `packages/config/`
5. **临时笔记** → `notes/` (需标注日期，定期清理)

### ❌ 禁止的操作

1. **禁止**在根目录直接创建新文件 (除非是配置文件)
2. **禁止**在 `~/.openclaw/` 其他位置创建项目文件
3. **禁止**创建未登记的目录结构
4. **禁止**将文档散落在代码目录中

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
