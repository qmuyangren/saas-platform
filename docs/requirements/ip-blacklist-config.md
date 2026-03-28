# IP 黑名单与安全配置表

**版本**: v1.0  
**更新时间**: 2026-03-28 16:18  
**用途**: IP 黑名单/白名单/安全日志

---

## 一、IP 黑名单相关表

### 1.1 IpBlacklist 表 (IP 黑名单)

**用途**: IP 黑名单管理

```prisma
model IpBlacklist {
  id          String   @id @default(uuid()) @db.VarChar(36)
  
  // IP 信息
  ip          String   @unique  // 单个 IP (如：192.168.1.100)
  ipRange     String?  // IP 段 (CIDR 格式，如：192.168.1.0/24)
  
  // 原因
  reason      String   // 列入黑名单原因
  evidence    String?  // 证据 (JSON，如：攻击日志)
  
  // 级别
  level       String   @default("medium")  // low/medium/high/critical
  
  // 状态
  enabled     Boolean  @default(true)
  
  // 过期时间 (null=永久)
  expiresAt   DateTime?
  
  // 统计
  hitCount    Int      @default(0)  // 命中次数
  lastHitAt   DateTime?
  
  // 操作
  createdBy   String?  @db.VarChar(36)  // 操作人 ID
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([ip])
  @@index([enabled])
  @@index([level])
}
```

**示例数据**:

```json
// 单个 IP 黑名单 (暴力破解)
{
  "id": "ip-blacklist-uuid-1",
  "ip": "192.168.1.100",
  "reason": "暴力破解密码",
  "evidence": {
    "failedAttempts": 50,
    "timeRange": "2026-03-28T10:00:00Z - 2026-03-28T10:30:00Z",
    "targetUsers": ["admin", "root"]
  },
  "level": "high",
  "enabled": true,
  "expiresAt": "2026-04-28T00:00:00Z",
  "hitCount": 5,
  "createdBy": "admin-uuid-1"
}

// IP 段黑名单 (恶意爬虫)
{
  "id": "ip-blacklist-uuid-2",
  "ipRange": "10.0.0.0/8",
  "reason": "恶意爬虫",
  "level": "medium",
  "enabled": true,
  "expiresAt": null
}
```

---

### 1.2 IpWhitelist 表 (IP 白名单)

**用途**: IP 白名单管理 (仅允许特定 IP 访问)

```prisma
model IpWhitelist {
  id          String   @id @default(uuid()) @db.VarChar(36)
  
  // IP 信息
  ip          String   @unique
  ipRange     String?
  
  // 描述
  description String?
  
  // 状态
  enabled     Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([ip])
  @@index([enabled])
}
```

---

### 1.3 SecurityLog 表 (安全日志)

**用途**: 记录所有安全相关事件

```prisma
model SecurityLog {
  id          String   @id @default(uuid()) @db.VarChar(36)
  
  // 事件信息
  eventType   String   // login_failed/ip_blacklisted/user_locked/...
  eventLevel  String   @default("info")  // info/warning/error/critical
  
  // 用户信息
  userId      String?  @db.VarChar(36)
  username    String?
  
  // IP 信息
  ip          String?
  ipLocation  String?  // IP 归属地 (可选)
  userAgent   String?
  
  // 事件详情
  details     Json?    // 详细数据
  
  // 处理结果
  success     Boolean
  errorMessage String?
  
  createdAt   DateTime @default(now())
  
  @@index([eventType])
  @@index([userId])
  @@index([ip])
  @@index([createdAt])
}
```

**示例数据**:

```json
// 登录失败
{
  "id": "sec-log-uuid-1",
  "eventType": "login_failed",
  "eventLevel": "warning",
  "userId": null,
  "username": "admin",
  "ip": "192.168.1.100",
  "ipLocation": "北京市",
  "userAgent": "Mozilla/5.0...",
  "details": {
    "reason": "密码错误",
    "attemptNumber": 3
  },
  "success": false,
  "errorMessage": "密码错误"
}

// IP 被黑名单拦截
{
  "id": "sec-log-uuid-2",
  "eventType": "ip_blacklisted",
  "eventLevel": "error",
  "ip": "192.168.1.100",
  "details": {
    "blacklistId": "ip-blacklist-uuid-1",
    "reason": "暴力破解密码"
  },
  "success": false
}

// 账号被锁定
{
  "id": "sec-log-uuid-3",
  "eventType": "user_locked",
  "eventLevel": "warning",
  "userId": "admin-uuid-1",
  "username": "admin",
  "details": {
    "failedAttempts": 5,
    "lockedUntil": "2026-03-28T16:30:00Z"
  },
  "success": false
}
```

---

## 二、登录流程中的安全检查

### 2.1 完整安全检查流程

```
┌─────────────────────────────────────────────────────────────────┐
│                    登录安全检查流程                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: 获取用户 IP                                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  const userIp = req.ip || req.headers['x-real-ip'];      │  │
│  │  const ipRange = getIpRange(userIp);  // 转换为 IP 段       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  Step 2: 检查 IP 黑名单                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  const isBlacklisted = await prisma.ipBlacklist.findFirst({│  │
│  │    where: {                                               │  │
│  │      OR: [                                                │  │
│  │        { ip: userIp, enabled: true },                    │  │
│  │        { ipRange: { contains: ipRange }, enabled: true } │  │
│  │      ]                                                    │  │
│  │    }                                                      │  │
│  │  });                                                      │  │
│  │                                                           │  │
│  │  if (isBlacklisted) {                                     │  │
│  │    // 记录安全日志                                        │  │
│  │    await prisma.securityLog.create({                     │  │
│  │      data: {                                              │  │
│  │        eventType: 'ip_blacklisted',                      │  │
│  │        eventLevel: 'error',                              │  │
│  │        ip: userIp,                                        │  │
│  │        details: { blacklistId: isBlacklisted.id },       │  │
│  │        success: false                                     │  │
│  │      }                                                    │  │
│  │    });                                                    │  │
│  │                                                           │  │
│  │    // 更新命中计数                                        │  │
│  │    await prisma.ipBlacklist.update({                     │  │
│  │      where: { id: isBlacklisted.id },                    │  │
│  │      data: {                                              │  │
│  │        hitCount: { increment: 1 },                       │  │
│  │        lastHitAt: new Date()                             │  │
│  │      }                                                    │  │
│  │    });                                                    │  │
│  │                                                           │  │
│  │    throw new BusinessError(                              │  │
│  │      'IP_BLACKLISTED',                                   │  │
│  │      '您的 IP 已被禁止访问',                               │  │
│  │      403                                                  │  │
│  │    );                                                     │  │
│  │  }                                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  Step 3: 检查 IP 白名单 (如果启用了白名单模式)                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  if (whitelistMode) {                                     │  │
│  │    const isWhitelisted = await prisma.ipWhitelist.findFirst({│
│  │      where: {                                             │  │
│  │        OR: [                                              │  │
│  │          { ip: userIp, enabled: true },                  │  │
│  │          { ipRange: { contains: ipRange }, enabled: true }│  │
│  │        ]                                                  │  │
│  │      }                                                    │  │
│  │    });                                                    │  │
│  │                                                           │  │
│  │    if (!isWhitelisted) {                                  │  │
│  │      throw new BusinessError(                            │  │
│  │        'IP_NOT_ALLOWED',                                 │  │
│  │        '仅允许特定 IP 访问',                                │  │
│  │        403                                                │  │
│  │      );                                                   │  │
│  │    }                                                      │  │
│  │  }                                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  Step 4: 验证用户账号密码                                        │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  Step 5: 检查用户状态                                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  if (user.status === 'DISABLED') {                       │  │
│  │    // 记录安全日志                                        │  │
│  │    await prisma.securityLog.create({                     │  │
│  │      data: {                                              │  │
│  │        eventType: 'login_disabled_user',                 │  │
│  │        userId: user.id,                                  │  │
│  │        ip: userIp,                                        │  │
│  │        success: false                                     │  │
│  │      }                                                    │  │
│  │    });                                                    │  │
│  │                                                           │  │
│  │    throw new BusinessError(                              │  │
│  │      'USER_DISABLED',                                    │  │
│  │      '账号已被禁用，请联系管理员',                         │  │
│  │      403                                                  │  │
│  │    );                                                     │  │
│  │  }                                                        │  │
│  │                                                           │  │
│  │  if (user.status === 'LOCKED') {                         │  │
│  │    if (user.lockedUntil > new Date()) {                  │  │
│  │      throw new BusinessError(                            │  │
│  │        'USER_LOCKED',                                    │  │
│  │        `账号已锁定，请在 ${user.lockedUntil} 后重试`,       │  │
│  │        403                                                │  │
│  │      );                                                   │  │
│  │    } else {                                               │  │
│  │      // 锁已过期，自动解锁                                 │  │
│  │      await prisma.adminUser.update({                     │  │
│  │        where: { id: user.id },                           │  │
│  │        data: { status: 'ACTIVE', lockedUntil: null }     │  │
│  │      });                                                  │  │
│  │    }                                                      │  │
│  │  }                                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  Step 6: 登录成功                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  // 记录成功日志                                          │  │
│  │  await prisma.securityLog.create({                       │  │
│  │    data: {                                                │  │
│  │      eventType: 'login_success',                         │  │
│  │      eventLevel: 'info',                                 │  │
│  │      userId: user.id,                                    │  │
│  │      ip: userIp,                                          │  │
│  │      success: true                                        │  │
│  │    }                                                      │  │
│  │  });                                                      │  │
│  │                                                           │  │
│  │  // 更新最后登录信息                                       │  │
│  │  await prisma.adminUser.update({                         │  │
│  │    where: { id: user.id },                               │  │
│  │    data: {                                                │  │
│  │      lastLoginAt: new Date(),                            │  │
│  │      lastLoginIp: userIp,                                │  │
│  │      failedAttempts: 0                                    │  │
│  │    }                                                      │  │
│  │  });                                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 三、用户状态说明

```
┌─────────────────────────────────────────────────────────────────┐
│                    用户状态详解                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ACTIVE (启用)                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • 正常状态，可以登录                                     │  │
│  │  • 默认状态                                              │  │
│  │  • 管理员可手动禁用                                      │  │
│  │  • 登录失败不会改变状态 (只增加 failedAttempts)           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  DISABLED (禁用)                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • 管理员手动禁用                                        │  │
│  │  • 永久禁用，除非管理员重新启用                          │  │
│  │  • 登录时提示"账号已被禁用，请联系管理员"                │  │
│  │  • 用于：离职员工/违规账号/临时停用                      │  │
│  │  • 不会自动恢复                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  LOCKED (锁定)                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • 登录失败次数过多自动锁定                              │  │
│  │  • 有锁定截止时间 (lockedUntil)                          │  │
│  │  • 锁定时效过后自动解锁                                  │  │
│  │  • 登录时提示"账号已锁定，请在 XX:XX 后重试"              │  │
│  │  • 用于：暴力破解防护                                    │  │
│  │  • 管理员可手动提前解锁                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  状态转换：                                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ACTIVE ──(失败 N 次)──> LOCKED ──(过期)──> ACTIVE        │  │
│  │     │                          │                         │  │
│  │     │(管理员禁用)               │(管理员解锁)            │  │
│  │     ↓                          ↓                         │  │
│  │  DISABLED <───────────────────┘                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 四、后台管理界面

```
┌─────────────────────────────────────────────────────────────────┐
│                    后台管理 - 安全管理                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. IP 黑名单管理                                                │
│     ┌──────────────────────────────────────────────────────┐   │
│     │  [添加黑名单]                                         │   │
│     │                                                       │   │
│     │  黑名单列表：                                         │   │
│     │  ┌─────┬──────────┬────────┬──────┬────────┬──────┐  │   │
│     │  │ 状态 │ IP/IP 段   │ 原因   │ 级别 │ 过期   │ 操作 │  │   │
│     │  ├─────┼──────────┼────────┼──────┼────────┼──────┤  │   │
│     │  │ ✅   │ 192.168..│ 暴力破解│ 高   │ 30 天   │ 编辑 │  │   │
│     │  │ ✅   │ 10.0.0.0/8│ 爬虫   │ 中   │ 永久   │ 编辑 │  │   │
│     │  └─────┴──────────┴────────┴──────┴────────┴──────┘  │   │
│     │                                                       │   │
│     │  统计：                                               │   │
│     │  • 总黑名单数：123                                    │   │
│     │  • 今日命中：45                                       │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
│  2. IP 白名单管理                                                │
│     ┌──────────────────────────────────────────────────────┐   │
│     │  [添加白名单]                                         │   │
│     │  ☑️ 启用白名单模式 (仅允许白名单 IP 访问)                │   │
│     │                                                       │   │
│     │  白名单列表：                                         │   │
│     │  ┌─────┬──────────┬────────────┬────────┬─────────┐  │   │
│     │  │ 状态 │ IP/IP 段   │ 描述       │ 创建时间│ 操作    │  │   │
│     │  ├─────┼──────────┼────────────┼────────┼─────────┤  │   │
│     │  │ ✅   │ 192.168.1.1│ 公司办公室 │ 2026-01-01│ 编辑   │  │   │
│     │  └─────┴──────────┴────────────┴────────┴─────────┘  │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
│  3. 安全日志                                                    │
│     ┌──────────────────────────────────────────────────────┐   │
│     │  筛选：                                               │   │
│     │  • 事件类型：[全部 ▼]                                │   │
│     │  • 级别：[全部 ▼]                                    │   │
│     │  • IP: [________________]                            │   │
│     │  • 时间：[____-__-__] 至 [____-__-__]                │   │
│     │                                                       │   │
│     │  日志列表：                                           │   │
│     │  ┌─────┬──────────┬────────┬──────┬────────┬──────┐  │   │
│     │  │ 时间 │ 事件类型 │ IP     │ 级别 │ 用户   │ 结果 │  │   │
│     │  ├─────┼──────────┼────────┼──────┼────────┼──────┤  │   │
│     │  │ 10:00│ 登录失败 │ 1.2.3.4│ ⚠️   │ admin  │ ❌   │  │   │
│     │  │ 10:01│ IP 黑名单 │ 1.2.3.4│ ❌   │ -      │ ❌   │  │   │
│     │  │ 10:02│ 登录成功 │ 5.6.7.8│ ℹ️   │ user1  │ ✅   │  │   │
│     │  └─────┴──────────┴────────┴──────┴────────┴──────┘  │   │
│     │                                                       │   │
│     │  统计图表：                                           │   │
│     │  • 登录成功/失败趋势                                  │   │
│     │  • IP 黑名单命中 TOP10                                │   │
│     │  • 用户锁定统计                                       │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
│  4. 用户状态管理                                                │
│     ┌──────────────────────────────────────────────────────┐   │
│     │  用户列表：                                           │   │
│     │  ┌─────┬────────┬──────┬────────┬────────┬────────┐  │   │
│     │  │ 状态 │ 用户名 │ 角色 │ 失败次数│ 锁定至 │ 操作  │  │   │
│     │  ├─────┼────────┼──────┼────────┼────────┼────────┤  │   │
│     │  │ 🟢   │ admin  │ 超管 │ 0      │ -      │ 禁用  │  │   │
│     │  │ 🔴   │ user1  │ 操作员│ 5      │ 16:30  │ 解锁  │  │   │
│     │  │ ⚫   │ user2  │ 审计员│ -      │ 永久   │ 启用  │  │   │
│     │  └─────┴────────┴──────┴────────┴────────┴────────┘  │   │
│     │                                                       │   │
│     │  图例：🟢 启用  🔴 锁定  ⚫ 禁用                        │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

**文档维护**: 小虾米  
**最后更新**: 2026-03-28 16:18
