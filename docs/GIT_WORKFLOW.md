# Git 工作流规范

## 分支策略

```
main (受保护)
  ↑
  │ merge (PR + Review)
  │
develop (开发分支)
  ↑
  │ merge
  │
feature/* (功能分支)
  • feature/user-login
  • feature/order-module
  • feature/payment
```

## 开发流程

### 1. 创建特性分支

```bash
# 从 develop 分支创建
git checkout develop
git pull origin develop
git checkout -b feature/user-login
```

### 2. 开发中提交

```bash
# 小步提交
git add apps/ecommerce/backend/src/auth.ts
git commit -m "feat: 实现登录 API"

git add apps/ecommerce/frontend/src/Login.tsx
git commit -m "feat: 实现登录页面"

git add tests/auth.test.ts
git commit -m "test: 添加登录测试"
```

### 3. 推送到远程

```bash
# 推送特性分支
git push origin feature/user-login
```

### 4. 创建 PR

```bash
# 使用 GitHub CLI
gh pr create \
  --title "feat: 用户登录功能" \
  --body "实现用户登录功能，包括前后端和测试" \
  --base develop
```

### 5. Code Review

- 至少 1 人 review
- CI 测试通过
- 解决所有评论

### 6. 合并 PR

```bash
# 合并到 develop
gh pr merge --merge --delete-branch
```

### 7. 发布到生产

```bash
# 从 develop 合并到 main
git checkout main
git pull origin main
git merge develop -m "Merge develop to main"

# 打版本号
git tag v1.0.0
git push origin main
git push origin v1.0.0
```

## 提交信息规范

### 格式

```
<type>(<scope>): <description>
```

### Type 类型

| Type | 说明 |
|------|------|
| `feat:` | 新功能 |
| `fix:` | Bug 修复 |
| `docs:` | 文档更新 |
| `style:` | 代码格式 (不影响功能) |
| `refactor:` | 重构 |
| `test:` | 测试相关 |
| `chore:` | 构建/工具/配置 |

### 示例

```bash
feat(auth): 实现用户登录 API
fix(auth): 修复密码验证逻辑
docs: 更新 API 文档
test(auth): 添加登录测试
refactor(auth): 重构认证服务
```

## 版本号规范

```
v<主版本>.<次版本>.<补丁版本>
v1.0.0
v1.0.1 (补丁修复)
v1.1.0 (新功能)
v2.0.0 (破坏性更新)
```

## 紧急修复流程

```bash
# 从 main 创建 hotfix 分支
git checkout main
git checkout -b hotfix/login-bug

# 修复并提交
git add ...
git commit -m "fix: 修复登录 Bug"

# 直接合并到 main
git checkout main
git merge hotfix/login-bug
git tag v1.0.1
git push origin main
git push origin v1.0.1

# 同步到 develop
git checkout develop
git merge main
git push origin develop
```

## Git 配置

```bash
# 全局配置
git config --global user.name "Nick"
git config --global user.email "nick@example.com"

# 别名
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
```

## 最佳实践

1. **小步提交** - 每次提交只做一件事
2. **及时推送** - 每天至少推送一次
3. **分支命名** - 清晰表达功能
4. **提交信息** - 说明为什么，不是做什么
5. **Code Review** - 必须有人 review
6. **CI 通过** - 测试必须通过
