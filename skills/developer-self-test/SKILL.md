# 开发者自测技能规范

**版本**: v2.0  
**更新时间**: 2026-03-28  
**适用范围**: 所有前端/后端开发任务

---

## 一、自测流程总览

```
┌─────────────────────────────────────────────────────────────────┐
│                    开发者自测流程                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1️⃣ 代码开发完成                                               │
│     ↓                                                           │
│  2️⃣ 本地启动验证 (前后端分别启动)                              │
│     ↓                                                           │
│  3️⃣ Chrome MCP 联调测试 (核心功能点击测试)                     │
│     ↓                                                           │
│  4️⃣ 代码规范检查 (ESLint/Prettier/TypeScript)                  │
│     ↓                                                           │
│  5️⃣ 单元测试 (覆盖率≥80%)                                      │
│     ↓                                                           │
│  6️⃣ Git 提交                                                    │
│     ↓                                                           │
│  7️⃣ ClawTeam 任务状态更新                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 二、需求文档关联

### 2.1 开发者如何知道对应哪个文档？

**每个 ClawTeam 任务必须包含**：

```markdown
任务描述模板:

【需求文档】
- 主文档：docs/01-requirements/admin-frontend-v3.md
- 相关文档：docs/01-requirements/user-login-v2.2.md

【开发内容】
- 实现 XXX 功能
- 对应需求文档第 X 章第 X 节

【验收标准】
- 功能验收：参考需求文档第 X 章
- 性能验收：页面加载 < 2s
- 代码验收：ESLint 通过，测试覆盖率≥80%
```

### 2.2 需求文档索引文件

创建 `docs/01-requirements/README.md`：

```markdown
# 需求文档索引

## 后端 API 相关

| 文档 | 对应模块 | 开发者 | 状态 |
|------|----------|--------|------|
| user-login-v2.2.md | 认证 API | backend-team | ✅ 已完成 |
| system-config-tables.md | 系统配置 | backend-team | ⏳ 开发中 |

## 前端开发相关

| 文档 | 对应模块 | 开发者 | 状态 |
|------|----------|--------|------|
| admin-frontend-v3.md | 后台管理前端 | frontend-team | ⏳ 开发中 |
```

---

## 三、Chrome MCP 自测详细流程

### 3.1 自测准备

```bash
# 1. 确认前后端都已启动
exec: lsof -i :3000  # 后端端口
exec: lsof -i :5173  # 前端端口

# 2. 确认数据库连接
exec: curl http://localhost:3000/api/v1/health

# 3. 打开 Chrome DevTools MCP
exec: open http://localhost:5173
```

### 3.2 登录功能自测示例

```
【测试场景】：用户登录

【自测步骤】:

1. 打开登录页面
   URL: http://localhost:5173/login
   
2. 填写登录表单
   • 账户：admin
   • 密码：Admin123
   • 验证码：(从图片读取)
   
3. 点击登录按钮
   • 使用 Chrome MCP 点击 .ant-btn-primary
   
4. 验证网络请求
   • Network 面板查看 /api/v1/auth/login 请求
   • 请求方法：POST
   • 请求参数：account, password, captcha
   • 响应状态：200
   • 响应数据：{ success: true, data: { accessToken, ... } }
   
5. 验证页面跳转
   • 当前 URL: http://localhost:5173/dashboard
   • 页面标题：仪表盘
   
6. 验证本地存储
   • localStorage 查看 accessToken
   • 格式：Bearer eyJhbGc...
   
7. 验证控制台
   • Console 无错误
   • 无 404 资源
   • 无 CORS 错误
   
【测试通过标准】:
✅ 登录成功，跳转到仪表盘
✅ Token 正确存储
✅ 无控制台错误
✅ 网络请求正常

【测试失败处理】:
❌ 如果登录失败 → 查看后端日志 → 修复 → 重新测试
❌ 如果 Token 未存储 → 检查登录逻辑 → 修复 → 重新测试
❌ 如果有控制台错误 → 修复错误 → 重新测试
```

### 3.3 标签页功能自测示例

```
【测试场景】：标签页管理

【自测步骤】:

1. 打开多个页面
   • 点击 用户管理 → 新标签页
   • 点击 角色管理 → 新标签页
   • 点击 系统设置 → 新标签页
   
2. 验证标签页显示
   • 顶部显示 4 个标签（首页 + 3 个功能页）
   • 每个标签显示正确图标和标题
   
3. 测试标签页切换
   • 点击不同标签 → 页面正确切换
   • 页面状态保持（KeepAlive）
   
4. 测试标签页关闭
   • 点击标签页 × 按钮 → 标签页关闭
   • 自动激活相邻标签页
   
5. 测试标签页刷新
   • 右键标签页 → 刷新 → 页面重新加载
   
6. 测试标签页拖拽
   • 拖拽标签页调整顺序
   • 顺序保存正确

【测试通过标准】:
✅ 标签页正常添加/切换/关闭/刷新
✅ KeepAlive 状态保持
✅ 拖拽排序正常
✅ 无控制台错误
```

### 3.4 主题切换自测示例

```
【测试场景】：主题切换

【自测步骤】:

1. 打开设置面板
   • 点击右侧设置按钮
   
2. 测试亮色/暗色切换
   • 点击 亮色 → 页面立即切换为亮色
   • 点击 暗色 → 页面立即切换为暗色
   • 点击 跟随系统 → 根据系统主题切换
   
3. 验证主题持久化
   • 刷新页面 → 主题保持
   • localStorage 查看 theme.mode
   
4. 测试导航模式切换
   • 侧边栏 → 顶部 → 混合
   • 每种模式布局正确
   
5. 测试特殊模式
   • 灰色模式 → 全站灰色
   • 色弱模式 → 色弱滤镜
   
6. 验证无闪烁
   • 主题切换流畅
   • 无白屏闪烁

【测试通过标准】:
✅ 主题切换正常
✅ 持久化正常
✅ 无闪烁
✅ 无控制台错误
```

---

## 四、前后端联调流程

### 4.1 联调准备

```bash
# 1. 确认后端 API 已部署
exec: curl http://localhost:3000/api/v1/health
# 期望：{ status: 'ok' }

# 2. 确认前端配置正确
exec: cat admin-frontend/.env
# 确认：VITE_API_BASE_URL=http://localhost:3000/api/v1

# 3. 确认 CORS 配置正确
exec: curl -I http://localhost:3000/api/v1/auth/login
# 确认：Access-Control-Allow-Origin: *
```

### 4.2 联调测试清单

```
【联调测试清单】:

✅ 认证接口联调:
• POST /auth/login - 登录
• GET /auth/me - 获取用户信息
• PUT /auth/me/password - 修改密码
• POST /auth/logout - 登出

✅ 用户管理联调:
• GET /users - 用户列表
• GET /users/:id - 用户详情
• POST /users - 创建用户
• PUT /users/:id - 更新用户
• DELETE /users/:id - 删除用户

✅ 系统配置联调:
• GET /system/config - 系统配置
• GET /dicts - 字典列表

【联调验证点】:
• 请求 URL 正确
• 请求参数正确
• 响应数据格式正确
• 错误处理正确
• Token 认证正确
```

### 4.3 联调问题排查

```
【常见问题排查】:

1️⃣ CORS 错误
症状：Access to fetch at '...' from origin '...' has been blocked by CORS policy
解决：
• 后端添加 @nestjs/cors
• 配置 allowOrigin: ['http://localhost:5173']

2️⃣ 401 未授权
症状：Response status 401 Unauthorized
解决：
• 检查 Token 是否正确
• 检查 Authorization header 格式：Bearer {token}

3️⃣ 404 未找到
症状：Response status 404 Not Found
解决：
• 检查 API 路径是否正确
• 检查路由前缀 /api/v1

4️⃣ 500 服务器错误
症状：Response status 500 Internal Server Error
解决：
• 查看后端日志
• 检查数据库连接
• 检查参数验证
```

---

## 五、ClawTeam 任务管理

### 5.1 任务创建规范

```bash
# 创建任务时必须指定需求文档
clawteam task create admin-frontend "第二阶段：核心组件开发" \
  -o developer \
  --description "开发 MainLayout/Sidebar/Header/TabsView/SettingsDrawer" \
  --docs "docs/01-requirements/admin-frontend-v3.md"
```

### 5.2 任务状态更新

```bash
# 任务完成后更新状态
clawteam task update admin-frontend [任务 ID] \
  --status completed \
  --note "已完成自测，Chrome MCP 验证通过"
```

### 5.3 任务关联文档

每个任务必须关联：
- ✅ 需求文档
- ✅ 架构文档（如有）
- ✅ API 文档（后端任务）
- ✅ 自测报告

---

## 六、自测报告模板

```markdown
# 自测报告

**任务**: [任务名称]
**开发者**: [姓名]
**日期**: 2026-03-28

## 测试环境
- 前端：http://localhost:5173
- 后端：http://localhost:3000
- 数据库：MySQL 5.7 (8.148.22.71)

## 测试内容

### 功能测试
- [ ] 功能 1: [描述] ✅
- [ ] 功能 2: [描述] ✅

### Chrome MCP 测试
- [ ] 页面加载正常 ✅
- [ ] 核心交互正常 ✅
- [ ] 网络请求正常 ✅
- [ ] 无控制台错误 ✅

### 代码质量
- [ ] ESLint 通过 ✅
- [ ] Prettier 通过 ✅
- [ ] TypeScript 编译通过 ✅
- [ ] 单元测试覆盖率≥80% ✅

### 前后端联调
- [ ] API 接口正常 ✅
- [ ] Token 认证正常 ✅
- [ ] 错误处理正常 ✅

## 问题记录
[记录发现的问题及修复过程]

## 测试结论
✅ 通过自测，可以提交代码
```

---

## 七、检查清单

### 开发前检查

```
- [ ] 已阅读需求文档
- [ ] 已了解验收标准
- [ ] 已创建 Git 分支
- [ ] 已配置开发环境
```

### 开发后检查

```
- [ ] 代码已实现
- [ ] 本地启动验证通过
- [ ] Chrome MCP 自测通过
- [ ] 代码规范检查通过
- [ ] 单元测试通过
- [ ] 前后端联调通过
```

### 提交前检查

```
- [ ] Git 提交信息规范
- [ ] 关联 ClawTeam 任务
- [ ] 更新任务状态
- [ ] 提交自测报告
```

---

**维护者**: 小虾米  
**最后更新**: 2026-03-28
