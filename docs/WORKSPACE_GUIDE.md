# 工作目录规范

> 严格的工作目录管理规范，防止文件散落在各处

**版本**: v1.0  
**更新时间**: 2026-03-28  
**执行级别**: ⚠️ 强制执行

---

## ⚠️ 核心原则

```
┌─────────────────────────────────────────────────────────────────┐
│                    工作目录铁律                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 所有工作文件必须在 /Users/nick/.openclaw/workspace          │
│     ❌ 禁止在 ~/.openclaw/ 其他目录创建工作文件                  │
│     ❌ 禁止在 /tmp/ 创建工作文件                                 │
│     ❌ 禁止在 ~/Desktop/ 创建工作文件                            │
│     ❌ 禁止在 ~/Downloads/ 创建工作文件                          │
│     ❌ 禁止在 其他随机位置 创建工作文件                          │
│                                                                 │
│  2. 工作目录结构必须清晰                                        │
│     ✅ 按功能分类 (apps/, docs/, skills/, knowledge/)           │
│     ✅ 命名规范 (kebab-case)                                    │
│     ✅ 及时清理临时文件                                         │
│                                                                 │
│  3. 创建文件前必须确认位置                                      │
│     ✅ 先检查目录结构                                           │
│     ✅ 确认文件应该放在哪里                                     │
│     ✅ 不确定时先询问                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 目录结构总览

```
/Users/nick/.openclaw/workspace/
│
├── apps/                      # 业务应用代码
│   ├── ecommerce/            # 电商系统
│   │   ├── frontend/         # 前端 (React + Vite)
│   │   ├── backend/          # 后端 (Node.js + Fastify)
│   │   └── mobile/           # 移动端 (uni-app)
│   ├── oa/                   # OA 系统
│   ├── cms/                  # CMS 系统
│   ├── party-building/       # 党建系统
│   └── campus/               # 校园系统
│
├── types/                     # 共享类型定义
│   ├── user.ts
│   ├── order.ts
│   └── index.ts
│
├── docs/                      # 项目文档
│   ├── requirements/         # 需求文档
│   ├── architecture/         # 架构设计
│   ├── api/                  # API 文档
│   ├── qa/                   # 测试文档
│   ├── releases/             # 发布文档
│   ├── templates/            # 文档模板
│   └── CLAWTEAM_GUIDE.md     # ClawTeam 使用指南
│
├── knowledge/                 # 知识库
│   ├── ai-basics/            # AI 基础知识
│   ├── saas-architecture/    # SaaS 架构
│   ├── mcp-protocol/         # MCP 协议
│   ├── feishu-integration/   # 飞书集成
│   ├── agent-development/    # Agent 开发
│   ├── business-systems/     # 业务系统
│   ├── flowcharts/           # 流程图
│   ├── ai-feedback/          # AI 问题反馈
│   └── README.md
│
├── skills/                    # AI 技能
│   ├── product-ceo/          # 产品 CEO 技能
│   ├── architect/            # 架构师技能
│   ├── developer/            # 开发者技能
│   ├── qa-lead/              # QA 技能
│   ├── release-engineer/     # 发布工程师技能
│   ├── code-standards/       # 代码规范技能
│   ├── security-review/      # 安全审查技能
│   ├── component-selector/   # 组件选型技能
│   └── README.md
│
├── memory/                    # 记忆文件
│   ├── 2026-03-27.md
│   ├── 2026-03-28.md
│   └── heartbeat-state.json  # 心跳状态
│
├── tests/                     # 测试文件
│   ├── unit/                 # 单元测试
│   ├── integration/          # 集成测试
│   └── e2e/                  # 端到端测试
│
├── scripts/                   # 脚本工具
│   ├── setup.sh
│   ├── deploy.sh
│   └── backup.sh
│
├── .git/                      # Git 仓库
├── .gitignore                 # Git 忽略文件
├── package.json               # 项目配置
│
├── AGENTS.md                  # Agent 工作指南
├── SOUL.md                    # AI 身份定义
├── USER.md                    # 用户信息
├── IDENTITY.md                # AI 身份
├── TOOLS.md                   # 工具配置
├── HEARTBEAT.md               # 心跳任务
├── BOOTSTRAP.md               # 初始化脚本 (完成后删除)
├── MEMORY.md                  # 长期记忆 (主会话加载)
├── PROJECT_STRUCTURE.md       # 项目结构说明
└── README.md                  # 项目说明
```

---

## 各目录详细说明

### 1. apps/ - 业务应用代码

**用途**: 存放所有业务系统的源代码

**规则**:
```
✅ 正确:
/workspace/apps/ecommerce/frontend/src/...
/workspace/apps/ecommerce/backend/src/...
/workspace/apps/oa/frontend/src/...

❌ 错误:
/Users/nick/my-project/...              ← 禁止！
/Users/nick/Desktop/test/...            ← 禁止！
~/.openclaw/agents/main/...             ← 禁止！
```

**目录模板**:
```
apps/[业务名称]/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── tsconfig.json
├── mobile/
│   ├── src/
│   ├── package.json
│   └── manifest.json
└── README.md
```

---

### 2. types/ - 共享类型定义

**用途**: 前后端共享的 TypeScript 类型定义

**规则**:
```
✅ 正确:
/workspace/types/user.ts
/workspace/types/order.ts

❌ 错误:
/workspace/apps/ecommerce/types/...     ← 类型应该共享
/workspace/apps/ecommerce/frontend/src/types/...  ← 禁止重复定义
```

**文件示例**:
```typescript
// types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'ADMIN' | 'USER' | 'GUEST';

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}
```

---

### 3. docs/ - 项目文档

**用途**: 所有项目相关文档

**规则**:
```
✅ 正确:
/workspace/docs/requirements/user-login.md
/workspace/docs/architecture/user-login-system.md
/workspace/docs/api/auth.yaml

❌ 错误:
/workspace/requirements.md              ← 应该放在 docs/requirements/
/workspace/architecture.md              ← 应该放在 docs/architecture/
/Users/nick/Documents/project-docs/...  ← 禁止！
```

**子目录结构**:
```
docs/
├── requirements/           # 需求文档
│   ├── user-login.md
│   ├── shopping-cart.md
│   └── order-management.md
│
├── architecture/           # 架构设计
│   ├── system-overview.md
│   ├── database-design.md
│   ├── api-design.md
│   └── security-design.md
│
├── api/                    # API 文档
│   ├── auth.yaml
│   ├── user.yaml
│   └── order.yaml
│
├── qa/                     # 测试文档
│   ├── test-plan.md
│   ├── test-cases.md
│   └── test-reports/
│
├── releases/               # 发布文档
│   ├── v1.0.0.md
│   ├── v1.1.0.md
│   └── CHANGELOG.md
│
├── templates/              # 文档模板
│   ├── requirements.md
│   ├── architecture.md
│   └── api.md
│
└── CLAWTEAM_GUIDE.md       # ClawTeam 使用指南
```

---

### 4. knowledge/ - 知识库

**用途**: 结构化知识沉淀，与飞书知识库同步

**规则**:
```
✅ 正确:
/workspace/knowledge/ai-basics/llm-intro.md
/workspace/knowledge/saas-architecture/multi-tenancy.md

❌ 错误:
/workspace/ai-notes.md              ← 应该分类到 knowledge/
/workspace/learnings/...            ← 应该放在 knowledge/
/Users/nick/Notes/...               ← 禁止！
```

**子目录结构**:
```
knowledge/
├── ai-basics/              # AI 基础知识
│   ├── llm-introduction.md
│   ├── prompt-engineering.md
│   └── agent-architecture.md
│
├── saas-architecture/      # SaaS 架构
│   ├── multi-tenancy.md
│   ├── microservices.md
│   └── scalability.md
│
├── mcp-protocol/           # MCP 协议
│   ├── introduction.md
│   ├── tools.md
│   └── resources.md
│
├── feishu-integration/     # 飞书集成
│   ├── api-reference.md
│   ├── skills.md
│   └── best-practices.md
│
├── agent-development/      # Agent 开发
│   ├── skill-creation.md
│   ├── tool-integration.md
│   └── testing.md
│
├── business-systems/       # 业务系统
│   ├── ecommerce.md
│   ├── oa.md
│   ├── cms.md
│   └── erp.md
│
├── flowcharts/             # 流程图
│   ├── saas-overview.md
│   ├── user-flow.md
│   └── data-flow.md
│
├── ai-feedback/            # AI 问题反馈
│   ├── concurrency.md
│   ├── security.md
│   └── performance.md
│
└── README.md
```

---

### 5. skills/ - AI 技能

**用途**: AI Agent 的技能定义

**规则**:
```
✅ 正确:
/workspace/skills/product-ceo/SKILL.md
/workspace/skills/developer/SKILL.md

❌ 错误:
/workspace/skills.md                  ← 应该是目录
/workspace/agent-skills/...           ← 统一用 skills/
~/.openclaw/skills/...                ← 禁止！
```

**技能目录结构**:
```
skills/[技能名称]/
├── SKILL.md              # 技能定义 (必需)
├── examples/             # 示例 (可选)
├── templates/            # 模板 (可选)
└── README.md             # 技能说明
```

---

### 6. memory/ - 记忆文件

**用途**: AI 会话记忆，按日期组织

**规则**:
```
✅ 正确:
/workspace/memory/2026-03-28.md
/workspace/memory/heartbeat-state.json

❌ 错误:
/workspace/memory.md                ← 应该是目录
/workspace/memories/...             ← 统一用 memory/
/Users/nick/Notes/ai-memory/...     ← 禁止！
```

**文件命名**:
```
memory/
├── YYYY-MM-DD.md         # 每日记忆
├── heartbeat-state.json  # 心跳状态
└── ai-feedback/          # AI 反馈 (可选)
```

---

### 7. tests/ - 测试文件

**用途**: 所有测试文件

**规则**:
```
✅ 正确:
/workspace/tests/unit/user.test.ts
/workspace/tests/integration/login.test.ts
/workspace/tests/e2e/checkout.test.ts

❌ 错误:
/workspace/apps/ecommerce/tests/...   ← 测试应该集中管理
/workspace/test/...                   ← 统一用 tests/ (复数)
```

**目录结构**:
```
tests/
├── unit/                   # 单元测试
│   ├── user.test.ts
│   └── order.test.ts
│
├── integration/            # 集成测试
│   ├── login.test.ts
│   └── payment.test.ts
│
└── e2e/                    # 端到端测试
    ├── checkout.test.ts
    └── user-journey.test.ts
```

---

### 8. scripts/ - 脚本工具

**用途**: 自动化脚本

**规则**:
```
✅ 正确:
/workspace/scripts/setup.sh
/workspace/scripts/deploy.sh

❌ 错误:
/workspace/setup.sh                 ← 应该放在 scripts/
/Users/nick/bin/...                 ← 禁止！
```

---

## 文件创建流程

### 创建文件前检查清单

```markdown
## 文件创建检查

### Step 1: 确认文件类型
- [ ] 这是什么类型的文件？
  - 代码 → apps/
  - 文档 → docs/
  - 知识 → knowledge/
  - 类型定义 → types/
  - 技能 → skills/
  - 记忆 → memory/
  - 测试 → tests/
  - 脚本 → scripts/

### Step 2: 确认具体位置
- [ ] 属于哪个业务系统？
- [ ] 前端还是后端？
- [ ] 什么类型的文档？

### Step 3: 检查目录是否存在
- [ ] 目录已存在
- [ ] 目录不存在，需要创建

### Step 4: 确认命名
- [ ] 文件名使用 kebab-case
- [ ] 目录名使用 kebab-case
- [ ] 组件使用 PascalCase
```

### 创建文件命令示例

```bash
# ✅ 正确：创建需求文档
mkdir -p /workspace/docs/requirements
touch /workspace/docs/requirements/shopping-cart.md

# ✅ 正确：创建业务代码
mkdir -p /workspace/apps/ecommerce/backend/src/routes
touch /workspace/apps/ecommerce/backend/src/routes/order.ts

# ✅ 正确：创建类型定义
touch /workspace/types/order.ts

# ❌ 错误：禁止在根目录创建
touch /workspace/shopping-cart.md          # 禁止！
touch /workspace/requirements.md           # 禁止！

# ❌ 错误：禁止在工作区外创建
touch /Users/nick/Desktop/test.ts          # 禁止！
touch /tmp/temp-code.ts                    # 禁止！
```

---

## Git 配置

### .gitignore

```gitignore
# 依赖
node_modules/
.pnpm-store/

# 构建输出
dist/
build/
.next/
out/

# 环境文件 (敏感信息)
.env
.env.local
.env.production
*.pem
*.key

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

# 不要忽略工作目录本身
# !workspace/
```

### Git 提交检查

```bash
# 提交前检查工作目录
git status

# 确认所有文件在正确位置
git diff --cached --name-only

# 如果有文件在错误位置，拒绝提交
if git diff --cached --name-only | grep -E "^(Desktop|Downloads|Documents)/"; then
  echo "❌ 错误：禁止提交工作区外的文件"
  exit 1
fi
```

---

## 违规处理

### 发现违规文件

```bash
# 检查工作区外是否有项目文件
find /Users/nick/Desktop -name "*.ts" -o -name "*.md" 2>/dev/null
find /Users/nick/Downloads -name "*.ts" -o -name "*.md" 2>/dev/null

# 如果发现违规文件，立即移动
mv /Users/nick/Desktop/test.ts /workspace/apps/ecommerce/
mv /Users/nick/Downloads/notes.md /workspace/docs/

# 清理空目录
rmdir /Users/nick/Desktop/test-project 2>/dev/null || true
```

### 定期检查

```bash
# 每周检查脚本
#!/bin/bash
# scripts/check-workspace.sh

echo "检查工作区外是否有项目文件..."

# 检查常见位置
for dir in Desktop Downloads Documents tmp; do
  files=$(find /Users/nick/$dir -name "*.ts" -o -name "*.md" 2>/dev/null | wc -l)
  if [ $files -gt 0 ]; then
    echo "⚠️  警告：/Users/nick/$dir 发现 $files 个项目文件"
  fi
done

echo "✅ 检查完成"
```

---

## AI 行为规范

### AI 创建文件规则

```
AI 创建文件时必须遵守:

1. 必须使用完整路径
   ✅ /workspace/docs/requirements/user-login.md
   ❌ docs/requirements/user-login.md (相对路径可能出错)

2. 必须先确认目录存在
   exec: ls -la /workspace/docs/requirements/
   如果不存在：exec: mkdir -p /workspace/docs/requirements/

3. 必须在提交前确认位置
   exec: git status
   确认文件在正确目录

4. 不确定时先询问
   "这个文件应该放在哪个目录？"
```

### AI 禁止行为

```
❌ AI 禁止:
• 在 /workspace 外创建文件
• 在 ~/.openclaw/ 其他目录创建工作文件
• 使用相对路径创建文件 (可能解析错误)
• 在临时目录创建持久化文件
• 在用户桌面创建文件
```

---

## 最佳实践

### 目录组织原则

```
1. 按功能分类，而非按文件类型
   ✅ apps/ecommerce/ (电商系统)
   ❌ typescript-files/ (所有 TS 文件)

2. 保持扁平，避免过深嵌套
   ✅ apps/ecommerce/frontend/
   ❌ apps/ecommerce/frontend/src/components/ui/buttons/primary/

3. 命名一致，使用 kebab-case
   ✅ user-login.md
   ❌ UserLogin.md / user_login.md

4. 及时清理，删除无用文件
   定期删除：tmp/ temp/ *.bak
```

### 文件命名规范

```
文档:
✅ user-login-requirements.md
❌ UserLogin.md / user_login.md

代码:
✅ user-service.ts
❌ UserService.ts / user_service.ts

组件:
✅ UserProfile.tsx
❌ user-profile.tsx / UserProfile.tsx (文件)

测试:
✅ user.test.ts
❌ user_test.ts / UserTest.ts
```

---

## 总结

### 核心要点

```
┌─────────────────────────────────────────────────────────────────┐
│                    工作目录铁律 (再次强调)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 所有工作文件必须在 /Users/nick/.openclaw/workspace          │
│                                                                 │
│  2. 严格按目录结构组织                                          │
│     apps/      - 业务代码                                       │
│     docs/      - 项目文档                                       │
│     knowledge/ - 知识库                                         │
│     skills/    - AI 技能                                        │
│     types/     - 类型定义                                       │
│     memory/    - 记忆文件                                       │
│     tests/     - 测试文件                                       │
│     scripts/   - 脚本工具                                       │
│                                                                 │
│  3. 创建文件前先确认位置                                        │
│                                                                 │
│  4. 定期清理违规文件                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 检查清单

```markdown
## 每日检查

- [ ] 没有文件在 /workspace 外
- [ ] 新文件放在正确目录
- [ ] 临时文件已清理
- [ ] Git 状态正常

## 每周检查

- [ ] 运行 workspace 检查脚本
- [ ] 清理无用文件
- [ ] 整理文档结构
- [ ] 更新索引文件
```

---

**文档维护**: 小虾米 (AI 助手)  
**最后更新**: 2026-03-28  
**执行级别**: ⚠️ 强制执行

**违规处理**: 发现违规文件立即移动到正确位置，并记录到 memory/ai-feedback/workspace-violations.md
