# 基础表设计规范

**版本**: v1.1  
**更新时间**: 2026-03-28 16:36  
**用途**: 统一表结构规范

---

## 一、表命名规范

### 1.1 表名前缀规则

```
┌─────────────────────────────────────────────────────────────────┐
│                    表名前缀规则                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  base_*        - 基础表 (所有业务共享)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • base_user           - 用户表                           │  │
│  │  • base_admin_user     - 管理员表                         │  │
│  │  • base_role           - 角色表                           │  │
│  │  • base_menu           - 菜单表                           │  │
│  │  • base_dict_type      - 字典类型表                       │  │
│  │  • base_dict_item      - 字典项表                         │  │
│  │  • base_file           - 文件表                           │  │
│  │  • base_announcement   - 公告表                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  {业务名}_*    - 业务表 (特定业务使用)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  电商业务：                                               │  │
│  │  • ecommerce_order       - 订单表                         │  │
│  │  • ecommerce_product     - 商品表                         │  │
│  │  • ecommerce_cart        - 购物车表                       │  │
│  │                                                          │  │
│  │  OA 业务：                                                 │  │
│  │  • oa_attendance         - 考勤表                         │  │
│  │  • oa_leave              - 请假表                         │  │
│  │  • oa_meeting            - 会议表                         │  │
│  │                                                          │  │
│  │  CMS 业务：                                                │  │
│  │  • cms_article           - 文章表                         │  │
│  │  • cms_category          - 栏目表                         │  │
│  │                                                          │  │
│  │  党建业务：                                               │  │
│  │  • party_member          - 党员表                         │  │
│  │  • party_organization    - 党组织表                       │  │
│  │                                                          │  │
│  │  校园业务：                                               │  │
│  │  • campus_student        - 学生表                         │  │
│  │  • campus_teacher        - 教师表                         │  │
│  │  • campus_course         - 课程表                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 命名原则

```
┌─────────────────────────────────────────────────────────────────┐
│                    命名原则                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ base_* (基础表)                                             │
│  • 所有业务系统共享的基础数据                                   │
│  • 统一加 base_前缀                                             │
│  • 如：用户/角色/权限/字典/文件/公告等                          │
│                                                                 │
│  ✅ {业务名}_* (业务表)                                         │
│  • 特定业务系统的数据                                           │
│  • 业务名 + 表名，不加 base_前缀                                │
│  • 如：订单/商品/文章/考勤等                                    │
│                                                                 │
│  ✅ 命名规则：                                                  │
│  • 使用小写字母                                                 │
│  • 单词间用下划线分隔                                           │
│  • 使用单数形式 (统一)                                          │
│  • 语义清晰，避免缩写                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 二、通用字段规范

### 2.1 所有表必须包含的字段

```prisma
// 所有基础表的通用字段
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

## 三、基础表设计

### 3.1 用户表 (base_user)

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
  password    String   @db.VarChar(255)
  email       String   @unique @db.VarChar(100)
  phone       String?  @unique @db.VarChar(20)
  
  // 基本信息
  avatar      String?  @db.VarChar(500)
  nickname    String?  @db.VarChar(100)
  gender      String?  @db.VarChar(10)
  
  // 状态
  status      String   @default("ACTIVE") @db.VarChar(20)
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

### 3.2 管理员表 (base_admin_user)

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
  role        String   @default("OPERATOR") @db.VarChar(20)
  permissions String?  @db.Text
  
  // 状态
  status      String   @default("ACTIVE") @db.VarChar(20)
  
  // 安全
  failedAttempts Int    @default(0)
  lockedUntil   DateTime? @db.Timestamp(6)
  mustChangePassword Boolean @default(true)
  lastLoginAt   DateTime? @db.Timestamp(6)
  lastLoginIp   String?  @db.VarChar(50)
  allowedIpRanges String? @db.Text
  
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

### 3.3 角色表 (base_role)

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
  permissions String?  @db.Text
  enabled     Boolean  @default(true)
  isSystem    Boolean  @default(false)
  
  // ========== 关联 ==========
  users       BaseUserRole[]
  
  // ========== 索引 ==========
  @@index([code])
  @@index([enabled])
  @@index([isDeleted])
}
```

### 3.4 字典类型表 (base_dict_type)

```prisma
model BaseDictType {
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
  enabled     Boolean  @default(true)
  isSystem    Boolean  @default(false)
  
  // ========== 关联 ==========
  items       BaseDictItem[]
  
  // ========== 索引 ==========
  @@index([code])
  @@index([enabled])
  @@index([isDeleted])
}
```

### 3.5 字典项表 (base_dict_item)

```prisma
model BaseDictItem {
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
  color       String?  @db.VarChar(20)
  icon        String?  @db.VarChar(100)
  enabled     Boolean  @default(true)
  extra       Json?
  
  // ========== 关联 ==========
  type        BaseDictType @relation(fields: [typeId], references: [id], onDelete: Cascade)
  
  // ========== 索引 ==========
  @@index([typeId])
  @@index([enabled])
  @@unique([typeId, value])
  @@index([isDeleted])
}
```

### 3.6 公告表 (base_announcement)

```prisma
model BaseAnnouncement {
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
  title       String   @db.VarChar(200)
  content     String   @db.Text
  summary     String?  @db.VarChar(500)
  type        String   @default("notice") @db.VarChar(20)
  category    String?  @db.VarChar(50)
  scope       String   @default("all") @db.VarChar(20)
  priority    String   @default("normal") @db.VarChar(20)
  status      String   @default("draft") @db.VarChar(20)
  publishedBy String?  @db.VarChar(36)
  publishedAt DateTime? @db.Timestamp(6)
  startTime   DateTime? @db.Timestamp(6)
  endTime     DateTime? @db.Timestamp(6)
  isTop       Boolean  @default(false)
  topUntil    DateTime? @db.Timestamp(6)
  viewCount   Int      @default(0)
  attachments Json?
  
  // ========== 索引 ==========
  @@index([type])
  @@index([status])
  @@index([priority])
  @@index([publishedAt])
  @@index([isTop])
  @@index([isDeleted])
}
```

---

## 四、业务表示例

### 4.1 电商订单表 (ecommerce_order)

```prisma
model EcommerceOrder {
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
  orderNo     String   @unique @db.VarChar(50)
  userId      String   @db.VarChar(36)
  status      String   @default("PENDING") @db.VarChar(20)
  totalAmount Decimal  @db.Decimal(10, 2)
  payAmount   Decimal  @db.Decimal(10, 2)
  payTime     DateTime? @db.Timestamp(6)
  
  // ========== 索引 ==========
  @@index([orderNo])
  @@index([userId])
  @@index([status])
  @@index([isDeleted])
}
```

### 4.2 OA 考勤表 (oa_attendance)

```prisma
model OaAttendance {
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
  date        DateTime @db.Date
  checkInTime DateTime? @db.Timestamp(6)
  checkOutTime DateTime? @db.Timestamp(6)
  status      String   @default("NORMAL") @db.VarChar(20)
  
  // ========== 索引 ==========
  @@index([userId])
  @@index([date])
  @@index([status])
  @@index([isDeleted])
}
```

---

## 五、软删除规范

```typescript
// 软删除操作
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
// 自动添加 WHERE isDeleted = false

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

## 六、表命名完整列表

### 基础表 (base_*)

```
base_user              - 用户表
base_admin_user        - 管理员表
base_role              - 角色表
base_menu              - 菜单表
base_dict_type         - 字典类型表
base_dict_item         - 字典项表
base_file              - 文件表
base_announcement      - 公告表
base_notification      - 通知表
base_attachment        - 附件表
```

### 电商业务表 (ecommerce_*)

```
ecommerce_order        - 订单表
ecommerce_order_item   - 订单商品表
ecommerce_product      - 商品表
ecommerce_category     - 分类表
ecommerce_cart         - 购物车表
ecommerce_sku          - SKU 表
```

### OA 业务表 (oa_*)

```
oa_attendance          - 考勤表
oa_leave               - 请假表
oa_meeting             - 会议表
oa_task                - 任务表
oa_department          - 部门表
oa_employee            - 员工表
```

### CMS 业务表 (cms_*)

```
cms_article            - 文章表
cms_category           - 栏目表
cms_tag                - 标签表
cms_comment            - 评论表
```

---

**文档维护**: 小虾米  
**最后更新**: 2026-03-28 16:36
