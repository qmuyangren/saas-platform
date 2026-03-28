# SaaS 平台角色技能

这是为 Nick 的 SaaS 平台项目定制的 AI 角色技能，借鉴了 GStack 的核心理念，适配 OpenClaw。

## 技能列表

| 技能 | 职责 | 借鉴 |
|------|------|------|
| **product-ceo** | 产品需求分析，挑战前提，输出需求文档 | /office-hours + /plan-ceo-review |
| **architect** | 架构设计，ASCII 图，错误路径映射 | /plan-eng-review |
| **developer** | 全栈开发 + 启动验证 + Chrome MCP 联调 | 实现 + 测试 |
| **qa-lead** | 深度测试，性能测试，回归测试 | /qa |
| **release-engineer** | 部署，文档同步，监控设置 | /ship + /document-release |

## 工作流程

```
Product CEO → Architect → Developer → QA Lead → Release Engineer
    ↓             ↓           ↓           ↓            ↓
 需求文档     架构设计    实现 + 测试   测试报告    发布部署
```

## 核心特点

### 1. 项目启动验证 (Developer)

```
✅ 后端启动成功
✅ 前端启动成功
✅ 数据库连接正常
✅ 无启动错误
```

**启动失败 = 开发未完成**

### 2. Chrome MCP 联调测试 (Developer + QA)

```
• 前端页面验证
• 网络请求验证
• 控制台错误检查
• 本地存储验证
```

### 3. 文档驱动

每个角色输出标准化文档：
- 需求文档
- 架构文档
- 验收报告
- 测试报告
- 发布报告

### 4. 类型共享

所有角色共享 `types/` 目录的类型定义，保证前后端一致。

## 使用示例

### 启动 Product CEO

```
"我想做个用户登录功能"
→ 调用 product-ceo 技能
→ 输出：docs/requirements/user-login.md
```

### 启动 Architect

```
"根据需求文档设计架构"
→ 调用 architect 技能
→ 输出：docs/architecture/user-login.md
```

### 启动 Developer

```
"实现登录功能"
→ 调用 developer 技能
→ 输出：
  - apps/*/src/* (代码)
  - tests/* (测试)
  - 验收报告 (启动验证 + Chrome MCP)
```

## 与 GStack 的区别

| 维度 | GStack | 本技能集 |
|------|--------|----------|
| 复杂度 | 2000+ 行/技能 | 200-300 行/技能 |
| 环境检查 | 复杂 Preamble | 无 |
| 遥测 | 强制日志 | 无 |
| AskUserQuestion | 严格格式 | 自由交互 |
| 外部依赖 | 二进制脚本 | OpenClaw 内置工具 |

## 下一步

1. 用这些技能跑通第一个功能 (用户登录)
2. 根据实践反馈优化技能
3. 添加更多角色技能 (Designer 等)

---

最后更新：2026-03-28
