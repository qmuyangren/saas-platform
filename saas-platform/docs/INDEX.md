# 文档索引和导航

> 快速找到你需要的文档

**版本**: v1.0  
**最后更新**: 2026-03-28

---

## 📚 文档分类导航

### 按角色查找文档

#### 👨‍💼 产品经理 (Product CEO)
```
docs/01-requirements/     # 需求文档
├── user-login-v2.2.md    # 用户登录需求 (完整版)
├── oauth-config.md       # OAuth 配置需求
├── system-config.md      # 系统配置需求
└── ...

docs/04-architecture/     # 架构设计
├── system-design.md      # 系统设计 (待创建)
└── module-design.md      # 模块设计 (待创建)
```

#### 🏗️ 架构师 (Architect)
```
docs/02-technical/        # 技术文档
├── api-specifications.md # API 接口规范
├── database-design.md    # 数据库设计规范
├── base-sys-log.md       # 系统日志表设计
└── admin-login-flow.md   # 后台登录流程

docs/04-architecture/     # 架构设计
├── system-design.md      # 系统设计 (待创建)
└── module-design.md      # 模块设计 (待创建)
```

#### 💻 开发人员 (Developer)
```
快速开始:
1. docs/02-technical/api-specifications.md  # API 规范
2. docs/02-technical/database-design.md     # 数据库设计
3. docs/03-guides/GIT_WORKFLOW.md           # Git 工作流
4. docs/PROJECT_STRUCTURE.md                # 目录结构

开发规范:
• docs/02-technical/api-specifications.md   # API 接口规范
• docs/02-technical/database-design.md      # 数据库设计
• docs/03-guides/GIT_WORKFLOW.md            # Git 提交规范
• docs/PROJECT_STRUCTURE.md                 # 目录结构规范
```

#### 🧪 测试人员 (QA Lead)
```
docs/01-requirements/     # 需求文档 (验收标准)
├── user-login-v2.2.md    # 登录需求
└── ...

docs/03-guides/           # 使用指南
├── HUMAN_INTERVENTION.md # 人工介入指南
└── ...
```

#### 🚀 发布工程师 (Release Engineer)
```
docs/03-guides/           # 使用指南
├── GIT_WORKFLOW.md       # Git 工作流
├── CLAWTEAM_GUIDE.md     # ClawTeam 使用
└── ...

docs/02-technical/        # 技术文档
└── api-specifications.md # API 规范
```

---

### 按功能查找文档

#### 登录功能
```
需求文档:
• docs/01-requirements/user-login-v2.2.md

技术文档:
• docs/02-technical/admin-login-flow.md
• docs/02-technical/api-specifications.md

实现位置:
• admin-frontend/src/pages/Login.tsx
• admin-frontend/src/api/auth.ts
• server/src/controllers/auth.controller.ts (待创建)
```

#### 用户管理
```
需求文档:
• docs/01-requirements/user-login-v2.2.md

技术文档:
• docs/02-technical/database-design.md
• docs/02-technical/base-sys-log.md

实现位置:
• server/src/controllers/user.controller.ts (待创建)
• server/src/services/user.service.ts (待创建)
```

#### 数据库设计
```
设计文档:
• docs/02-technical/database-design.md
• docs/02-technical/base-sys-log.md

实现位置:
• server/prisma/schema.prisma (待创建)
```

#### API 接口
```
规范文档:
• docs/02-technical/api-specifications.md

实现位置:
• server/src/routes/ (待创建)
• server/src/controllers/ (待创建)
```

---

## 📋 文档创建流程

### 什么时候创建文档？

```
✅ 必须创建文档的场景:
• 新功能开发前 → 创建需求文档
• 技术方案确定后 → 创建技术文档
• 架构设计完成后 → 创建架构文档
• 发现常见问题 → 创建 FAQ 文档
• 制定新规范 → 创建规范文档

❌ 不需要创建文档的场景:
• 简单的代码修改
• Bug 修复
• 重构 (不影响接口)
```

### 文档创建步骤

```
1. 确定文档类型
   • 需求文档 → docs/01-requirements/
   • 技术文档 → docs/02-technical/
   • 使用指南 → docs/03-guides/
   • 架构设计 → docs/04-architecture/

2. 选择文档模板
   • 需求文档模板 → docs/templates/requirements.md
   • 技术文档模板 → docs/templates/technical.md
   • 架构文档模板 → docs/templates/architecture.md

3. 创建文档
   cd docs/01-requirements/
   touch new-feature.md

4. 编写文档
   # 使用模板
   # 包含必要的章节

5. 提交文档
   git add docs/01-requirements/new-feature.md
   git commit -m "docs(requirements): 添加新功能需求文档"
   git push
```

### 文档命名规范

```
✅ 正确:
• user-login.md           # 小写 + 连字符
• api-specifications.md   # 语义清晰
• v2.2.md                 # 版本号

❌ 错误:
• UserLogin.md            # 驼峰命名
• user_login.md           # 下划线命名
• 登录需求.md             # 中文命名
```

---

## 🔍 快速查找

### 按文件名查找

```bash
# 查找所有需求文档
find docs/01-requirements -name "*.md"

# 查找所有技术文档
find docs/02-technical -name "*.md"

# 查找包含"登录"的文档
grep -r "登录" docs/

# 查找最近修改的文档
find docs/ -name "*.md" -mtime -7
```

### 按内容查找

```bash
# 搜索 API 相关文档
grep -r "API" docs/ --include="*.md"

# 搜索数据库相关文档
grep -r "数据库" docs/ --include="*.md"

# 搜索特定表设计
grep -r "base_user" docs/ --include="*.md"
```

---

## 📁 目录结构

```
docs/
├── 01-requirements/      # 需求文档
│   ├── user-login-v2.2.md
│   ├── oauth-config.md
│   └── ...
│
├── 02-technical/         # 技术文档
│   ├── api-specifications.md
│   ├── database-design.md
│   └── ...
│
├── 03-guides/            # 使用指南
│   ├── CLAWTEAM_GUIDE.md
│   ├── GIT_WORKFLOW.md
│   └── ...
│
├── 04-architecture/      # 架构设计
│   ├── system-design.md
│   └── ...
│
├── templates/            # 文档模板 (待创建)
│   ├── requirements.md
│   ├── technical.md
│   └── architecture.md
│
└── INDEX.md              # 文档索引 (本文件)
```

---

## 🎯 常用文档速查

### 新员工必读

```
1. README.md              # 项目说明
2. docs/PROJECT_STRUCTURE.md  # 目录结构
3. docs/03-guides/GIT_WORKFLOW.md  # Git 工作流
4. docs/02-technical/api-specifications.md  # API 规范
```

### 开发前必读

```
1. docs/01-requirements/user-login-v2.2.md  # 登录需求
2. docs/02-technical/api-specifications.md  # API 规范
3. docs/02-technical/database-design.md     # 数据库设计
4. docs/03-guides/GIT_WORKFLOW.md           # Git 工作流
```

### 发布前必读

```
1. docs/03-guides/GIT_WORKFLOW.md  # Git 工作流
2. docs/02-technical/api-specifications.md  # API 规范
3. docs/01-requirements/  # 需求文档 (验收标准)
```

---

## ❓ 常见问题

### Q1: 我找不到某个功能的文档怎么办？

**A**: 
1. 使用 `grep` 搜索关键词
2. 查看本文档索引
3. 询问团队成员
4. 如果确实没有，创建新文档

### Q2: 我应该把文档放在哪里？

**A**: 
- 需求文档 → `docs/01-requirements/`
- 技术文档 → `docs/02-technical/`
- 使用指南 → `docs/03-guides/`
- 架构设计 → `docs/04-architecture/`

### Q3: 文档太多太乱了怎么办？

**A**: 
1. 按照本文档的分类整理
2. 删除过时的文档
3. 合并相似的文档
4. 建立文档索引

### Q4: 如何确保文档是最新的？

**A**: 
1. 代码变更时同步更新文档
2. 定期审查文档
3. 在 PR 中检查文档更新
4. 设置文档负责人

---

## 📊 文档统计

| 分类 | 文档数 | 最后更新 |
|------|--------|----------|
| 需求文档 | 8 个 | 2026-03-28 |
| 技术文档 | 5 个 | 2026-03-28 |
| 使用指南 | 5 个 | 2026-03-28 |
| 架构设计 | 2 个 | 2026-03-28 |
| **总计** | **20 个** | - |

---

## 🔄 更新记录

| 版本 | 日期 | 更新内容 | 更新人 |
|------|------|----------|--------|
| v1.0 | 2026-03-28 | 初始版本 | 小虾米 |

---

**维护者**: 小虾米  
**最后更新**: 2026-03-28
