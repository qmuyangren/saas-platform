# 需求文档索引

> 开发者快速查找对应需求文档

**版本**: v1.0  
**更新时间**: 2026-03-28

---

## 快速导航

### 🎯 我是前端开发者

**你需要看的文档**：

| 任务 | 需求文档 | 章节 | 状态 |
|------|----------|------|------|
| 后台管理前端 v3.0 | [admin-frontend-v3.md](admin-frontend-v3.md) | 全部 | ⏳ 开发中 |
| 标签页功能 | admin-frontend-v3.md | 1.1 + 3.1 | ⏳ 待开发 |
| 主题切换功能 | admin-frontend-v3.md | 1.2 + 3.2 | ⏳ 待开发 |
| 菜单搜索功能 | admin-frontend-v3.md | 1.3 + 3.3 | ⏳ 待开发 |

**开发流程**：
```
1. 阅读需求文档 → 2. 创建 ClawTeam 任务 → 3. 开发 → 4. 自测 → 5. 提交
```

---

### 🔧 我是后端开发者

**你需要看的文档**：

| 任务 | 需求文档 | 章节 | 状态 |
|------|----------|------|------|
| 认证 API | [user-login-v2.2.md](user-login-v2.2.md) | 功能需求 | ✅ 已完成 |
| 用户管理 API | [user-login-v2.2.md](user-login-v2.2.md) | 功能需求 | ⏳ 待开发 |
| 系统配置 API | [system-config-tables.md](system-config-tables.md) | 表结构 | ⏳ 待开发 |
| 字典管理 API | [oauth-config-tables.md](oauth-config-tables.md) | 表结构 | ⏳ 待开发 |

**开发流程**：
```
1. 阅读需求文档 → 2. 查看数据库设计 → 3. 创建 ClawTeam 任务 → 4. 开发 → 5. 自测 → 6. 提交
```

---

## 文档分类

### 01-requirements/ 需求文档

| 文档 | 说明 | 对应模块 | 开发者 |
|------|------|----------|--------|
| [admin-frontend-v3.md](admin-frontend-v3.md) | 后台管理前端 v3.0 | 前端 | frontend-team |
| [user-login-v2.2.md](user-login-v2.2.md) | 用户登录 v2.2 | 后端 + 前端 | fullstack-team |
| [system-config-tables.md](system-config-tables.md) | 系统配置表设计 | 后端 | backend-team |
| [oauth-config-tables.md](oauth-config-tables.md) | OAuth 配置表设计 | 后端 | backend-team |
| [basic-business-tables.md](basic-business-tables.md) | 基础业务表设计 | 后端 | backend-team |
| [ip-blacklist-config.md](ip-blacklist-config.md) | IP 黑名单设计 | 后端 | backend-team |

### 02-technical/ 技术文档

| 文档 | 说明 | 读者 |
|------|------|------|
| [nestjs-enterprise-capabilities.md](nestjs-enterprise-capabilities.md) | NestJS 企业级能力清单 | 后端开发者 |
| [database-design.md](02-technical/database-design.md) | 数据库设计 | 后端开发者 |
| [api-specifications.md](02-technical/api-specifications.md) | API 接口规范 | 前后端开发者 |

### 03-guides/ 使用指南

| 文档 | 说明 | 读者 |
|------|------|------|
| [CLAWTEAM_GUIDE.md](03-guides/CLAWTEAM_GUIDE.md) | ClawTeam 使用指南 | 所有开发者 |
| [GIT_WORKFLOW.md](03-guides/GIT_WORKFLOW.md) | Git 工作流 | 所有开发者 |

---

## ClawTeam 任务关联

### 当前任务

| 任务 ID | 任务名称 | 关联文档 | 负责人 | 状态 |
|---------|----------|----------|--------|------|
| 325e1a8b | 前端需求文档 v3.0 评审 | admin-frontend-v3.md | leader | ✅ 已完成 |
| 0adc8f6b | 第二阶段：核心组件开发 | admin-frontend-v3.md | developer | ✅ 已完成 |

### 如何创建关联文档的任务

```bash
# 创建任务时指定文档
clawteam task create admin-frontend "任务名称" \
  -o developer \
  --description "任务描述" \
  --docs "docs/01-requirements/admin-frontend-v3.md"
```

---

## 开发者自检清单

### 开发前

```
- [ ] 我已阅读对应需求文档
- [ ] 我了解验收标准
- [ ] 我已创建 ClawTeam 任务
- [ ] 任务已关联需求文档
```

### 开发后

```
- [ ] 我已按需求文档实现功能
- [ ] 我已进行 Chrome MCP 自测
- [ ] 我已通过代码规范检查
- [ ] 我已更新 ClawTeam 任务状态
- [ ] 我已提交自测报告
```

---

## 文档更新记录

| 日期 | 更新内容 | 更新人 |
|------|----------|--------|
| 2026-03-28 | 初始版本 | 小虾米 |

---

**维护者**: 小虾米  
**最后更新**: 2026-03-28
