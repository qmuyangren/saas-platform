# 基础业务表设计

**版本**: v1.0  
**更新时间**: 2026-03-28 15:54  
**用途**: 站内信/系统字典/行政区划

---

## 一、站内信相关表

### 1.1 MessageTemplate 表 (消息模板)

**用途**: 系统消息模板管理

```prisma
model MessageTemplate {
  id          String   @id @default(uuid()) @db.VarChar(36)
  
  // 模板信息
  name        String   // 模板名称
  code        String   @unique  // 模板代码 (如：USER_REGISTER, ORDER_CREATED)
  category    String   // 分类：system/user/order/finance
  
  // 模板内容
  title       String   // 消息标题 (支持变量：${username})
  content     String   @db.Text  // 消息内容 (支持 HTML/Markdown)
  
  // 发送渠道
  sendInApp   Boolean  @default(true)   // 站内信
  sendEmail   Boolean  @default(false)  // 邮件
  sendSms     Boolean  @default(false)  // 短信
  sendWechat  Boolean  @default(false)  // 微信
  
  // 变量定义 (JSON)
  variables   Json?    // [{"name": "username", "type": "string", "required": true}]
  
  // 状态
  enabled     Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([code])
  @@index([category])
}
```

**示例数据**:

```json
// 用户注册欢迎
{
  "id": "tpl-uuid-1",
  "name": "用户注册欢迎",
  "code": "USER_REGISTER",
  "category": "user",
  "title": "欢迎加入 ${username}！",
  "content": "亲爱的 ${username}，欢迎加入 SaaS 平台！您的账号已创建成功。",
  "sendInApp": true,
  "sendEmail": true,
  "sendSms": false,
  "sendWechat": false,
  "variables": [
    {"name": "username", "type": "string", "required": true}
  ],
  "enabled": true
}

// 订单创建通知
{
  "id": "tpl-uuid-2",
  "name": "订单创建通知",
  "code": "ORDER_CREATED",
  "category": "order",
  "title": "订单 ${orderNo} 创建成功",
  "content": "您的订单 ${orderNo} 已创建，金额：${amount} 元",
  "sendInApp": true,
  "sendEmail": true,
  "sendSms": true,
  "sendWechat": false
}
```

---

### 1.2 Message 表 (消息表)

**用途**: 用户站内信

```prisma
model Message {
  id          String   @id @default(uuid()) @db.VarChar(36)
  
  // 消息信息
  title       String
  content     String   @db.Text
  type        String   @default("system")  // system/user/system_broadcast
  
  // 发送者
  senderId    String?  @db.VarChar(36)  // 发送用户 ID (系统消息为空)
  senderName  String?
  
  // 接收者
  receiverId  String   @db.VarChar(36)
  receiverName String?
  
  // 模板关联
  templateId  String?  @db.VarChar(36)
  templateCode String?
  
  // 业务关联
  businessId  String?  // 业务 ID (如订单 ID)
  businessType String? // 业务类型
  
  // 状态
  isRead      Boolean  @default(false)
  readAt      DateTime?
  
  // 优先级
  priority    String   @default("normal")  // low/normal/high/urgent
  
  // 过期时间
  expiresAt   DateTime?
  
  createdAt   DateTime @default(now())
  
  // 关联
  receiver    User     @relation(fields: [receiverId], references: [id], onDelete: Cascade)
  
  @@index([receiverId])
  @@index([senderId])
  @@index([isRead])
  @@index([createdAt])
  @@index([priority])
}
```

---

### 1.3 MessageBatch 表 (消息批次)

**用途**: 批量消息发送记录

```prisma
model MessageBatch {
  id          String   @id @default(uuid()) @db.VarChar(36)
  
  // 批次信息
  name        String   // 批次名称
  templateId  String   @db.VarChar(36)
  
  // 发送范围
  targetType  String   // all/specific/segment
  targetIds   String?  @db.Text  // 目标用户 ID 列表 (JSON 数组)
  
  // 发送统计
  total       Int      @default(0)
  sent        Int      @default(0)
  success     Int      @default(0)
  failed      Int      @default(0)
  
  // 状态
  status      String   @default("pending")  // pending/sending/completed/failed
  
  // 错误信息
  errorMessage String?
  
  createdAt   DateTime @default(now())
  completedAt DateTime?
  
  @@index([status])
  @@index([createdAt])
}
```

---

## 二、系统字典表

### 2.1 DictType 表 (字典类型表)

**用途**: 字典类型定义

```prisma
model DictType {
  id          String   @id @default(uuid()) @db.VarChar(36)
  
  // 类型信息
  name        String   // 类型名称
  code        String   @unique  // 类型代码 (如：user_status, order_type)
  
  // 描述
  description String?
  
  // 状态
  enabled     Boolean  @default(true)
  
  // 系统内置 (系统内置字典不可删除)
  isSystem    Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // 关联
  items       DictItem[]
  
  @@index([code])
  @@index([enabled])
}
```

**示例数据**:

```json
// 用户状态
{
  "id": "dicttype-uuid-1",
  "name": "用户状态",
  "code": "user_status",
  "description": "系统用户的状态",
  "enabled": true,
  "isSystem": true
}

// 订单类型
{
  "id": "dicttype-uuid-2",
  "name": "订单类型",
  "code": "order_type",
  "description": "订单业务类型",
  "enabled": true,
  "isSystem": false
}

// 性别
{
  "id": "dicttype-uuid-3",
  "name": "性别",
  "code": "gender",
  "description": "用户性别",
  "enabled": true,
  "isSystem": true
}
```

---

### 2.2 DictItem 表 (字典数据表)

**用途**: 字典项数据

```prisma
model DictItem {
  id          String   @id @default(uuid()) @db.VarChar(36)
  typeId      String   @db.VarChar(36)
  
  // 字典项信息
  label       String   // 显示标签
  value       String   // 存储值
  code        String?  // 代码 (可选，用于程序引用)
  
  // 排序
  sortOrder   Int      @default(0)
  
  // 样式
  color       String?  // 标签颜色
  icon        String?  // 图标
  
  // 状态
  enabled     Boolean  @default(true)
  
  // 扩展属性 (JSON)
  extra       Json?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // 关联
  type        DictType @relation(fields: [typeId], references: [id], onDelete: Cascade)
  
  @@index([typeId])
  @@index([enabled])
  @@unique([typeId, value])
}
```

**示例数据**:

```json
// 用户状态字典项
[
  {
    "id": "dictitem-uuid-1",
    "typeId": "dicttype-uuid-1",
    "label": "激活",
    "value": "ACTIVE",
    "code": "active",
    "sortOrder": 1,
    "color": "green",
    "enabled": true
  },
  {
    "id": "dictitem-uuid-2",
    "typeId": "dicttype-uuid-1",
    "label": "禁用",
    "value": "DISABLED",
    "code": "disabled",
    "sortOrder": 2,
    "color": "red",
    "enabled": true
  },
  {
    "id": "dictitem-uuid-3",
    "typeId": "dicttype-uuid-1",
    "label": "锁定",
    "value": "LOCKED",
    "code": "locked",
    "sortOrder": 3,
    "color": "orange",
    "enabled": true
  }
]

// 性别字典项
[
  {
    "id": "dictitem-uuid-10",
    "typeId": "dicttype-uuid-3",
    "label": "男",
    "value": "MALE",
    "code": "male",
    "sortOrder": 1,
    "enabled": true
  },
  {
    "id": "dictitem-uuid-11",
    "typeId": "dicttype-uuid-3",
    "label": "女",
    "value": "FEMALE",
    "code": "female",
    "sortOrder": 2,
    "enabled": true
  },
  {
    "id": "dictitem-uuid-12",
    "typeId": "dicttype-uuid-3",
    "label": "未知",
    "value": "UNKNOWN",
    "code": "unknown",
    "sortOrder": 3,
    "enabled": true
  }
]
```

---

## 三、行政区划表

### 3.1 Region 表 (行政区划表)

**用途**: 中国行政区划数据 (省/市/区/街道)

```prisma
model Region {
  id          String   @id @default(uuid()) @db.VarChar(36)
  
  // 区划代码 (国家标准 GB/T 2260)
  code        String   @unique  // 如：110000 (北京市), 110100 (北京市市辖区)
  
  // 名称
  name        String
  fullName    String   // 完整名称 (如：北京市/北京市/东城区)
  
  // 级别
  level       String   // province/city/district/street
  
  // 层级关系
  parentId    String?  @db.VarChar(36)
  parentPath  String?  // 父级路径 (如：110000/110100)
  
  // 拼音
  pinyin      String?
  pinyinInitial String?  // 拼音首字母
  
  // 坐标
  longitude   Decimal? @db.Decimal(10, 6)
  latitude    Decimal? @db.Decimal(10, 6)
  
  // 状态
  enabled     Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // 自关联
  parent      Region?  @relation("RegionChildren", fields: [parentId], references: [id])
  children    Region[] @relation("RegionChildren")
  
  @@index([code])
  @@index([parentId])
  @@index([level])
  @@index([enabled])
}
```

**示例数据**:

```json
// 北京市
{
  "id": "region-uuid-1",
  "code": "110000",
  "name": "北京市",
  "fullName": "北京市",
  "level": "province",
  "parentId": null,
  "parentPath": "",
  "pinyin": "beijing",
  "pinyinInitial": "BJ",
  "longitude": 116.407526,
  "latitude": 39.90403,
  "enabled": true
}

// 北京市市辖区
{
  "id": "region-uuid-2",
  "code": "110100",
  "name": "市辖区",
  "fullName": "北京市/市辖区",
  "level": "city",
  "parentId": "region-uuid-1",
  "parentPath": "110000",
  "pinyin": "shixiaqu",
  "pinyinInitial": "SXQ",
  "enabled": true
}

// 东城区
{
  "id": "region-uuid-3",
  "code": "110101",
  "name": "东城区",
  "fullName": "北京市/市辖区/东城区",
  "level": "district",
  "parentId": "region-uuid-2",
  "parentPath": "110000/110100",
  "pinyin": "dongchengqu",
  "pinyinInitial": "DCQ",
  "longitude": 116.418757,
  "latitude": 39.917544,
  "enabled": true
}
```

---

### 3.2 RegionStats 表 (区划统计)

**用途**: 行政区划统计数据

```prisma
model RegionStats {
  id          String   @id @default(uuid()) @db.VarChar(36)
  regionId    String   @db.VarChar(36)
  
  // 统计日期
  statDate    DateTime @db.Date
  
  // 用户统计
  userCount   Int      @default(0)
  activeUserCount Int  @default(0)
  
  // 订单统计
  orderCount  Int      @default(0)
  orderAmount Decimal  @default(0) @db.Decimal(10, 2)
  
  // 其他统计
  extraStats  Json?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([regionId, statDate])
  @@index([regionId])
  @@index([statDate])
}
```

---

## 四、常用字典类型参考

```
┌─────────────────────────────────────────────────────────────────┐
│                    推荐字典类型                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  【用户相关】                                                   │
│  • user_status      - 用户状态 (ACTIVE/DISABLED/LOCKED)         │
│  • user_role        - 用户角色 (ADMIN/USER/VIP)                 │
│  • gender           - 性别 (MALE/FEMALE/UNKNOWN)                │
│  • user_level       - 用户等级 (普通/白银/黄金/钻石)            │
│                                                                 │
│  【订单相关】                                                   │
│  • order_status     - 订单状态 (待支付/已支付/发货中/已完成)    │
│  • order_type       - 订单类型 (普通/团购/秒杀)                 │
│  • payment_method   - 支付方式 (微信/支付宝/银行卡)             │
│  • payment_status   - 支付状态 (未支付/已支付/退款中/已退款)    │
│                                                                 │
│  【系统相关】                                                   │
│  • yes_no           - 是否 (1/0)                                │
│  • enable_disable   - 启用禁用 (1/0)                            │
│  • notice_type      - 通知类型 (系统/活动/公告)                 │
│                                                                 │
│  【业务相关】                                                   │
│  • product_status   - 商品状态 (上架/下架/售罄)                 │
│  • audit_status     - 审核状态 (待审核/通过/拒绝)               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 五、字典管理后台

```
┌─────────────────────────────────────────────────────────────────┐
│                    后台管理 - 字典管理                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 字典类型管理                                                │
│     ┌──────────────────────────────────────────────────────┐   │
│     │  [新增类型]                                           │   │
│     │                                                       │   │
│     │  类型列表：                                           │   │
│     │  ┌──────┬──────────┬────────┬────────┬────────────┐  │   │
│     │  │ 状态 │ 类型名称 │ 代码   │ 项数   │ 操作       │  │   │
│     │  ├──────┼──────────┼────────┼────────┼────────────┤  │   │
│     │  │ ✅   │ 用户状态 │ user_status │ 3   │ 编辑/删除 │  │   │
│     │  │ ✅   │ 订单类型 │ order_type │ 5   │ 编辑/删除 │  │   │
│     │  │ ✅   │ 性别     │ gender  │ 3    │ 编辑/删除 │  │   │
│     │  └──────┴──────────┴────────┴────────┴────────────┘  │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
│  2. 字典数据管理                                                │
│     ┌──────────────────────────────────────────────────────┐   │
│     │  字典类型：用户状态                                   │   │
│     │                                                       │   │
│     │  [新增字典项]                                         │   │
│     │                                                       │   │
│     │  数据列表：                                           │   │
│     │  ┌──────┬────────┬────────┬──────┬────────┬───────┐  │   │
│     │  │ 排序 │ 标签   │ 值     │ 颜色 │ 状态   │ 操作  │  │   │
│     │  ├──────┼────────┼────────┼──────┼────────┼───────┤  │   │
│     │  │ 1    │ 激活   │ ACTIVE │ 绿色 │ ✅     │ 编辑  │  │   │
│     │  │ 2    │ 禁用   │ DISABLED│ 红色│ ✅     │ 编辑  │  │   │
│     │  │ 3    │ 锁定   │ LOCKED │ 橙色 │ ✅     │ 编辑  │  │   │
│     │  └──────┴────────┴────────┴──────┴────────┴───────┘  │   │
│     │                                                       │   │
│     │  预览效果：                                           │   │
│     │  [🟢 激活] [🔴 禁用] [🟠 锁定]                        │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
│  3. 行政区划管理                                                │
│     ┌──────────────────────────────────────────────────────┐   │
│     │  省市区联动选择器                                     │   │
│     │  [北京市] [市辖区] [东城区]                           │   │
│     │                                                       │   │
│     │  区划详情：                                           │   │
│     │  • 区划代码：110101                                  │   │
│     │  • 全称：北京市/市辖区/东城区                         │   │
│     │  • 拼音：dongchengqu (DCQ)                           │   │
│     │  • 坐标：116.418757, 39.917544                       │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 六、ER 图

```
┌─────────────────────────────────────────────────────────────────┐
│                    基础业务表 ER 图                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  MessageTemplate (1) ────< Message (N)                          │
│                               │                                 │
│                               │                                 │
│  User (1) ────────────────────┘                                 │
│                                                                 │
│  DictType (1) ────────────< DictItem (N)                        │
│                                                                 │
│  Region (1) ──< Region (自关联)                                 │
│       │                                                         │
│       └────< RegionStats (N)                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 七、数据初始化

### 行政区划数据源

```
数据来源：
• 国家统计局 GB/T 2260
• 高德地图 API
• 阿里云行政区划 API

数据量：
• 省级：34 个 (省/自治区/直辖市/特别行政区)
• 地级：333 个 (地级市/地区/自治州)
• 县级：2844 个 (市辖区/县级市/县)
• 乡级：约 4 万个 (街道/镇/乡)

更新频率：
• 每年更新一次 (行政区划会调整)
• 提供数据导入脚本
```

### 内置字典数据

```
系统初始化时自动创建:
• user_status (用户状态)
• gender (性别)
• yes_no (是否)
• enable_disable (启用禁用)

业务字典手动创建:
• order_status (订单状态)
• order_type (订单类型)
• product_status (商品状态)
```

---

**文档维护**: 小虾米  
**最后更新**: 2026-03-28 15:54
