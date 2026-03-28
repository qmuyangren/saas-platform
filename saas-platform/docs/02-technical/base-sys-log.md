# 系统日志表设计

**版本**: v1.0  
**更新时间**: 2026-03-28 16:42  
**用途**: 系统日志/操作日志/登录日志

---

## 一、系统日志表 (base_sys_log)

### 1.1 表结构

```prisma
model BaseSysLog {
  // ========== 通用字段 ==========
  id          String   @id @default(uuid()) @db.VarChar(36)
  createdBy   String?  @db.VarChar(36)
  createdAt   DateTime @default(now()) @db.Timestamp(6)
  updatedBy   String?  @db.VarChar(36)
  updatedAt   DateTime @updatedAt @db.Timestamp(6)
  deletedBy   String?  @db.VarChar(36)
  deletedAt   DateTime? @db.Timestamp(6)
  isDeleted   Boolean  @default(false)
  sort        Int      @default(0)  // 排序字段 (简化命名)
  remark      String?  @db.VarChar(500)
  
  // ========== 业务字段 ==========
  // 自然主键 (业务主键，可用于去重)
  bizId       String   @unique @db.VarChar(50)
  
  // 用户信息
  userId      String?  @db.VarChar(50)
  userName    String?  @db.VarChar(100)
  
  // 日志类型
  logType     Int      @db.Int  // 1=登录 2=操作 3=异常 4=系统
  
  // 日志级别
  logLevel    Int      @db.Int  // 1=DEBUG 2=INFO 3=WARN 4=ERROR 5=FATAL
  
  // IP 信息
  ipAddress   String?  @db.VarChar(50)
  ipAddressLocation String? @db.VarChar(100)  // IP 所在城市
  
  // 请求信息
  requestUrl      String? @db.VarChar(500)
  requestMethod   String? @db.VarChar(50)
  requestDuration Int?    @db.Int  // 毫秒
  requestParam    String? @db.Text  // 请求参数 (JSON)
  requestTarget   String? @db.Text  // 请求目标 (方法签名)
  
  // 日志内容
  content     String?  @db.Text  // 日志详细信息 (JSON)
  
  // 平台设备
  platform    String?  @db.VarChar(100)
  browser     String?  @db.VarChar(100)
  
  // 模块信息
  moduleId    String?  @db.VarChar(50)
  moduleName  String?  @db.VarChar(100)
  
  // 对象信息
  objectId    String?  @db.VarChar(50)
  description String?  @db.VarChar(500)
  
  // 租户 ID
  tenantId    String   @default("0") @db.VarChar(50)
  
  // 登录相关 (登录日志专用)
  isLoginSuccess Boolean? @default(false)
  loginType   Int?     @db.Int  // 1=账号密码 2=手机验证码 3=邮箱验证码 4=第三方
  
  // ========== 索引 ==========
  @@index([bizId])
  @@index([userId])
  @@index([logType])
  @@index([logLevel])
  @@index([ipAddress])
  @@index([createdAt])
  @@index([tenantId])
  @@index([isDeleted])
}
```

---

### 1.2 字段说明

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| **主键字段** |
| id | VARCHAR(36) | 是 | uuid() | UUID 主键 |
| bizId | VARCHAR(50) | 是 | - | 自然主键 (业务主键，用于去重) |
| **通用字段** |
| createdBy | VARCHAR(36) | 否 | - | 创建人 ID |
| createdAt | TIMESTAMP(6) | 是 | now() | 创建时间 |
| updatedBy | VARCHAR(36) | 否 | - | 更新人 ID |
| updatedAt | TIMESTAMP(6) | 是 | updatedAt | 更新时间 |
| deletedBy | VARCHAR(36) | 否 | - | 删除人 ID |
| deletedAt | TIMESTAMP(6) | 否 | - | 删除时间 |
| isDeleted | BOOLEAN | 是 | false | 是否删除 |
| sort | INT | 是 | 0 | 排序字段 |
| remark | VARCHAR(500) | 否 | - | 备注说明 |
| **用户信息** |
| userId | VARCHAR(50) | 否 | - | 用户主键 |
| userName | VARCHAR(100) | 否 | - | 用户名 (冗余，方便查询) |
| **日志分类** |
| logType | INT | 是 | - | 日志类型 (1 登录/2 操作/3 异常/4 系统) |
| logLevel | INT | 是 | - | 日志级别 (1DEBUG/2INFO/3WARN/4ERROR/5FATAL) |
| **IP 信息** |
| ipAddress | VARCHAR(50) | 否 | - | IP 地址 |
| ipAddressLocation | VARCHAR(100) | 否 | - | IP 所在城市 |
| **请求信息** |
| requestUrl | VARCHAR(500) | 否 | - | 请求地址 |
| requestMethod | VARCHAR(50) | 否 | - | 请求方法 (GET/POST/PUT/DELETE) |
| requestDuration | INT | 否 | - | 请求耗时 (毫秒) |
| requestParam | TEXT | 否 | - | 请求参数 (JSON) |
| requestTarget | TEXT | 否 | - | 请求目标 (方法签名) |
| **日志内容** |
| content | TEXT | 否 | - | 日志详细信息 (JSON) |
| **平台设备** |
| platform | VARCHAR(100) | 否 | - | 平台设备 (Windows/Mac/iOS/Android) |
| browser | VARCHAR(100) | 否 | - | 浏览器 (Chrome/Firefox/Safari) |
| **模块信息** |
| moduleId | VARCHAR(50) | 否 | - | 功能主键 (模块 ID) |
| moduleName | VARCHAR(100) | 否 | - | 功能名称 (模块名称) |
| **对象信息** |
| objectId | VARCHAR(50) | 否 | - | 对象 ID (操作的数据 ID) |
| description | VARCHAR(500) | 否 | - | 描述或说明 |
| **租户信息** |
| tenantId | VARCHAR(50) | 是 | "0" | 租户 ID (多租户隔离) |
| **登录相关** |
| isLoginSuccess | BOOLEAN | 否 | false | 是否登录成功 |
| loginType | INT | 否 | - | 登录类型 (1 账号密码/2 手机/3 邮箱/4 第三方) |

---

### 1.3 日志类型枚举

```typescript
enum SysLogType {
  LOGIN = 1,      // 登录日志
  OPERATION = 2,  // 操作日志
  EXCEPTION = 3,  // 异常日志
  SYSTEM = 4      // 系统日志
}
```

### 1.4 日志级别枚举

```typescript
enum SysLogLevel {
  DEBUG = 1,    // 调试
  INFO = 2,     // 信息
  WARN = 3,     // 警告
  ERROR = 4,    // 错误
  FATAL = 5     // 致命
}
```

### 1.5 登录类型枚举

```typescript
enum LoginType {
  PASSWORD = 1,        // 账号密码
  SMS_CODE = 2,        // 手机验证码
  EMAIL_CODE = 3,      // 邮箱验证码
  WECHAT = 4,          // 微信
  DINGTALK = 5,        // 钉钉
  GITHUB = 6           // GitHub
}
```

---

## 二、使用示例

### 2.1 记录登录日志

```typescript
// 记录登录成功
await prisma.baseSysLog.create({
  data: {
    bizId: generateBizId('login', userId),  // 生成自然主键
    userId: userId,
    userName: username,
    logType: SysLogType.LOGIN,
    logLevel: SysLogLevel.INFO,
    ipAddress: userIp,
    ipAddressLocation: '北京市',
    requestUrl: '/api/v1/auth/login',
    requestMethod: 'POST',
    requestDuration: 150,
    platform: 'Windows',
    browser: 'Chrome 120',
    isLoginSuccess: true,
    loginType: LoginType.PASSWORD,
    description: `用户 ${username} 登录成功`,
    tenantId: '0'
  }
});

// 记录登录失败
await prisma.baseSysLog.create({
  data: {
    bizId: generateBizId('login', userId),
    userId: userId,
    userName: username,
    logType: SysLogType.LOGIN,
    logLevel: SysLogLevel.WARN,
    ipAddress: userIp,
    ipAddressLocation: '北京市',
    requestUrl: '/api/v1/auth/login',
    requestMethod: 'POST',
    requestDuration: 50,
    platform: 'Windows',
    browser: 'Chrome 120',
    isLoginSuccess: false,
    loginType: LoginType.PASSWORD,
    description: `用户 ${username} 登录失败：密码错误`,
    tenantId: '0'
  }
});
```

### 2.2 记录操作日志

```typescript
// 记录用户创建操作
await prisma.baseSysLog.create({
  data: {
    bizId: generateBizId('user_create', newUserId),
    userId: currentUserId,
    userName: currentUsername,
    logType: SysLogType.OPERATION,
    logLevel: SysLogLevel.INFO,
    ipAddress: userIp,
    ipAddressLocation: '北京市',
    requestUrl: '/api/v1/users',
    requestMethod: 'POST',
    requestDuration: 200,
    requestParam: JSON.stringify({
      username: 'newuser',
      email: 'newuser@example.com'
    }),
    requestTarget: 'UserController.create',
    moduleId: 'user_management',
    moduleName: '用户管理',
    objectId: newUserId,
    description: `创建用户：newuser`,
    content: JSON.stringify({
      before: null,
      after: {
        username: 'newuser',
        email: 'newuser@example.com'
      }
    }),
    tenantId: '0'
  }
});
```

### 2.3 记录异常日志

```typescript
// 记录系统异常
try {
  // 业务逻辑
} catch (error) {
  await prisma.baseSysLog.create({
    data: {
      bizId: generateBizId('exception', requestId),
      userId: currentUserId,
      userName: currentUsername,
      logType: SysLogType.EXCEPTION,
      logLevel: SysLogLevel.ERROR,
      ipAddress: userIp,
      requestUrl: req.url,
      requestMethod: req.method,
      requestDuration: performance.now(),
      requestParam: JSON.stringify(req.body),
      requestTarget: `${req.controller}.${req.action}`,
      content: JSON.stringify({
        error: error.message,
        stack: error.stack,
        code: error.code
      }),
      description: `系统异常：${error.message}`,
      tenantId: '0'
    }
  });
}
```

### 2.4 查询日志

```typescript
// 查询最近登录日志
const loginLogs = await prisma.baseSysLog.findMany({
  where: {
    logType: SysLogType.LOGIN,
    userId: userId,
    isDeleted: false
  },
  orderBy: { createdAt: 'desc' },
  take: 10
});

// 查询操作日志 (带分页)
const operationLogs = await prisma.baseSysLog.findMany({
  where: {
    logType: SysLogType.OPERATION,
    moduleId: 'user_management',
    createdAt: {
      gte: startDate,
      lte: endDate
    },
    isDeleted: false
  },
  orderBy: { sort: 'desc' },
  skip: (page - 1) * pageSize,
  take: pageSize
});

// 查询错误日志
const errorLogs = await prisma.baseSysLog.findMany({
  where: {
    logLevel: {
      in: [SysLogLevel.ERROR, SysLogLevel.FATAL]
    },
    createdAt: {
      gte: new Date(Date.now() - 24 * 60 * 60 * 1000)  // 最近 24 小时
    },
    isDeleted: false
  },
  orderBy: { createdAt: 'desc' }
});

// 统计登录次数
const loginCount = await prisma.baseSysLog.count({
  where: {
    logType: SysLogType.LOGIN,
    isLoginSuccess: true,
    userId: userId,
    createdAt: {
      gte: new Date(new Date().setHours(0, 0, 0, 0))  // 今天
    },
    isDeleted: false
  }
});
```

---

## 三、自然主键生成规则

```typescript
/**
 * 生成自然主键 (用于去重)
 * @param prefix 业务前缀
 * @param uniqueId 唯一标识 (用户 ID/订单 ID 等)
 * @param date 可选日期 (默认今天)
 */
function generateBizId(prefix: string, uniqueId: string, date?: Date): string {
  const now = date || new Date();
  const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');  // YYYYMMDD
  const hash = md5(`${prefix}-${uniqueId}-${dateStr}`).substring(0, 8);
  return `${prefix}-${dateStr}-${hash}`;
}

// 示例:
// generateBizId('login', 'user-123') => 'login-20260328-a1b2c3d4'
// generateBizId('order', 'order-456') => 'order-20260328-e5f6g7h8'
```

---

## 四、后台管理界面

```
┌─────────────────────────────────────────────────────────────────┐
│                    后台管理 - 系统日志                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 日志列表                                                    │
│     ┌──────────────────────────────────────────────────────┐   │
│     │  筛选：                                               │   │
│     │  • 日志类型：[全部 ▼] (登录/操作/异常/系统)           │   │
│     │  • 日志级别：[全部 ▼] (DEBUG/INFO/WARN/ERROR/FATAL)  │   │
│     │  • 用户：[________________]                           │   │
│     │  • IP 地址：[________________]                         │   │
│     │  • 时间：[____-__-__] 至 [____-__-__]                 │   │
│     │                                                       │   │
│     │  日志列表：                                           │   │
│     │  ┌─────┬────────┬────────┬──────┬────────┬────────┐  │   │
│     │  │ 级别│ 时间   │ 用户   │ 类型 │ IP     │ 描述   │  │   │
│     │  ├─────┼────────┼────────┼──────┼────────┼────────┤  │   │
│     │  │ ℹ️  │ 10:00  │ admin  │ 登录 │ 1.2.3.4│ 登录成功│  │   │
│     │  │ ⚠️  │ 10:01  │ user1  │ 登录 │ 5.6.7.8│ 密码错误│  │   │
│     │  │ ❌  │ 10:02  │ -      │ 异常 │ 1.2.3.4│ 空指针  │  │   │
│     │  └─────┴────────┴────────┴──────┴────────┴────────┘  │   │
│     │                                                       │   │
│     │  统计图表：                                           │   │
│     │  • 日志类型分布 (饼图)                                │   │
│     │  • 日志级别趋势 (折线图)                              │   │
│     │  • 登录成功/失败统计 (柱状图)                         │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
│  2. 日志详情                                                    │
│     ┌──────────────────────────────────────────────────────┐   │
│     │  基本信息：                                           │   │
│     │  • 日志 ID: abc-123-def                               │   │
│     │  • 自然主键：login-20260328-a1b2c3d4                 │   │
│     │  • 日志类型：登录日志                                 │   │
│     │  • 日志级别：INFO                                     │   │
│     │  • 创建时间：2026-03-28 10:00:00                     │   │
│     │                                                       │   │
│     │  用户信息：                                           │   │
│     │  • 用户 ID: user-123                                  │   │
│     │  • 用户名：admin                                      │   │
│     │                                                       │   │
│     │  请求信息：                                           │   │
│     │  • IP 地址：1.2.3.4 (北京市)                           │   │
│     │  • 请求 URL: /api/v1/auth/login                       │   │
│     │  • 请求方法：POST                                     │   │
│     │  • 请求耗时：150ms                                    │   │
│     │  • 平台设备：Windows                                  │   │
│     │  • 浏览器：Chrome 120                                 │   │
│     │                                                       │   │
│     │  日志内容：                                           │   │
│     │  {                                                    │   │
│     │    "userId": "user-123",                             │   │
│     │    "username": "admin",                              │   │
│     │    "loginType": 1,                                    │   │
│     │    "success": true                                    │   │
│     │  }                                                    │   │
│     │                                                       │   │
│     │  [复制 JSON] [导出]                                   │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
│  3. 日志分析                                                    │
│     ┌──────────────────────────────────────────────────────┐   │
│     │  今日统计：                                           │   │
│     │  • 总日志数：12,345 条                                │   │
│     │  • 错误日志：23 条                                    │   │
│     │  • 警告日志：156 条                                   │   │
│     │  • 登录成功：1,234 次                                 │   │
│     │  • 登录失败：56 次                                    │   │
│     │                                                       │   │
│     │  趋势分析：                                           │   │
│     │  • 近 7 天日志量趋势                                   │   │
│     │  • 近 7 天错误率趋势                                   │   │
│     │                                                       │   │
│     │  TOP 排行：                                           │   │
│     │  • 错误类型 TOP10                                     │   │
│     │  • 活跃用户 TOP10                                     │   │
│     │  • IP 地址 TOP10                                       │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 五、性能优化

### 5.1 索引优化

```prisma
// 常用查询索引
@@index([logType])           // 按类型查询
@@index([logLevel])          // 按级别查询
@@index([userId])            // 按用户查询
@@index([ipAddress])         // 按 IP 查询
@@index([createdAt])         // 按时间排序
@@index([tenantId])          // 多租户隔离
@@index([bizId])             // 自然主键去重
```

### 5.2 分区策略

```sql
-- 按月分区 (MySQL 8.0+)
ALTER TABLE base_sys_log 
PARTITION BY RANGE (YEAR(createdAt) * 100 + MONTH(createdAt)) (
  PARTITION p202601 VALUES LESS THAN (202602),
  PARTITION p202602 VALUES LESS THAN (202603),
  PARTITION p202603 VALUES LESS THAN (202604),
  ...
  PARTITION pMax VALUES LESS THAN MAXVALUE
);
```

### 5.3 清理策略

```typescript
// 定期清理 90 天前的日志
async function cleanupOldLogs() {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  
  // 软删除
  await prisma.baseSysLog.updateMany({
    where: {
      createdAt: { lt: ninetyDaysAgo },
      isDeleted: false
    },
    data: {
      isDeleted: true,
      deletedAt: new Date()
    }
  });
  
  // 或者物理删除 (谨慎使用)
  // await prisma.baseSysLog.deleteMany({
  //   where: {
  //     createdAt: { lt: ninetyDaysAgo }
  //   }
  // });
}
```

---

**文档维护**: 小虾米  
**最后更新**: 2026-03-28 16:42
