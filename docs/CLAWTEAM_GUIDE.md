# ClawTeam + SaaS 平台使用指南

> 基于 ClawTeam 多 Agent 协作系统的 SaaS 平台开发工作流

**版本**: v1.0  
**更新时间**: 2026-03-28  
**适用项目**: SaaS 平台及所有业务子系统

---

## 目录

1. [快速开始](#1-快速开始)
2. [角色与职责](#2-角色与职责)
3. [使用场景](#3-使用场景)
4. [最佳实践](#4-最佳实践)
5. [常见问题](#5-常见问题)

---

## 1. 快速开始

### 1.1 环境准备

```bash
# 安装 ClawTeam
npm install -g clawteam

# 验证安装
clawteam --version

# 配置模型 (可选，使用默认配置)
clawteam config set model bailian/qwen3.5-plus
```

### 1.2 创建第一个团队

```bash
# 创建 SaaS 开发团队
clawteam team spawn-team saas-dev -d "SaaS 平台开发团队" -n leader

# 查看团队列表
clawteam team list

# 查看团队看板
clawteam board show saas-dev
```

### 1.3 创建第一个任务

```bash
# 创建需求分析任务
clawteam task create saas-dev "用户登录功能需求分析" -o leader

# 创建架构设计任务
clawteam task create saas-dev "用户登录系统架构设计" -o architect

# 查看任务列表
clawteam task list saas-dev
```

### 1.4 启动 Agent 执行任务

```bash
# 启动 Product CEO Agent
clawteam spawn -t saas-dev -n leader \
  --task "使用 product-ceo 技能分析用户登录功能需求" \
  --model bailian/qwen3.5-plus

# 启动 Architect Agent
clawteam spawn -t saas-dev -n architect \
  --task "使用 architect 技能设计用户登录系统架构" \
  --model bailian/qwen3-max-2026-01-23

# 启动 Developer Agent
clawteam spawn -t saas-dev -n backend \
  --task "使用 developer 技能实现用户登录功能" \
  --model bailian/qwen3-coder-next
```

---

## 2. 角色与职责

### 2.1 角色列表

| 角色 | 技能 | 模型 | 职责 |
|------|------|------|------|
| **Product CEO** | product-ceo | qwen3.5-plus | 需求分析、优先级排序、用户故事 |
| **Architect** | architect | qwen3-max-2026-01-23 | 架构设计、技术选型、数据流设计 |
| **Developer** | developer | qwen3-coder-next | 代码实现、单元测试、项目启动 |
| **QA Lead** | qa-lead | qwen3.5-plus | 测试设计、质量验证、回归测试 |
| **Release Engineer** | release-engineer | qwen3.5-plus | 部署、监控、文档同步 |

### 2.2 角色工作流程

```
┌─────────────┐
│ Product CEO │ 需求分析 → 输出需求文档
└──────┬──────┘
       ↓
┌─────────────┐
│ Architect   │ 架构设计 → 输出架构文档
└──────┬──────┘
       ↓
┌─────────────┐
│ Developer   │ 代码实现 → 输出可运行代码
└──────┬──────┘
       ↓
┌─────────────┐
│ QA Lead     │ 测试验证 → 输出测试报告
└──────┬──────┘
       ↓
┌─────────────┐
│ Release     │ 部署上线 → 输出部署报告
│ Engineer    │
└─────────────┘
```

---

## 3. 使用场景

### 场景 1: 需求增加、修改、删除

**触发条件**: 用户提出新需求/变更需求/取消需求

**流程**:
```
1. 用户提出需求变更
   ↓
2. Product CEO 分析需求
   • 评估需求价值
   • 确定优先级
   • 更新需求文档
   ↓
3. Architect 评估影响
   • 架构影响分析
   • 工作量评估
   ↓
4. 更新任务看板
   • 创建/修改/删除任务
   • 调整优先级
```

**命令示例**:
```bash
# 创建需求分析任务
clawteam task create saas-dev "新增购物车功能需求分析" -o leader

# 启动 Product CEO
clawteam spawn -t saas-dev -n leader \
  --task "使用 product-ceo 技能分析购物车功能需求"

# 需求文档输出位置
docs/requirements/shopping-cart.md
```

**输出文档**:
- `docs/requirements/[功能名].md` - 需求文档
- `docs/change-log.md` - 变更日志

---

### 场景 2: 增加任务

**触发条件**: 需求分解为任务/临时任务插入

**流程**:
```
1. Product CEO 分解需求为任务
   ↓
2. 创建任务到看板
   ↓
3. 分配角色和优先级
   ↓
4. 启动 Agent 执行
```

**命令示例**:
```bash
# 批量创建任务
clawteam task create saas-dev "实现登录页面" -o frontend --priority high
clawteam task create saas-dev "实现登录 API" -o backend --priority high
clawteam task create saas-dev "编写登录测试" -o tester --priority medium

# 查看任务看板
clawteam board show saas-dev

# 启动任务执行
clawteam spawn -t saas-dev -n backend \
  --task "实现登录 API" \
  --model bailian/qwen3-coder-next
```

---

### 场景 3: 调整技术框架

**触发条件**: 技术选型变更/框架升级/技术债务处理

**流程**:
```
1. Architect 提出技术方案
   ↓
2. Product CEO 评估业务影响
   ↓
3. Developer 评估工作量
   ↓
4. 全员确认后执行
   ↓
5. 逐步迁移/一次性切换
```

**命令示例**:
```bash
# 创建技术评估任务
clawteam task create saas-dev "评估从 Fastify 迁移到 NestJS" -o architect

# 启动 Architect 分析
clawteam spawn -t saas-dev -n architect \
  --task "分析 Fastify → NestJS 迁移方案" \
  --model bailian/qwen3-max-2026-01-23

# 输出文档
docs/architecture/migration-plan.md
```

**输出文档**:
- `docs/architecture/[技术方案].md` - 技术方案文档
- `docs/migration/[迁移计划].md` - 迁移计划

---

### 场景 4: UI 设计与前端开发关联

**触发条件**: UI 设计完成/设计变更/前端实现

**流程**:
```
1. UI 设计稿完成 (Figma/即时设计)
   ↓
2. Architect 设计组件结构
   ↓
3. Developer 实现组件
   ↓
4. QA 验证 UI 还原度
```

**命令示例**:
```bash
# 创建 UI 实现任务
clawteam task create saas-dev "实现登录页面组件" -o frontend \
  --attachment figma-design-url

# 启动 Developer
clawteam spawn -t saas-dev -n frontend \
  --task "根据设计稿实现登录页面组件" \
  --model bailian/qwen3-coder-next
```

**输出文件**:
- `apps/*/src/components/[组件名].tsx` - 组件代码
- `apps/*/src/styles/[组件名].css` - 样式文件

---

### 场景 5: 前端框架搭建

**触发条件**: 新项目启动/前端架构初始化

**流程**:
```
1. Architect 设计前端架构
   ↓
2. Developer 搭建项目骨架
   ↓
3. 配置工具链 (Vite/Webpack)
   ↓
4. 集成 UI 组件库
   ↓
5. 验证启动成功
```

**命令示例**:
```bash
# 创建前端框架搭建任务
clawteam task create saas-dev "搭建 React 前端框架" -o frontend

# 启动 Developer
clawteam spawn -t saas-dev -n frontend \
  --task "使用 Vite + React + TypeScript 搭建前端框架" \
  --model bailian/qwen3-coder-next
```

**输出文件**:
- `apps/*/package.json` - 项目配置
- `apps/*/vite.config.ts` - 构建配置
- `apps/*/src/main.tsx` - 入口文件

---

### 场景 6: 增删改前端组件

**触发条件**: 新功能需要组件/组件重构/组件删除

**流程**:
```
1. 分析组件需求
   ↓
2. 设计组件 API
   ↓
3. 实现组件代码
   ↓
4. 编写组件文档
   ↓
5. 单元测试
```

**命令示例**:
```bash
# 创建组件开发任务
clawteam task create saas-dev "创建 Button 组件" -o frontend

# 启动 Developer
clawteam spawn -t saas-dev -n frontend \
  --task "创建可复用的 Button 组件，支持多种变体" \
  --model bailian/qwen3-coder-next
```

**输出文件**:
- `apps/*/src/components/Button/Button.tsx`
- `apps/*/src/components/Button/index.ts`
- `apps/*/src/components/Button/Button.test.tsx`

---

### 场景 7: 前端业务逻辑

**触发条件**: 前端需要处理业务逻辑/状态管理/API 调用

**流程**:
```
1. 分析业务逻辑
   ↓
2. 设计状态管理方案
   ↓
3. 实现业务逻辑层
   ↓
4. 集成到组件
   ↓
5. 测试验证
```

**命令示例**:
```bash
# 创建业务逻辑任务
clawteam task create saas-dev "实现用户登录状态管理" -o frontend

# 启动 Developer
clawteam spawn -t saas-dev -n frontend \
  --task "使用 Zustand 实现登录状态管理" \
  --model bailian/qwen3-coder-next
```

**输出文件**:
- `apps/*/src/stores/authStore.ts` - 状态管理
- `apps/*/src/hooks/useAuth.ts` - 自定义 Hook

---

### 场景 8: 后端 API 与前端 API 对接

**触发条件**: 前后端联调/API 变更/接口调试

**流程**:
```
1. 定义 API 规范 (OpenAPI/Swagger)
   ↓
2. 后端实现 API
   ↓
3. 前端调用 API
   ↓
4. 联调测试
   ↓
5. 修复问题
```

**命令示例**:
```bash
# 创建 API 对接任务
clawteam task create saas-dev "登录 API 前后端对接" -o backend

# 启动 Developer (后端)
clawteam spawn -t saas-dev -n backend \
  --task "实现登录 API 并生成 OpenAPI 文档" \
  --model bailian/qwen3-coder-next

# 启动 Developer (前端)
clawteam spawn -t saas-dev -n frontend \
  --task "根据 OpenAPI 文档实现前端 API 调用" \
  --model bailian/qwen3-coder-next
```

**输出文件**:
- `apps/backend/src/routes/auth.ts` - 后端 API
- `apps/frontend/src/api/auth.ts` - 前端 API 调用
- `docs/api/auth.yaml` - API 文档

---

### 场景 9: 前端选择 UI 框架

**触发条件**: 新项目 UI 选型/现有框架评估

**流程**:
```
1. 列出候选框架
   ↓
2. 评估标准 (学习曲线/组件丰富度/性能)
   ↓
3. POC 验证
   ↓
4. 团队决策
   ↓
5. 集成到项目
```

**命令示例**:
```bash
# 创建 UI 框架评估任务
clawteam task create saas-dev "评估 UI 框架 (Ant Design vs MUI)" -o architect

# 启动 Architect
clawteam spawn -t saas-dev -n architect \
  --task "对比 Ant Design 和 MUI，给出推荐方案" \
  --model bailian/qwen3-max-2026-01-23
```

**输出文档**:
- `docs/architecture/ui-framework-selection.md` - 选型报告

---

### 场景 10: 前后端代码错误需要调整

**触发条件**: Bug 报告/测试失败/用户反馈

**流程**:
```
1. 复现问题
   ↓
2. 定位问题 (前端/后端/网络)
   ↓
3. 修复代码
   ↓
4. 测试验证
   ↓
5. 部署上线
```

**命令示例**:
```bash
# 创建 Bug 修复任务
clawteam task create saas-dev "修复登录失败问题" -o backend --priority critical

# 启动 Developer
clawteam spawn -t saas-dev -n backend \
  --task "修复登录 API 的 Token 验证问题" \
  --model bailian/qwen3-coder-next
```

**输出文件**:
- `apps/*/src/**/*` - 修复的代码
- `tests/**/*.test.ts` - 回归测试

---

### 场景 11: 项目目录管理

**触发条件**: 新项目初始化/目录重构/文件组织

**流程**:
```
1. 设计目录结构
   ↓
2. 创建目录骨架
   ↓
3. 配置路径别名
   ↓
4. 文档化目录规范
```

**命令示例**:
```bash
# 创建项目目录任务
clawteam task create saas-dev "初始化项目目录结构" -o architect

# 启动 Architect
clawteam spawn -t saas-dev -n architect \
  --task "设计 SaaS 平台 Monorepo 目录结构" \
  --model bailian/qwen3-max-2026-01-23
```

**输出文档**:
- `PROJECT_STRUCTURE.md` - 目录结构规范
- `apps/`, `docs/`, `knowledge/` - 实际目录

---

### 场景 12: 数据库设计与变更

**触发条件**: 新表创建/字段修改/索引优化

**流程**:
```
1. 分析数据需求
   ↓
2. 设计 ER 图
   ↓
3. 编写迁移脚本
   ↓
4. 执行迁移
   ↓
5. 验证数据完整性
```

**命令示例**:
```bash
# 创建数据库设计任务
clawteam task create saas-dev "设计用户表结构" -o backend

# 启动 Architect
clawteam spawn -t saas-dev -n architect \
  --task "设计用户系统数据库 schema" \
  --model bailian/qwen3-max-2026-01-23
```

**输出文件**:
- `apps/backend/prisma/schema.prisma` - 数据库 Schema
- `apps/backend/prisma/migrations/*` - 迁移脚本

---

### 场景 13: 后端业务逻辑开发

**触发条件**: 新功能后端实现/业务规则变更

**流程**:
```
1. 分析业务规则
   ↓
2. 设计 Service 层
   ↓
3. 实现业务逻辑
   ↓
4. 单元测试
   ↓
5. 集成测试
```

**命令示例**:
```bash
# 创建业务逻辑任务
clawteam task create saas-dev "实现用户注册逻辑" -o backend

# 启动 Developer
clawteam spawn -t saas-dev -n backend \
  --task "实现用户注册 Service，包含邮箱验证" \
  --model bailian/qwen3-coder-next
```

---

### 场景 14: API 版本管理

**触发条件**: API 升级/向后兼容/版本迁移

**流程**:
```
1. 设计新版本 API
   ↓
2. 实现向后兼容
   ↓
3. 通知前端团队
   ↓
4. 逐步迁移
   ↓
5. 废弃旧版本
```

---

### 场景 15: 单元测试编写

**触发条件**: 新功能完成/代码重构/覆盖率提升

**流程**:
```
1. 确定测试范围
   ↓
2. 编写测试用例
   ↓
3. 执行测试
   ↓
4. 修复失败测试
   ↓
5. 覆盖率报告
```

**命令示例**:
```bash
# 创建测试任务
clawteam task create saas-dev "编写登录功能单元测试" -o tester

# 启动 QA Lead
clawteam spawn -t saas-dev -n tester \
  --task "为登录功能编写单元测试，覆盖率≥80%" \
  --model bailian/qwen3.5-plus
```

---

### 场景 16: 集成测试

**触发条件**: 功能完成/发布前验证/端到端测试

**流程**:
```
1. 设计测试场景
   ↓
2. 编写测试脚本
   ↓
3. 执行测试
   ↓
4. 修复问题
   ↓
5. 测试报告
```

---

### 场景 17: Bug 修复流程

**触发条件**: Bug 报告/测试失败/用户反馈

**流程**:
```
1. 记录 Bug (优先级/严重程度)
   ↓
2. 复现问题
   ↓
3. 定位原因
   ↓
4. 修复代码
   ↓
5. 验证修复
   ↓
6. 回归测试
```

---

### 场景 18: 项目部署上线

**触发条件**: 功能完成/版本发布/定时发布

**流程**:
```
1. 构建生产版本
   ↓
2. 运行测试
   ↓
3. 部署到测试环境
   ↓
4. 验证
   ↓
5. 部署到生产环境
   ↓
6. 监控
```

**命令示例**:
```bash
# 创建部署任务
clawteam task create saas-dev "部署到生产环境" -o devops

# 启动 Release Engineer
clawteam spawn -t saas-dev -n devops \
  --task "部署 SaaS 平台到生产环境" \
  --model bailian/qwen3.5-plus
```

---

### 场景 19: 监控与日志配置

**触发条件**: 新项目上线/性能优化/问题排查

**流程**:
```
1. 确定监控指标
   ↓
2. 配置监控工具
   ↓
3. 设置告警规则
   ↓
4. 配置日志收集
   ↓
5. 验证监控
```

---

### 场景 20: 紧急问题处理 (Hotfix)

**触发条件**: 线上故障/安全漏洞/严重 Bug

**流程**:
```
1. 确认问题严重性
   ↓
2. 创建 Hotfix 分支
   ↓
3. 快速修复
   ↓
4. 紧急测试
   ↓
5. 热修复部署
   ↓
6. 事后复盘
```

---

### 场景 21: 版本发布与回滚

**触发条件**: 定期发布/功能完成/问题回滚

**流程**:
```
1. 准备发布说明
   ↓
2. 打版本标签
   ↓
3. 构建发布包
   ↓
4. 部署
   ↓
5. 验证
   ↓
6. (可选) 回滚
```

---

### 场景 22: 代码审查 (Code Review)

**触发条件**: PR 提交/重要代码变更/团队规范

**流程**:
```
1. 创建 PR
   ↓
2. 自动检查 (CI)
   ↓
3. 人工审查
   ↓
4. 修改意见
   ↓
5. 合并
```

---

### 场景 23: 多 Agent 协作

**触发条件**: 复杂任务/跨角色工作/任务交接

**流程**:
```
1. 分解任务为子任务
   ↓
2. 分配给不同角色
   ↓
3. 并行执行
   ↓
4. 结果汇总
   ↓
5. 集成验证
```

**命令示例**:
```bash
# 创建多角色任务
clawteam task create saas-dev "用户系统开发" -o leader \
  --subtasks "需求分析，架构设计，代码实现，测试"

# 启动多个 Agent
clawteam spawn -t saas-dev -n leader --task "需求分析"
clawteam spawn -t saas-dev -n architect --task "架构设计"
clawteam spawn -t saas-dev -n backend --task "代码实现"
clawteam spawn -t saas-dev -n tester --task "测试"
```

---

### 场景 24: 需求优先级调整

**触发条件**: 紧急需求插入/资源变化/业务调整

**流程**:
```
1. 评估新需求优先级
   ↓
2. 调整任务看板
   ↓
3. 通知团队
   ↓
4. 重新分配资源
```

---

### 场景 25: 技术债务处理

**触发条件**: 代码质量下降/性能问题/重构需求

**流程**:
```
1. 识别技术债务
   ↓
2. 评估影响
   ↓
3. 制定重构计划
   ↓
4. 执行重构
   ↓
5. 验证
```

---

### 场景 26: 安全审计

**触发条件**: 发布前检查/定期审计/安全事件

**流程**:
```
1. 安全扫描
   ↓
2. 漏洞评估
   ↓
3. 修复漏洞
   ↓
4. 重新扫描
   ↓
5. 安全报告
```

---

### 场景 27: 数据迁移

**触发条件**: 数据库变更/系统迁移/数据整合

**流程**:
```
1. 设计迁移方案
   ↓
2. 备份数据
   ↓
3. 执行迁移
   ↓
4. 验证数据
   ↓
5. 清理旧数据
```

---

### 场景 28: 权限管理

**触发条件**: 新用户加入/角色变更/权限审计

**流程**:
```
1. 定义权限模型
   ↓
2. 配置权限
   ↓
3. 测试权限
   ↓
4. 审计日志
```

---

### 场景 29: 文档编写与更新

**触发条件**: 功能完成/变更发生/定期更新

**流程**:
```
1. 确定文档类型
   ↓
2. 编写文档
   ↓
3. 审查文档
   ↓
4. 发布文档
```

---

### 场景 30: 复盘与知识沉淀

**触发条件**: 项目完成/阶段结束/问题解决

**流程**:
```
1. 收集反馈
   ↓
2. 分析得失
   ↓
3. 总结经验
   ↓
4. 更新知识库
   ↓
5. 分享团队
```

**命令示例**:
```bash
# 创建复盘任务
clawteam task create saas-dev "用户登录功能复盘" -o leader

# 启动 Product CEO
clawteam spawn -t saas-dev -n leader \
  --task "总结用户登录功能开发的经验教训" \
  --model bailian/qwen3.5-plus
```

**输出文档**:
- `knowledge/retrospectives/[项目名].md` - 复盘文档
- `knowledge/lessons-learned.md` - 经验总结

---

## 4. 最佳实践

### 4.1 任务分解原则

- ✅ 每个任务不超过 4 小时工作量
- ✅ 任务有明确的验收标准
- ✅ 任务之间有清晰的依赖关系
- ✅ 优先完成关键路径任务

### 4.2 文档规范

- ✅ 需求文档用结构化模板
- ✅ 架构文档包含流程图
- ✅ 代码文档包含示例
- ✅ 所有文档版本化

### 4.3 沟通规范

- ✅ 任务状态及时更新
- ✅ 阻塞问题立即上报
- ✅ 变更需求书面记录
- ✅ 决策记录归档

### 4.4 质量保障

- ✅ 代码审查必做
- ✅ 单元测试覆盖率≥80%
- ✅ 集成测试覆盖关键路径
- ✅ 发布前回归测试

---

## 5. 常见问题

### Q1: 如何选择合适的模型？

**A**: 
- 需求分析/测试/部署 → qwen3.5-plus
- 架构设计 → qwen3-max-2026-01-23
- 代码实现 → qwen3-coder-next

### Q2: 任务执行失败怎么办？

**A**:
1. 查看错误日志
2. 检查模型配置
3. 简化任务描述
4. 分步骤执行

### Q3: 如何管理多个团队？

**A**:
```bash
# 列出所有团队
clawteam team list

# 查看特定团队看板
clawteam board show [团队名]

# 跨团队协作
clawteam task create [团队 A] "任务描述" --depends-on [团队 B 任务]
```

### Q4: 如何保证输出质量？

**A**:
1. 使用结构化提示词
2. 设置验收标准
3. 人工审查关键输出
4. 建立反馈循环

### Q5: 如何优化成本？

**A**:
1. 合理分配模型 (强模型用在刀刃上)
2. 任务分解细化 (减少重复计算)
3. 使用缓存 (共享记忆)
4. 批量处理任务

---

## 附录

### A. 命令速查表

```bash
# 团队管理
clawteam team spawn-team [名称] -d "[描述]"
clawteam team list
clawteam team delete [名称]

# 任务管理
clawteam task create [团队] "[任务]" -o [角色]
clawteam task list [团队]
clawteam task delete [团队] [任务 ID]

# Agent 执行
clawteam spawn -t [团队] -n [角色] --task "[任务]"

# 看板
clawteam board show [团队]
clawteam board update [团队] [任务 ID] --status [状态]
```

### B. 文档模板位置

- 需求文档：`docs/templates/requirements.md`
- 架构文档：`docs/templates/architecture.md`
- 测试文档：`docs/templates/testing.md`
- 复盘文档：`docs/templates/retrospective.md`

### C. 技能文档位置

- Product CEO: `skills/product-ceo/SKILL.md`
- Architect: `skills/architect/SKILL.md`
- Developer: `skills/developer/SKILL.md`
- QA Lead: `skills/qa-lead/SKILL.md`
- Release Engineer: `skills/release-engineer/SKILL.md`

---

**文档维护**: 小虾米 (AI 助手)  
**最后更新**: 2026-03-28
