# 用户登录系统架构设计

## 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (React + TS)                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │  Login Form │  │  Token Store│  │  Auth Guard │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    API Gateway (Fastify)                 │
│  ┌─────────────────────────────────────────────────┐    │
│  │              Rate Limiter (Redis)               │    │
│  └─────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   AuthService                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   Login     │  │   Logout    │  │   Refresh   │      │
│  │   Handler   │  │   Handler   │  │   Token     │      │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘      │
│         │                │                │             │
│         ▼                ▼                ▼             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │  Password   │  │    JWT      │  │   Session   │      │
│  │  Validator  │  │   Signer    │  │   Manager   │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   UserRepository (Prisma)               │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    MySQL Database                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │    users    │  │   sessions  │  │audit_logs   │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────┘
```

## 数据流 (4 条路径)

### 登录流程

```
INPUT → VALIDATION → AUTHENTICATION → TOKEN_GENERATION → OUTPUT
  │           │              │                │            │
  ▼           ▼              ▼                ▼            ▼
[nil?]    [invalid?]     [not_found?]     [sign_fail?]  [nil_token?]
[empty?]  [wrong_format?] [locked?]        [exp_invalid?][expired?]
[truncated?] [too_long?]  [password_fail?] [refresh_fail?][partial?]
```

### 详细数据流说明

| 阶段 | 输入 | 处理 | 输出 |
|------|------|------|------|
| INPUT | email, password | 接收请求体 | 原始凭证 |
| VALIDATION | 原始凭证 | 格式校验、长度检查 | 有效凭证 |
| AUTHENTICATION | 有效凭证 | 查询用户、验证密码 | 用户对象 |
| TOKEN_GENERATION | 用户对象 | 生成 JWT、记录 session | access_token, refresh_token |
| OUTPUT | tokens | 返回客户端 | HTTP Response |

## 数据库设计

```prisma
// User 表
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String    // bcrypt 加密
  salt          String
  role          Role      @default(USER)
  status        UserStatus @default(ACTIVE)
  lastLoginAt   DateTime?
  failedAttempts Int       @default(0)
  lockedUntil   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  sessions      Session[]
  auditLogs     AuditLog[]
}

enum Role {
  USER
  ADMIN
  SUPER_ADMIN
}

enum UserStatus {
  ACTIVE
  INACTIVE
  LOCKED
  DELETED
}

// Session 表 (可选：用于 token 黑名单/设备管理)
model Session {
  id           String   @id @default(uuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  refreshToken String   @unique
  deviceInfo   String?
  ipAddress    String?
  expiresAt    DateTime
  createdAt    DateTime @default(now())
  
  @@index([userId])
  @@index([refreshToken])
}

// AuditLog 表 (安全审计)
model AuditLog {
  id          String   @id @default(uuid())
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
  action      String   // LOGIN, LOGOUT, PASSWORD_CHANGE, etc.
  status      String   // SUCCESS, FAILURE
  ipAddress   String?
  userAgent   String?
  metadata    Json?
  createdAt   DateTime @default(now())
  
  @@index([userId])
  @@index([createdAt])
}
```

## API 设计

### POST /api/auth/login

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJl...",
    "expiresIn": 3600,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "USER"
    }
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "邮箱或密码错误",
    "remainingAttempts": 2
  }
}
```

### POST /api/auth/refresh

**Request:**
```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

### POST /api/auth/logout

**Request:**
```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "已退出登录"
}
```

## 错误处理

### 错误路径映射表

| METHOD/CODEPATH | WHAT CAN GO WRONG | EXCEPTION |
|-----------------|-------------------|-----------|
| AuthService.login | DB timeout | `TimeoutError` |
| | Invalid email format | `ValidationError` |
| | User not found | `AuthError(INVALID_CREDENTIALS)` |
| | Password mismatch | `AuthError(INVALID_CREDENTIALS)` |
| | Account locked | `AccountLockedError` |
| | Account inactive | `AccountInactiveError` |
| | JWT sign failure | `TokenSignError` |
| AuthService.refresh | Token expired | `TokenExpiredError` |
| | Token invalid | `TokenInvalidError` |
| | Session revoked | `SessionRevokedError` |
| AuthService.logout | DB write fail | `DatabaseError` |
| | Token not found | `NotFoundError` |

### 错误码定义

```typescript
enum AuthErrorCode {
  // 凭证错误
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  INVALID_EMAIL_FORMAT = 'INVALID_EMAIL_FORMAT',
  PASSWORD_TOO_WEAK = 'PASSWORD_TOO_WEAK',
  
  // 账户状态
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_INACTIVE = 'ACCOUNT_INACTIVE',
  ACCOUNT_DELETED = 'ACCOUNT_DELETED',
  
  // Token 相关
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  TOKEN_MISSING = 'TOKEN_MISSING',
  
  // 系统错误
  DATABASE_ERROR = 'DATABASE_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}
```

## 安全设计

### 密码安全
- **加密算法**: bcrypt (cost factor: 12)
- **盐值**: 每用户随机生成
- **最小长度**: 8 字符
- **复杂度要求**: 大小写 + 数字 + 特殊字符

### Token 安全
- **Access Token**: JWT, HS256 签名，有效期 1 小时
- **Refresh Token**: 随机字符串 (32 bytes)，有效期 7 天
- **Token 存储**: 前端 HttpOnly Cookie 或 Secure Storage

### 速率限制
- **登录尝试**: 5 次/小时 (按 IP + 邮箱)
- **刷新 Token**: 30 次/分钟 (按 IP)
- **超限处理**: 返回 429，记录审计日志

### 账户保护
- **失败计数**: 连续 5 次失败 → 锁定 15 分钟
- **锁定通知**: 发送邮件提醒
- **异常检测**: 异地登录、多设备登录告警

### 审计日志
- 所有登录尝试 (成功/失败)
- Token 刷新、注销
- 密码修改、账户状态变更

## 技术选型

| 组件 | 选型 | 理由 |
|------|------|------|
| 前端框架 | React + TypeScript | 生态好，类型安全，用户熟悉 |
| 后端框架 | Fastify | 高性能，TS 原生支持，插件丰富 |
| ORM | Prisma | 类型安全，自动迁移，开发体验好 |
| 数据库 | MySQL | 用户熟悉，阿里云支持，稳定可靠 |
| 缓存 | Redis | 速率限制、session 存储 |
| Token | JWT (jsonwebtoken) | 标准协议，无状态，易扩展 |
| 密码加密 | bcrypt | 行业标准，抗暴力破解 |

## 完成标准

- [x] 系统架构图完整
- [x] 数据流 4 条路径完整
- [x] 错误路径映射完整
- [x] 技术选型合理
- [x] 数据库设计完整
- [x] API 设计清晰
- [x] 安全措施到位

---

**架构师**: 小虾米 🦐  
**创建时间**: 2026-03-28  
**版本**: v1.0
