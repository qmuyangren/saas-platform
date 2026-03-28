# 后台管理前端需求文档 (v3.0)

**版本**: v3.0  
**更新时间**: 2026-03-28  
**状态**: 已评审

---

## 一、功能需求

### 1.1 界面显示

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 标签页 (Tab) | 支持多标签页浏览，可关闭、刷新 | Must |
| 标签图标 | 每个标签页显示对应图标 | Must |
| 灰色模式 | 一键切换全站灰色（哀悼日等场景） | Should |
| 色弱模式 | 色弱辅助模式 | Should |
| 缓存页面 (KeepAlive) | 支持页面状态缓存 | Must |
| 顶部进度条 | 页面切换时显示进度条 | Should |
| 切换 Loading | 页面切换时显示 Loading 动画 | Should |

### 1.2 主题配置

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 主题开关 | 亮色/暗色模式切换 | Must |
| 系统主题跟随 | 跟随操作系统主题 | Should |
| 导航模式 | 侧边栏/顶部/混合三种导航模式 | Must |
| 固定 Header | Header 固定在顶部 | Should |

### 1.3 交互功能

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 菜单搜索 | 快速搜索并跳转到菜单 | Must |
| 语言切换 | 中文/英文切换 | Must |
| 全屏切换 | 全屏/退出全屏 | Should |
| 刷新页面 | 刷新当前标签页 | Must |

---

## 二、技术架构

### 2.1 项目结构

```
admin-frontend/
├── src/
│   ├── main.tsx                      # 入口文件
│   ├── App.tsx                       # 根组件
│   ├── index.css                     # 全局样式
│   │
│   ├── api/                          # API 调用
│   │   ├── request.ts                # axios 实例
│   │   ├── auth.ts                   # 认证 API
│   │   └── user.ts                   # 用户 API
│   │
│   ├── assets/                       # 静态资源
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/                   # 业务组件
│   │   ├── Layout/
│   │   │   ├── MainLayout.tsx        # 主布局
│   │   │   ├── Sidebar.tsx           # 侧边栏
│   │   │   ├── Header.tsx            # 顶部栏
│   │   │   ├── TabsView.tsx          # 标签页组件 ⭐
│   │   │   └── Breadcrumb.tsx        # 面包屑
│   │   ├── Common/
│   │   │   ├── PageContainer/        # 页面容器
│   │   │   ├── SearchMenu/           # 菜单搜索 ⭐
│   │   │   └── ProgressBar/          # 顶部进度条 ⭐
│   │   └── Settings/                 # 设置面板 ⭐
│   │       ├── SettingsDrawer.tsx
│   │       ├── ThemeSwitch.tsx
│   │       ├── NavigationMode.tsx
│   │       ├── GrayMode.tsx
│   │       └── ColorWeakMode.tsx
│   │
│   ├── hooks/                        # 自定义 Hooks
│   │   ├── useTheme.ts               # 主题管理 ⭐
│   │   ├── useTabs.ts                # 标签页管理 ⭐
│   │   ├── useKeepAlive.ts           # 页面缓存 ⭐
│   │   └── useProgress.ts            # 进度条管理 ⭐
│   │
│   ├── layouts/                      # 布局组件
│   │   ├── SidebarLayout.tsx         # 侧边栏导航模式 ⭐
│   │   ├── TopLayout.tsx             # 顶部导航模式 ⭐
│   │   └── MixLayout.tsx             # 混合导航模式 ⭐
│   │
│   ├── pages/                        # 页面
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   └── ...
│   │
│   ├── router/                       # 路由配置
│   │   ├── index.tsx
│   │   ├── routes.ts
│   │   └── keepAlive.tsx             # KeepAlive 组件 ⭐
│   │
│   ├── store/                        # 状态管理
│   │   ├── slices/
│   │   │   ├── app.ts                # 应用全局状态 ⭐
│   │   │   ├── tabs.ts               # 标签页状态 ⭐
│   │   │   └── settings.ts           # 设置状态 ⭐
│   │   └── index.ts
│   │
│   ├── config/                       # 配置文件
│   │   ├── menu.ts                   # 菜单配置
│   │   └── theme.ts                  # 主题配置
│   │
│   ├── locales/                      # 国际化
│   │   ├── zh-CN.json
│   │   └── en-US.json
│   │
│   └── utils/                        # 工具函数
│       ├── i18n.ts
│       └── storage.ts
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### 2.2 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | React | 18.x |
| 语言 | TypeScript | 5.x |
| 构建 | Vite | 5.x |
| UI 库 | Ant Design | 6.x |
| 状态管理 | Zustand | 5.x |
| 路由 | React Router | 7.x |
| 国际化 | react-i18next | 15.x |
| HTTP | Axios | 1.x |
| 进度条 | nprogress | 0.2.x |
| 日期 | dayjs | 1.x |

### 2.3 核心功能实现方案

#### 标签页管理

```typescript
// store/slices/tabs.ts
interface Tab {
  key: string;
  title: string;
  icon?: React.ReactNode;
  path: string;
  closable: boolean;
}

interface TabsState {
  tabs: Tab[];
  activeTab: string;
  addTab: (tab: Tab) => void;
  removeTab: (key: string) => void;
  setActiveTab: (key: string) => void;
  refreshTab: (key: string) => void;
}
```

#### 主题管理

```typescript
// store/slices/settings.ts
interface ThemeConfig {
  mode: 'light' | 'dark';
  systemTheme: boolean;
  navMode: 'sidebar' | 'top' | 'mix';
  grayMode: boolean;
  colorWeakMode: boolean;
  keepAlive: boolean;
  locale: 'zh-CN' | 'en-US';
}

interface SettingsState {
  theme: ThemeConfig;
  setTheme: (config: Partial<ThemeConfig>) => void;
  resetTheme: () => void;
}
```

#### KeepAlive 实现

```tsx
// router/keepAlive.tsx
import { KeepAliveProvider } from 'react-keep-alive';

export const KeepAliveRouter = () => {
  return (
    <KeepAliveProvider>
      <Routes>
        {/* 需要缓存的路由 */}
        <Route path="/dashboard" element={
          <KeepAlive name="dashboard">
            <Dashboard />
          </KeepAlive>
        } />
      </Routes>
    </KeepAliveProvider>
  );
};
```

#### 进度条管理

```typescript
// hooks/useProgress.ts
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export const useProgress = () => {
  const start = () => NProgress.start();
  const done = () => NProgress.done();
  
  return { start, done };
};

// 在路由守卫中使用
router.beforeEach((to, from) => {
  const { start, done } = useProgress();
  start();
  // ... 路由逻辑
  done();
});
```

---

## 三、UI/UX 设计

### 3.1 标签页组件

```
┌─────────────────────────────────────────────────────────────────┐
│  [首页] [用户管理 ×] [角色管理 ×] [系统设置 ×]     [+] [刷新]  │
└─────────────────────────────────────────────────────────────────┘
```

**功能**:
- 添加标签页
- 关闭标签页
- 刷新标签页
- 关闭其他标签页
- 关闭全部标签页
- 标签页拖拽排序

### 3.2 设置面板

```
┌─────────────────────────────────────┐
│  主题设置                      [×]  │
├─────────────────────────────────────┤
│  主题模式                           │
│  ☀️ 亮色  🌙 暗色  💻 跟随系统     │
│                                     │
│  导航模式                           │
│  [侧边栏 ▼]                         │
│                                     │
│  特殊模式                           │
│  灰色模式         [○]              │
│  色弱模式         [○]              │
│                                     │
│  功能开关                           │
│  缓存页面         [●]              │
│  顶部进度条       [●]              │
│  切换 Loading     [●]              │
│  固定 Header      [●]              │
│                                     │
│  语言 / Language                    │
│  [中文 ▼]                           │
│                                     │
│  [重置主题]                         │
└─────────────────────────────────────┘
```

### 3.3 菜单搜索

```
┌─────────────────────────────────────┐
│  🔍 搜索菜单...                     │
├─────────────────────────────────────┤
│  [📊] 仪表盘                        │
│  [👥] 用户管理                      │
│  [🔐] 角色管理                      │
│  [⚙️] 系统设置                      │
│  [📝] 公告管理                      │
└─────────────────────────────────────┘
```

---

## 四、开发任务

### 4.1 第一阶段：基础框架

| 任务 | 说明 | 优先级 |
|------|------|--------|
| 项目结构搭建 | 按新结构调整目录 | Must |
| 状态管理配置 | 配置 Zustand store | Must |
| 路由配置 | 配置 React Router | Must |
| 国际化配置 | 配置 i18next | Must |
| API 层封装 | 封装 axios 和 API | Must |

### 4.2 第二阶段：核心组件

| 任务 | 说明 | 优先级 |
|------|------|--------|
| MainLayout | 主布局组件 | Must |
| Sidebar | 侧边栏组件 | Must |
| Header | 顶部栏组件 | Must |
| TabsView | 标签页组件 | Must |
| SettingsDrawer | 设置抽屉 | Must |

### 4.3 第三阶段：功能实现

| 任务 | 说明 | 优先级 |
|------|------|--------|
| useTheme | 主题管理 Hook | Must |
| useTabs | 标签页管理 Hook | Must |
| useKeepAlive | 页面缓存 Hook | Must |
| useProgress | 进度条 Hook | Should |
| SearchMenu | 菜单搜索组件 | Should |

### 4.4 第四阶段：主题与样式

| 任务 | 说明 | 优先级 |
|------|------|--------|
| 暗色模式 | 实现暗色主题 | Must |
| 灰色模式 | 实现灰色滤镜 | Should |
| 色弱模式 | 实现色弱滤镜 | Should |
| 导航模式切换 | 三种导航模式 | Must |

---

## 五、验收标准

### 5.1 功能验收

- [ ] 标签页可正常添加/关闭/刷新
- [ ] 主题切换正常（亮色/暗色）
- [ ] 导航模式切换正常（侧边栏/顶部/混合）
- [ ] 灰色模式/色弱模式正常
- [ ] 语言切换正常（中文/英文）
- [ ] 菜单搜索功能正常
- [ ] 页面缓存正常
- [ ] 顶部进度条正常

### 5.2 性能验收

- [ ] 首屏加载 < 2s
- [ ] 页面切换 < 300ms
- [ ] 标签页切换 < 100ms
- [ ] 无内存泄漏

### 5.3 兼容性验收

- [ ] Chrome 最新版
- [ ] Firefox 最新版
- [ ] Safari 最新版
- [ ] Edge 最新版

---

## 六、变更记录

| 版本 | 日期 | 变更内容 | 变更人 |
|------|------|----------|--------|
| v1.0 | 2026-03-28 | 初始版本 | 小虾米 |
| v2.0 | 2026-03-28 | 增加认证/用户管理 | 小虾米 |
| v3.0 | 2026-03-28 | 增加主题/标签页/国际化等 | 小虾米 |

---

**记录人**: 小虾米  
**审核状态**: 待评审  
**下一步**: 使用 ClawTeam 分配开发任务
