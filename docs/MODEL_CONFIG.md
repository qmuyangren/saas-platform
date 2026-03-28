# 模型配置指南

## 推荐配置

### 混合模型策略 ⭐⭐ (推荐)

**根据角色能力需求分配最优模型：**

```yaml
# skills/product-ceo/SKILL.md
model: bailian/qwen3.5-plus        # 综合能力最强

# skills/architect/SKILL.md
model: bailian/qwen3-max-2026-01-23  # 推理能力最强 ⭐

# skills/developer/SKILL.md
model: bailian/qwen3-coder-next    # 代码能力最强 ⭐

# skills/qa-lead/SKILL.md
model: bailian/qwen3.5-plus        # 综合能力最强

# skills/release-engineer/SKILL.md
model: bailian/qwen3.5-plus        # 综合能力最强
```

## 模型能力对比

| 模型 | 优势 | 适合角色 |
|------|------|----------|
| **qwen3.5-plus** | 综合能力最强，1M 上下文 | Product CEO, QA Lead, Release Engineer |
| **qwen3-max-2026-01-23** | 推理能力最强 | Architect (架构设计) |
| **qwen3-coder-next** | 代码能力最强 | Developer (代码实现) |
| **qwen3-coder-plus** | 代码能力强，1M 上下文 | Developer (备选) |

## 为什么混合模型？

### 问题：多模型导致理解不一致

```
场景：使用不同模型

Product CEO (GPT-4):
  输出需求文档："用户登录需要邮箱验证"

Architect (Claude):
  理解为："需要邮箱 + 手机验证" ← 理解偏差！

Developer (qwen3.5-plus):
  实现为："只需要密码登录" ← 又理解错了！

QA Lead (GPT-3.5):
  测试用例："测试手机验证码" ← 完全错了！

结果：需求传递层层失真，最终产品和需求不符
```

### 解决：统一模型保证一致性

```
场景：全部使用 qwen3.5-plus

Product CEO (qwen3.5-plus):
  输出需求文档："用户登录需要邮箱验证"
       ↓ (同一模型，理解一致)
Architect (qwen3.5-plus):
  设计架构："邮箱验证流程"
       ↓ (同一模型，上下文连贯)
Developer (qwen3.5-plus):
  实现："邮箱验证登录"
       ↓ (同一模型，风格统一)
QA Lead (qwen3.5-plus):
  测试："验证邮箱验证流程"

结果：需求传递准确，产品符合预期
```

## 模型能力要求

| 角色 | 能力要求 | 推荐模型 |
|------|----------|----------|
| **Product CEO** | 需求理解、逻辑推理、提问能力 | qwen3.5-plus |
| **Architect** | 系统设计、技术选型、抽象能力 | qwen3.5-plus |
| **Developer** | 代码实现、调试能力、测试编写 | qwen3.5-plus |
| **QA Lead** | 测试设计、边界分析、探索性测试 | qwen3.5-plus |
| **Release Engineer** | 部署流程、监控设置、文档能力 | qwen3.5-plus |

## 模型配置位置

### 在技能中配置

每个技能的 `SKILL.md` 文件中：

```markdown
---
name: product-ceo
description: "产品需求分析"
model: qwen3.5-plus  ← 模型配置
---
```

### 在 ClawTeam 中配置

使用 ClawTeam 启动 Agent 时：

```bash
clawteam spawn -t saas-dev -n backend \
  --task "使用 developer 技能实现登录功能" \
  --model qwen3.5-plus
```

## 模型选择原则

### 关键角色必须用强模型

```
✅ 必须用强模型的角色：
• Product CEO - 需求理解错误会导致全盘皆错
• Architect - 架构设计错误会导致返工
• Developer - 代码质量直接影响产品

⚠️ 可以用中等模型的角色：
• QA Lead - 测试逻辑相对简单
• Release Engineer - 部署流程相对固定
```

### 不要为了省钱用弱模型

```
❌ 错误做法：
Product CEO → 用弱模型 (省 $0.5)
结果：需求理解错误，返工成本 $500

✅ 正确做法：
Product CEO → 用强模型 (花 $0.5)
结果：需求准确，避免返工
```

## 模型切换策略

### 根据项目阶段调整

```
阶段 1: 需求/设计阶段
• Product CEO: qwen3.5-plus (强模型)
• Architect: qwen3.5-plus (强模型)
• 其他：暂不启动

阶段 2: 开发阶段
• Developer: qwen3.5-plus (强模型)
• 其他：暂不启动

阶段 3: 测试阶段
• QA Lead: qwen3.5-plus (强模型)
• Developer: qwen3.5-plus (修复 Bug)

阶段 4: 部署阶段
• Release Engineer: qwen3.5-plus (强模型)
```

### 根据任务复杂度调整

```
简单任务 (可以用中等模型)：
• 文档格式化
• 代码格式化
• 简单 Bug 修复

中等任务 (用强模型)：
• 功能实现
• 测试用例设计
• 架构优化

复杂任务 (必须用最强模型)：
• 需求分析
• 架构设计
• 复杂 Bug 调试
• 性能优化
```

## 成本估算

### 统一模型成本 (全部 qwen3.5-plus)

```
单个功能开发 (如用户登录):

Product CEO:   $0.5  (需求分析)
Architect:     $0.5  (架构设计)
Developer:     $2.0  (代码实现 + 测试)
QA Lead:       $0.5  (测试验证)
Release:       $0.3  (部署)
────────────────────────
总计：        $3.8
```

### 多模型成本 (混合使用)

```
单个功能开发 (如用户登录):

Product CEO:   $1.0  (GPT-4 - 最贵)
Architect:     $0.8  (Claude)
Developer:     $1.5  (qwen3.5-plus)
QA Lead:       $0.3  (GPT-3.5 - 便宜但容易出错)
Release:       $0.3  (qwen3.5-plus)
────────────────────────
总计：        $3.9

风险：理解不一致导致返工，实际成本更高
```

## 最佳实践

### 1. 统一模型

所有角色使用 `qwen3.5-plus`，保证理解一致。

### 2. 共享记忆

使用 LanceDB 共享记忆，所有角色看到相同上下文。

```bash
# 所有角色启动时加载共享记忆
memory_recall(collection="saas-platform-context")
```

### 3. 上下文传递

每个角色的输出自动成为下一个角色的输入。

```
Product CEO 输出 → docs/requirements/user-login.md
       ↓
Architect 读取 → docs/architecture/user-login.md
       ↓
Developer 读取 → apps/*/src/*
       ↓
QA Lead 读取 → tests/*
```

### 4. 验收标准

每个角色完成后必须通过验收才能进入下一阶段。

```
Product CEO: 用户确认需求文档
Architect: 架构图 + 错误路径完整
Developer: 启动验证 + Chrome MCP + 测试通过
QA Lead: 测试报告完整
Release: 部署验证通过
```

## 故障排查

### 问题：角色输出和需求不符

```
可能原因：
1. 模型能力不足 → 升级到 qwen3.5-plus
2. 上下文缺失 → 检查共享记忆配置
3. 技能描述不清 → 优化 SKILL.md

解决方法：
1. 统一使用 qwen3.5-plus
2. 确保共享记忆正确配置
3. 优化技能的工作流程描述
```

### 问题：角色之间理解不一致

```
可能原因：
1. 使用不同模型 → 统一模型
2. 上下文不共享 → 配置 LanceDB
3. 文档传递断裂 → 检查文档路径

解决方法：
1. 全部改为 qwen3.5-plus
2. 配置共享记忆集合
3. 确保文档路径正确
```

## 总结

**核心原则：统一模型 + 共享记忆 + 上下文传递**

- ✅ 所有角色使用 `qwen3.5-plus`
- ✅ 使用 LanceDB 共享记忆
- ✅ 每个角色的输出自动传递给下一角色
- ✅ 每个角色完成后必须验收

这样可以保证：
- 理解一致
- 上下文连贯
- 输出质量稳定
- 调试简单
