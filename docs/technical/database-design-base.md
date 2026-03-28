# 基础表设计规范

**版本**: v1.0  
**更新时间**: 2026-03-28 16:27  
**用途**: 统一表结构规范

---

## 一、表命名规范

### 1.1 表名前缀规则

```
┌─────────────────────────────────────────────────────────────────┐
│                    表名前缀规则                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  base_*        - 基础业务表 (用户/角色/权限等)                  │
│  auth_*        - 认证相关表 (OAuth/Token 等)                     │
│  sys_*         - 系统配置表 (配置/字典/日志等)                  │
│  biz_*         - 业务数据表 (订单/商品等)                        │
│  file_*        - 文件存储表                                     │
│  msg_*         - 消息通知表                                     │
│  stat_*        - 统计表                                         │
│                                                                 │
│  示例：                                                         │
│  • base_user           - 用户表                                 │
│  • base_role           - 角色表                                 │
│  • auth_oauth_client   - OAuth 客户端表                          │
│  • sys_config          - 系统配置表                             │
│  • sys_dict_type       - 字典类型表                             │
│  • biz_order           - 订单表                                 │
│  • file_storage        - 文件存储表                             │
│  • msg_announcement    - 公告表                                 │
│  • stat_user_daily     - 用户日统计表                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 表名命名规则

```
• 使用小写字母
• 单词间用下划线分隔
• 使用复数形式 (可选，统一即可)
• 语义清晰，避免缩写

✅ 正确：
• base_user
• base_admin_user
• sys_dict_type
• biz_order_item

❌ 错误：
• User (大写)
• t_user (无意义前缀)
• usr (缩写)
• orders (时而复数时而单数)
```

---

## 二、通用字段规范

### 2.1 所有表必须包含的字段

```prisma
// 所有基础表的通用字段 mixin
model BaseFields {
  // 主键
  id          String   @id @default(uuid()) @db.VarChar(36)
  
  // 审计字段 - 创建
  createdBy   String?  @db.VarChar(36)  // 创建人 ID
  createdAt   DateTime @default(now()) @db.Timestamp(6)  // 创建时间
  
  // 审计字段 - 更新
  updatedBy   String?  @db.VarChar(36)  // 更新人 ID
  updatedAt   DateTime @updatedAt @db.Timestamp(6)  // 更新时间
  
  // 审计字段 - 删除 (软删除)
  deletedBy   String?  @db.VarChar(36)  // 删除人 ID
  deletedAt   DateTime? @db.Timestamp(6)  // 删除时间
  isDeleted   Boolean  @default(false)  // 是否删除
  
  // 排序
  sortOrder   Int      @default(0)  // 排序字段
  
  // 备注
  remark      String?  @db.VarChar(500)  // 备注/说明
  
  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
  @@index([isDeleted])
  @@index([sortOrder])
}
```

### 2.2 字段说明

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | VARCHAR(36) | 是 | uuid() | 主键，UUID 格式 |
| createdBy | VARCHAR(36) | 否 | - | 创建人 ID (关联用户表) |
| createdAt | TIMESTAMP(6) | 是 | now() | 创建时间 (自动) |
| updatedBy | VARCHAR(36) | 否 | - | 更新人 ID (关联用户表) |
| updatedAt | TIMESTAMP(6) | 是 | updatedAt | 更新时间 (自动) |
| deletedBy | VARCHAR(36) | 否 | - | 删除人 ID (关联用户表) |
| deletedAt | TIMESTAMP(6) | 否 | - | 删除时间 (软删除) |
| isDeleted | BOOLEAN | 是 | false | 是否删除标记 |
| sortOrder | INT | 是 | 0 | 排序字段 (升序) |
| remark | VARCHAR(500) | 否 | - | 备注说明 |

---

## 三、软删除规范

### 3.1 软删除实现

```prisma
// 软删除 mixin
model SoftDelete {
  deletedBy   String?  @db.VarChar(36)
  deletedAt   DateTime? @db.Timestamp(6)
  isDeleted   Boolean  @default(false)
  
  @@index([isDeleted])
  @@index([deletedAt])
}

// 使用示例
model BaseUser {
  // 通用字段
  id          String   @id @default(uuid()) @db.VarChar(36)
  createdBy   String?  @db.VarChar(36)
  createdAt   DateTime @default(now()) @db.Timestamp(6)
  updatedBy   String?  @db.VarChar(36)
  updatedAt   DateTime @updatedAt @db.Timestamp(6)
  
  // 软删除
  deletedBy   String?  @db.VarChar(36)
  deletedAt   DateTime? @db.Timestamp(6)
  isDeleted   Boolean  @default(false)
  
  // 业务字段
  username    String   @unique
  email       String   @unique
  
  @@index([isDeleted])
}
```

### 3.2 软删除查询

```typescript
// Prisma 查询中间件 (自动过滤已删除数据)
prisma.$use(async (params, next) => {
  // 查询前添加过滤条件
  if (params.model === 'BaseUser') {
    if (params.action === 'findMany' || params.action === 'findFirst') {
      if (!params.args.where) {
        params.args.where = {};
      }
      params.args.where.isDeleted = false;
    }
  }
  return next(params);
});

// 软删除操作
await prisma.baseUser.update({
  where: { id: userId },
  data: {
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: currentUserId
  }
});

// 查询已删除的数据
await prisma.baseUser.findMany({
  where: {
    isDeleted: true
  }
});

// 恢复已删除的数据
await prisma.baseUser.update({
  where: { id: userId },
  data: {
    isDeleted: false,
    deletedAt: null,
    deletedBy: null
  }
});
```

---

## 四、基础表设计

### 4.1 用户表 (base_user)

```prisma
model BaseUser {
  // ========== 通用字段 ==========
  id          String   @id @default(uuid()) @db.VarChar(36)
  createdBy   String?  @db.VarChar(36)
  createdAt   DateTime @default(now()) @db.Timestamp(6)
  updatedBy   String?  @db.VarChar(36)
  updatedAt   DateTime @updatedAt @db.Timestamp(6)
  deletedBy   String?  @db.VarChar(36)
  deletedAt   DateTime? @db.Timestamp(6)
  isDeleted   Boolean  @default(false)
  sortOrder   Int      @default(0)
  remark      String?  @db.VarChar(500)
  
  // ========== 业务字段 ==========
  // 账号信息
  username    String   @unique @db.VarChar(50)
  password    String   @db.VarChar(255)  // bcrypt 加密
  email       String   @unique @db.VarChar(100)
  phone       String?  @unique @db.VarChar(20)
  
  // 基本信息
  avatar      String?  @db.VarChar(500)
  nickname    String?  @db.VarChar(100)
  gender      String?  @db.VarChar(10)  // MALE/FEMALE/UNKNOWN
  
  // 状态
  status      String   @default("ACTIVE") @db.VarChar(20)  // ACTIVE/DISABLED/LOCKED
  isEmailVerified Boolean @default(false)
  isPhoneVerified Boolean @default(false)
  
  // 安全
  failedAttempts Int    @default(0)
  lockedUntil   DateTime? @db.Timestamp(6)
  mustChangePassword Boolean @default(false)
  lastLoginAt   DateTime? @db.Timestamp(6)
  lastLoginIp   String?  @db.VarChar(50)
  
  // 扩展
  extra       Json?
  
  // ========== 索引 ==========
  @@index([username])
  @@index([email])
  @@index([phone])
  @@index([status])
  @@index([isDeleted])
}
```

### 4.2 管理员表 (base_admin_user)

```prisma
model BaseAdminUser {
  // ========== 通用字段 ==========
  id          String   @id @default(uuid()) @db.VarChar(36)
  createdBy   String?  @db.VarChar(36)
  createdAt   DateTime @default(now()) @db.Timestamp(6)
  updatedBy   String?  @db.VarChar(36)
  updatedAt   DateTime @updatedAt @db.Timestamp(6)
  deletedBy   String?  @db.VarChar(36)
  deletedAt   DateTime? @db.Timestamp(6)
  isDeleted   Boolean  @default(false)
  sortOrder   Int      @default(0)
  remark      String?  @db.VarChar(500)
  
  // ========== 业务字段 ==========
  // 账号信息
  username    String   @unique @db.VarChar(50)
  password    String   @db.VarChar(255)
  email       String   @unique @db.VarChar(100)
  phone       String?  @unique @db.VarChar(20)
  
  // 基本信息
  avatar      String?  @db.VarChar(500)
  nickname    String?  @db.VarChar(100)
  
  // 角色和权限
  role        String   @default("OPERATOR") @db.VarChar(20)  // SUPER_ADMIN/ADMIN/OPERATOR/AUDITOR
  permissions String?  @db.Text  // JSON 数组
  
  // 状态
  status      String   @default("ACTIVE") @db.VarChar(20)  // ACTIVE/DISABLED/LOCKED
  
  // 安全
  failedAttempts Int    @default(0)
  lockedUntil   DateTime? @db.Timestamp(6)
  mustChangePassword Boolean @default(true)
  lastLoginAt   DateTime? @db.Timestamp(6)
  lastLoginIp   String?  @db.VarChar(50)
  allowedIpRanges String? @db.Text  // JSON 数组
  
  // 双因素认证
  twoFactorEnabled Boolean @default(false)
  twoFactorSecret  String? @db.VarChar(255)
  
  // ========== 索引 ==========
  @@index([username])
  @@index([email])
  @@index([status])
  @@index([isDeleted])
}
```

### 4.3 角色表 (base_role)

```prisma
model BaseRole {
  // ========== 通用字段 ==========
  id          String   @id @default(uuid()) @db.VarChar(36)
  createdBy   String?  @db.VarChar(36)
  createdAt   DateTime @default(now()) @db.Timestamp(6)
  updatedBy   String?  @db.VarChar(36)
  updatedAt   DateTime @updatedAt @db.Timestamp(6)
  deletedBy   String?  @db.VarChar(36)
  deletedAt   DateTime? @db.Timestamp(6)
  isDeleted   Boolean  @default(false)
  sortOrder   Int      @default(0)
  remark      String?  @db.VarChar(500)
  
  // ========== 业务字段 ==========
  name        String   @db.VarChar(100)
  code        String   @unique @db.VarChar(50)
  description String?  @db.VarChar(500)
  
  // 权限
  permissions String?  @db.Text  // JSON 数组
  
  // 状态
  enabled     Boolean  @default(true)
  isSystem    Boolean  @default(false)  // 系统内置角色
  
  // ========== 关联 ==========
  users       BaseUserRole[]
  
  // ========== 索引 ==========
  @@index([code])
  @@index([enabled])
  @@index([isDeleted])
}
```

### 4.4 用户角色关联表 (base_user_role)

```prisma
model BaseUserRole {
  // ========== 通用字段 ==========
  id          String   @id @default(uuid()) @db.VarChar(36)
  createdBy   String?  @db.VarChar(36)
  createdAt   DateTime @default(now()) @db.Timestamp(6)
  updatedBy   String?  @db.VarChar(36)
  updatedAt   DateTime @updatedAt @db.Timestamp(6)
  deletedBy   String?  @db.VarChar(36)
  deletedAt   DateTime? @db.Timestamp(6)
  isDeleted   Boolean  @default(false)
  sortOrder   Int      @default(0)
  remark      String?  @db.VarChar(500)
  
  // ========== 业务字段 ==========
  userId      String   @db.VarChar(36)
  roleId      String   @db.VarChar(36)
  
  // ========== 关联 ==========
  user        BaseUser @relation(fields: [userId], references: [id], onDelete: Cascade)
  role        BaseRole @relation(fields: [roleId], references: [id], onDelete: Cascade)
  
  // ========== 索引 ==========
  @@unique([userId, roleId])
  @@index([userId])
  @@index([roleId])
  @@index([isDeleted])
}
```

---

## 五、系统表设计

### 5.1 系统配置表 (sys_config)

```prisma
model SysConfig {
  // ========== 通用字段 ==========
  id          String   @id @default(uuid()) @db.VarChar(36)
  createdBy   String?  @db.VarChar(36)
  createdAt   DateTime @default(now()) @db.Timestamp(6)
  updatedBy   String?  @db.VarChar(36)
  updatedAt   DateTime @updatedAt @db.Timestamp(6)
  deletedBy   String?  @db.VarChar(36)
  deletedAt   DateTime? @db.Timestamp(6)
  isDeleted   Boolean  @default(false)
  sortOrder   Int      @default(0)
  remark      String?  @db.VarChar(500)
  
  // ========== 业务字段 ==========
  configKey   String   @unique @db.VarChar(100)
  configValue String   @db.Text
  configType  String   @default("string") @db.VarChar(20)  // string/number/boolean/json
  
  // 分组
  group       String?  @db.VarChar(50)
  
  // 描述
  name        String?  @db.VarChar(100)
  description String?  @db.VarChar(500)
  
  // 状态
  enabled     Boolean  @default(true)
  
  // ========== 索引 ==========
  @@index([configKey])
  @@index([group])
  @@index([enabled])
  @@index([isDeleted])
}
```

### 5.2 字典类型表 (sys_dict_type)

```prisma
model SysDictType {
  // ========== 通用字段 ==========
  id          String   @id @default(uuid()) @db.VarChar(36)
  createdBy   String?  @db.VarChar(36)
  createdAt   DateTime @default(now()) @db.Timestamp(6)
  updatedBy   String?  @db.VarChar(36)
  updatedAt   DateTime @updatedAt @db.Timestamp(6)
  deletedBy   String?  @db.VarChar(36)
  deletedAt   DateTime? @db.Timestamp(6)
  isDeleted   Boolean  @default(false)
  sortOrder   Int      @default(0)
  remark      String?  @db.VarChar(500)
  
  // ========== 业务字段 ==========
  name        String   @db.VarChar(100)
  code        String   @unique @db.VarChar(50)
  description String?  @db.VarChar(500)
  
  // 状态
  enabled     Boolean  @default(true)
  isSystem    Boolean  @default(false)
  
  // ========== 关联 ==========
  items       SysDictItem[]
  
  // ========== 索引 ==========
  @@index([code])
  @@index([enabled])
  @@index([isDeleted])
}
```

### 5.3 字典项表 (sys_dict_item)

```prisma
model SysDictItem {
  // ========== 通用字段 ==========
  id          String   @id @default(uuid()) @db.VarChar(36)
  createdBy   String?  @db.VarChar(36)
  createdAt   DateTime @default(now()) @db.Timestamp(6)
  updatedBy   String?  @db.VarChar(36)
  updatedAt   DateTime @updatedAt @db.Timestamp(6)
  deletedBy   String?  @db.VarChar(36)
  deletedAt   DateTime? @db.Timestamp(6)
  isDeleted   Boolean  @default(false)
  sortOrder   Int      @default(0)
  remark      String?  @db.VarChar(500)
  
  // ========== 业务字段 ==========
  typeId      String   @db.VarChar(36)
  label       String   @db.VarChar(100)
  value       String   @db.VarChar(100)
  code        String?  @db.VarChar(50)
  
  // 样式
  color       String?  @db.VarChar(20)
  icon        String?  @db.VarChar(100)
  
  // 状态
  enabled     Boolean  @default(true)
  
  // 扩展
  extra       Json?
  
  // ========== 关联 ==========
  type        SysDictType @relation(fields: [typeId], references: [id], onDelete: Cascade)
  
  // ========== 索引 ==========
  @@index([typeId])
  @@index([enabled])
  @@unique([typeId, value])
  @@index([isDeleted])
}
```

---

## 六、IP 安全表设计

### 6.1 IP 黑名单表 (sys_ip_blacklist)

```prisma
model SysIpBlacklist {
  // ========== 通用字段 ==========
  id          String   @id @default(uuid()) @db.VarChar(36)
  createdBy   String?  @db.VarChar(36)
  createdAt   DateTime @default(now()) @db.Timestamp(6)
  updatedBy   String?  @db.VarChar(36)
  updatedAt   DateTime @updatedAt @db.Timestamp(6)
  deletedBy   String?  @db.VarChar(36)
  deletedAt   DateTime? @db.Timestamp(6)
  isDeleted   Boolean  @default(false)
  sortOrder   Int      @default(0)
  remark      String?  @db.VarChar(500)
  
  // ========== 业务字段 ==========
  ip          String?  @unique @db.VarChar(50)
  ipRange     String?  @db.VarChar(50)
  
  // 原因
  reason      String   @db.VarChar(500)
  evidence    String?  @db.Text  // JSON
  
  // 级别
  level       String   @default("medium") @db.VarChar(20)  // low/medium/high/critical
  
  // 状态
  enabled     Boolean  @default(true)
  
  // 过期
  expiresAt   DateTime? @db.Timestamp(6)
  
  // 统计
  hitCount    Int      @default(0)
  lastHitAt   DateTime? @db.Timestamp(6)
  
  // ========== 索引 ==========
  @@index([ip])
  @@index([ipRange])
  @@index([enabled])
  @@index([level])
  @@index([isDeleted])
}
```

---

## 七、Prisma Schema 示例

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ========== 通用字段 Mixin ==========
// 注意：Prisma 不支持真正的 mixin，需要手动复制到每个 model

// ========== 基础表 ==========
model BaseUser {
  // 通用字段
  id          String   @id @default(uuid()) @db.VarChar(36)
  createdBy   String?  @db.VarChar(36)
  createdAt   DateTime @default(now()) @db.Timestamp(6)
  updatedBy   String?  @db.VarChar(36)
  updatedAt   DateTime @updatedAt @db.Timestamp(6)
  deletedBy   String?  @db.VarChar(36)
  deletedAt   DateTime? @db.Timestamp(6)
  isDeleted   Boolean  @default(false)
  sortOrder   Int      @default(0)
  remark      String?  @db.VarChar(500)
  
  // 业务字段
  username    String   @unique @db.VarChar(50)
  email       String   @unique @db.VarChar(100)
  phone       String?  @unique @db.VarChar(20)
  password    String   @db.VarChar(255)
  status      String   @default("ACTIVE") @db.VarChar(20)
  
  @@index([isDeleted])
}

// ... 其他表类似结构
```

---

## 八、使用示例

### 8.1 创建记录

```typescript
// 创建用户
const user = await prisma.baseUser.create({
  data: {
    username: 'admin',
    email: 'admin@example.com',
    password: hashedPassword,
    createdBy: currentUserId,
    updatedBy: currentUserId
  }
});

// 创建角色
const role = await prisma.baseRole.create({
  data: {
    name: '管理员',
    code: 'ADMIN',
    createdBy: currentUserId,
    updatedBy: currentUserId,
    sortOrder: 1
  }
});
```

### 8.2 更新记录

```typescript
// 更新用户
await prisma.baseUser.update({
  where: { id: userId },
  data: {
    email: 'new@example.com',
    updatedBy: currentUserId
    // updatedAt 会自动更新
  }
});
```

### 8.3 软删除

```typescript
// 软删除用户
await prisma.baseUser.update({
  where: { id: userId },
  data: {
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: currentUserId
  }
});

// 查询自动过滤已删除
const users = await prisma.baseUser.findMany();
// 自动添加 where: { isDeleted: false }
```

### 8.4 恢复删除

```typescript
// 恢复用户
await prisma.baseUser.update({
  where: { id: userId },
  data: {
    isDeleted: false,
    deletedAt: null,
    deletedBy: null
  }
});
```

---

**文档维护**: 小虾米  
**最后更新**: 2026-03-28 16:27
