# JNPF 组件库分析

**分析日期**: 2026-03-28  
**分析目的**: 借鉴 JNPF 组件设计思路，完善我们的 React 组件库

---

## JNPF 组件分类

### 53 个组件分类

```
components/
├── Application/        # 应用组件
├── Authority/          # 权限组件
├── Basic/              # 基础组件
├── Button/             # 按钮组件
├── CardList/           # 卡片列表
├── Chart/              # 图表组件
├── ClickOutSide/       # 点击外部
├── CodeEditor/         # 代码编辑器
├── ColumnDesign/       # 列设计
├── CommonModal/        # 通用弹窗
├── CommonPopover/      # 通用弹窗
├── Container/          # 容器组件
├── ContextMenu/        # 右键菜单
├── CountDown/          # 倒计时
├── CountTo/            # 数字滚动
├── Cropper/            # 裁剪组件
├── Description/        # 描述组件
├── Drawer/             # 抽屉组件
├── Dropdown/           # 下拉菜单
├── Excel/              # Excel 组件
├── FlowChart/          # 流程图
├── FlowProcess/        # 流程处理
├── Form/               # 表单组件 ⭐
├── FormExtraPanel/     # 表单方面板
├── FormGenerator/      # 表单生成器
├── Icon/               # 图标组件 ⭐
├── IntegrateProcess/   # 集成流程
├── ... (还有 25 个组件)
```

---

## 核心组件分析

### 1. Form 表单组件

**JNPF Form 结构**:
```
Form/
├── index.ts                    # 导出文件
├── src/
│   ├── BasicForm.vue           # 基础表单
│   ├── componentMap.ts         # 组件映射
│   ├── helper.ts               # 辅助函数
│   ├── props.ts                # Props 定义
│   ├── components/             # 表单子组件
│   │   ├── FormItem/           # 表单项
│   │   ├── FormRadio/          # 单选
│   │   ├── FormCheckbox/       # 复选
│   │   ├── FormInput/          # 输入框
│   │   ├── FormSelect/         # 选择器
│   │   └── ... (10+ 个子组件)
│   ├── hooks/                  # Hooks
│   │   ├── useForm/            # 表单 Hook
│   │   ├── useFormEvents/      # 事件 Hook
│   │   └── useFormValues/      # 值 Hook
│   └── types/                  # 类型定义
│       ├── form.ts             # 表单类型
│       └── index.ts            # 类型导出
```

**可借鉴的设计**:
- ✅ 统一的表单布局
- ✅ 组件映射机制
- ✅ 表单 Hooks 封装
- ✅ 完整的类型定义

### 2. Icon 图标组件

**JNPF Icon 结构**:
```
Icon/
├── index.ts
├── src/
│   ├── Icon.vue                # 图标组件
│   ├── IconPicker.vue          # 图标选择器
│   ├── SvgIcon.vue             # SVG 图标
│   └── types.ts                # 类型定义
```

**可借鉴的设计**:
- ✅ 统一的图标接口
- ✅ 图标选择器
- ✅ SVG 图标支持

### 3. Table 表格组件

**JNPF Table 结构**:
```
Table/
├── index.ts
├── src/
│   ├── BasicTable.vue          # 基础表格
│   ├── TableAction.vue         # 表格操作
│   ├── TableHeader.vue         # 表格头部
│   ├── TableFooter.vue         # 表格底部
│   ├── components/             # 子组件
│   │   ├── TablePagination/    # 分页
│   │   └── TableSettings/      # 设置
│   ├── hooks/                  # Hooks
│   │   ├── useTable/           # 表格 Hook
│   │   └── useTableContext/    # 上下文 Hook
│   └── types/                  # 类型定义
```

**可借鉴的设计**:
- ✅ 表格 Hooks 封装
- ✅ 表格操作列
- ✅ 分页配置
- ✅ 表格设置

---

## 我们的组件现状

### 已完成 (7 个)

```
✅ Layout/
   ├── MainLayout.tsx
   ├── Header.tsx
   ├── Sidebar.tsx
   └── TabsView.tsx

✅ Settings/
   └── SettingsDrawer.tsx

✅ Common/
   ├── Icon.tsx
   ├── Loading.tsx
   └── Error.tsx

✅ Form/
   ├── Input.tsx
   ├── Select.tsx
   └── Upload.tsx

✅ Table/
   └── BasicTable.tsx
```

### 待开发 (参考 JNPF)

```
⏳ Button/          # 按钮组件
⏳ Card/            # 卡片组件
⏳ Modal/           # 弹窗组件
⏳ Drawer/          # 抽屉组件
⏳ Dropdown/        # 下拉菜单
⏳ Descriptions/    # 描述列表
⏳ CountDown/       # 倒计时
⏳ Form/            # 增强表单组件
⏳ Table/           # 增强表格组件
⏳ Tree/            # 树形组件
⏳ Upload/          # 增强上传组件
⏳ Editor/          # 编辑器组件
⏳ Chart/           # 图表组件
⏳ Icon/            # 增强图标组件
⏳ Authority/       # 权限组件
```

---

## 借鉴计划

### 第一步：增强现有组件

#### 1. Form 表单组件增强

```tsx
// 参考 JNPF 的 BasicForm
interface FormConfig {
  layout?: 'horizontal' | 'vertical' | 'inline';
  labelCol?: { span: number };
  wrapperCol?: { span: number };
  labelWidth?: number;
  labelAlign?: 'left' | 'right';
}

// 统一的表单 Hook
const useForm = (config: FormConfig) => {
  const [form] = Form.useForm();
  
  const setValues = (values: Record<string, any>) => {
    form.setFieldsValue(values);
  };
  
  const getValues = () => {
    return form.getFieldsValue();
  };
  
  const validate = async () => {
    return await form.validateFields();
  };
  
  const reset = () => {
    form.resetFields();
  };
  
  return { form, setValues, getValues, validate, reset };
};
```

#### 2. Table 表格组件增强

```tsx
// 参考 JNPF 的 BasicTable
interface TableConfig {
  columns: ColumnType[];
  dataSource: any[];
  loading?: boolean;
  pagination?: PaginationConfig;
  actionColumn?: ActionColumnConfig;
  settings?: TableSettings;
}

// 统一的表格 Hook
const useTable = (config: TableConfig) => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({});
  
  const reload = async () => {
    setLoading(true);
    try {
      // 重新加载数据
    } finally {
      setLoading(false);
    }
  };
  
  const refresh = () => {
    // 刷新当前页
  };
  
  return { loading, dataSource, pagination, reload, refresh };
};
```

### 第二步：新增核心组件

#### 3. Button 按钮组件

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  size?: 'small' | 'middle' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  block?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type = 'default',
  size = 'middle',
  loading = false,
  disabled = false,
  icon,
  block = false,
  children,
  ...props
}) => {
  // 实现逻辑
};
```

#### 4. Modal 弹窗组件

```tsx
interface ModalProps {
  title?: React.ReactNode;
  visible?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  width?: number | string;
  footer?: React.ReactNode;
  centered?: boolean;
  maskClosable?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  title,
  visible = false,
  onOk,
  onCancel,
  width = 520,
  footer,
  centered = false,
  maskClosable = true,
  children,
}) => {
  // 实现逻辑
};
```

#### 5. Descriptions 描述列表组件

```tsx
interface DescriptionsProps {
  title?: React.ReactNode;
  bordered?: boolean;
  column?: number;
  size?: 'default' | 'middle' | 'small';
  items?: Array<{
    label: React.ReactNode;
    children: React.ReactNode;
    span?: number;
  }>;
}

const Descriptions: React.FC<DescriptionsProps> = ({
  title,
  bordered = true,
  column = 3,
  size = 'default',
  items = [],
}) => {
  // 实现逻辑
};
```

### 第三步：组件工具

#### 6. 组件注册机制

```tsx
// 参考 JNPF 的 componentMap.ts
const componentMap = new Map<string, React.ComponentType>();

const register = (name: string, component: React.ComponentType) => {
  componentMap.set(name, component);
};

const get = (name: string) => {
  return componentMap.get(name);
};

const getAll = () => {
  return Array.from(componentMap.entries());
};

export { register, get, getAll };
```

#### 7. 组件 Hooks 封装

```tsx
// 统一的组件 Hook
const useComponent = () => {
  // 组件通用逻辑
};

// 权限 Hook
const usePermission = () => {
  const { permissions } = usePermissionStore();
  
  const hasPermission = (code: string) => {
    return permissions?.includes(code) ?? false;
  };
  
  return { hasPermission };
};

// 加载 Hook
const useLoading = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);
  
  const withLoading = async (fn: () => Promise<any>) => {
    setLoading(true);
    try {
      return await fn();
    } finally {
      setLoading(false);
    }
  };
  
  return { loading, setLoading, withLoading };
};
```

---

## 实施计划

### Phase 1: 增强现有组件 (1 周)

- [ ] Form 表单组件增强
- [ ] Table 表格组件增强
- [ ] Icon 图标组件增强

### Phase 2: 新增核心组件 (2 周)

- [ ] Button 按钮组件
- [ ] Modal 弹窗组件
- [ ] Drawer 抽屉组件
- [ ] Dropdown 下拉菜单
- [ ] Descriptions 描述列表
- [ ] Card 卡片组件

### Phase 3: 高级组件 (3 周)

- [ ] Tree 树形组件
- [ ] Editor 编辑器组件
- [ ] Chart 图表组件
- [ ] Upload 增强上传组件
- [ ] FormGenerator 表单生成器

### Phase 4: 工具组件 (1 周)

- [ ] 组件注册机制
- [ ] 组件 Hooks 封装
- [ ] 权限组件
- [ ] 计数组件

---

## 总结

### JNPF 组件特点

- ✅ **组件丰富** (53 个组件)
- ✅ **分类清晰** (按功能分类)
- ✅ **封装完善** (Hooks + Types)
- ✅ **统一规范** (统一的 Props 和样式)
- ⚠️ **复杂度高** (适合大型项目)

### 我们的策略

- ✅ **借鉴思路** (不照搬代码)
- ✅ **保持简洁** (只实现核心的)
- ✅ **React 风格** (使用 React 最佳实践)
- ✅ **逐步完善** (不一次性完成)

---

**分析人**: Developer  
**日期**: 2026-03-28  
**下一步**: 按实施计划逐步完善组件
