# SaaS 平台项目访问指南

**更新日期**: 2026-03-28  
**项目状态**: ✅ 运行中

---

## 项目访问

### 前端管理后台

**地址**: http://localhost:5175

**页面**:
- 登录页：http://localhost:5175/login
- 仪表盘：http://localhost:5175/dashboard

**测试账号**:
```
账号：admin
密码：Admin123
```

### 后端 API

**地址**: http://localhost:3000

**API 文档**: http://localhost:3000/api/docs

**健康检查**: http://localhost:3000/api/v1/health

---

## 快速测试

### 1. 访问登录页面

打开浏览器访问：http://localhost:5175/login

应该看到：
- ✅ 登录表单
- ✅ 用户名输入框
- ✅ 密码输入框
- ✅ 登录按钮

### 2. 测试登录

使用测试账号登录：
- 账号：`admin`
- 密码：`Admin123`

应该：
- ✅ 登录成功
- ✅ 跳转到仪表盘
- ✅ 显示欢迎信息

### 3. 访问 API 文档

打开浏览器访问：http://localhost:3000/api/docs

应该看到：
- ✅ Swagger UI 界面
- ✅ API 列表 (认证/用户/角色/字典/日志/公告)
- ✅ 可以尝试调用 API

### 4. 测试 API

使用 Swagger UI 测试 API：

**登录 API**:
```
POST /api/v1/auth/login
Body: {
  "account": "admin",
  "password": "Admin123"
}
```

**获取用户信息**:
```
GET /api/v1/auth/me
Headers: {
  "Authorization": "Bearer {token}"
}
```

---

## 组件库测试

### 已完成的组件 (34 个)

**布局组件**:
- ✅ MainLayout - 主布局
- ✅ Header - 顶部栏
- ✅ Sidebar - 侧边栏
- ✅ TabsView - 标签页
- ✅ SettingsDrawer - 设置抽屉

**公共组件**:
- ✅ Icon - 图标
- ✅ Loading - 加载
- ✅ Error - 错误

**表单组件**:
- ✅ Form - 表单
- ✅ Input - 输入框
- ✅ Select - 选择器
- ✅ Upload - 上传
- ✅ Editor - 富文本编辑器

**表格组件**:
- ✅ BasicTable - 基础表格
- ✅ TableAction - 操作列

**核心组件**:
- ✅ Button - 按钮
- ✅ Modal - 弹窗
- ✅ Drawer - 抽屉
- ✅ Descriptions - 描述列表
- ✅ Card - 卡片
- ✅ Dropdown - 下拉菜单

**高级组件**:
- ✅ Tree - 树形
- ✅ Chart - 图表
- ✅ CountDown - 倒计时
- ✅ CountTo - 数字滚动

**工具组件**:
- ✅ Authority - 权限
- ✅ IconPicker - 图标选择器

### Hooks (5 个)

- ✅ useForm - 表单 Hook
- ✅ useTable - 表格 Hook
- ✅ useLoading - 加载 Hook
- ✅ usePermission - 权限 Hook
- ✅ useBreakpoint - 响应式 Hook

---

## 技术栈

### 前端

```
React 18
TypeScript 5
Vite 5
Ant Design 6
Zustand 5
React Router 7
Axios 1
```

### 后端

```
NestJS 11
TypeScript 5
Prisma 5
MySQL 5.7
JWT
bcrypt
```

---

## 项目结构

```
saas-platform/
├── admin-frontend/        # 前端项目
│   ├── src/
│   │   ├── components/   # 组件库 (34 个)
│   │   ├── hooks/        # Hooks (5 个)
│   │   ├── stores/       # 状态管理 (6 个)
│   │   ├── api/          # API 封装
│   │   ├── utils/        # 工具函数
│   │   ├── router/       # 路由配置
│   │   └── pages/        # 页面
│   └── package.json
│
├── server/               # 后端项目
│   ├── src/
│   │   ├── modules/     # 模块
│   │   ├── prisma/      # 数据库
│   │   └── main.ts      # 入口
│   └── package.json
│
└── docs/                 # 文档
```

---

## 开发命令

### 前端

```bash
cd admin-frontend

# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 构建生产版本
pnpm run build

# 运行自测
node scripts/self-test.cjs
```

### 后端

```bash
cd server

# 安装依赖
pnpm install

# 启动开发服务器
pnpm run start:dev

# 数据库迁移
pnpm prisma migrate dev

# 生成 Prisma Client
pnpm prisma generate
```

---

## 常见问题

### Q: 前端无法访问？

**解决**:
```bash
cd admin-frontend
pnpm run dev
```

### Q: 后端无法访问？

**解决**:
```bash
cd server
pnpm run start:dev
```

### Q: 数据库连接失败？

**解决**:
检查 `.env` 文件中的数据库配置：
```
DATABASE_URL="mysql://root:qxsj@2025@8.148.22.71:3306/practice06"
```

### Q: 登录失败？

**解决**:
1. 检查后端是否运行
2. 检查数据库连接
3. 检查测试账号是否存在
4. 查看后端日志

---

## 服务器状态

| 服务 | 地址 | 状态 |
|------|------|------|
| 前端 | http://localhost:5175 | ✅ 运行中 |
| 后端 | http://localhost:3000 | ✅ 运行中 |
| API 文档 | http://localhost:3000/api/docs | ✅ 可访问 |
| 数据库 | 8.148.22.71:3306 | ✅ 已连接 |

---

## 下一步

### 页面功能开发

- [ ] 用户管理页面
- [ ] 角色管理页面
- [ ] 字典管理页面
- [ ] 日志管理页面
- [ ] 公告管理页面

### API 集成

- [ ] 用户管理 API
- [ ] 角色管理 API
- [ ] 字典管理 API
- [ ] 日志管理 API
- [ ] 公告管理 API

### 测试优化

- [ ] 单元测试
- [ ] 集成测试
- [ ] 性能优化
- [ ] 文档完善

---

**项目已就绪，可以开始使用！** 🎉

**访问地址**: http://localhost:5175  
**测试账号**: admin / Admin123

---

**记录人**: Developer  
**日期**: 2026-03-28
