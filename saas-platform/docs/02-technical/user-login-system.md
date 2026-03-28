# 用户登录系统架构设计

## 1. 系统概述

### 1.1 架构目标

构建 SaaS 平台统一认证中心，实现：
- **多租户隔离**: 企业间数据完全隔离
- **统一身份**: 一次登录，处处访问
- **安全可控**: 自主掌控用户数据，支持深度定制
- **可扩展**: 支持 AI Agent 机器身份认证等未来场景

### 1.2 技术选型

基于需求文档 Phase 3 的方案评审，选择 **NextAuth.js + 自研扩展** 方案：

| 维度 | 选型 | 理由 |
|------|------|------|
| 认证框架 | NextAuth.js v5 | 社区成熟，支持多种 Provider，可自定义数据库适配 |
| Token 格式 | JWT | 无状态，支持水平扩展 |
| Session 存储 | Redis | 高性能，支持设备管理和并发控制 |
| 密码加密 | bcrypt | 行业标准，salt rounds = 10 |
| 数据库 | MySQL 8.0 | 支持事务，多租户索引优化 |

---

## 2. 系统架构图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Client Layer                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│  │   Web    │  │  Mobile  │  │  API     │  │  AI      │                │
│  │   App    │  │   App    │  │  Client  │  │  Agent   │                │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘                │
│       │             │             │             │                        │
│       └─────────────┴─────────────┴─────────────┘                        │
│                           │ HTTPS                                        │
└───────────────────────────┼──────────────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────────────┐
│                         API Gateway Layer                                 │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  Rate Limiting │ CORS │ Request Validation │ IP Blacklist          │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────┼──────────────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────────────┐
│                      Authentication Layer (NextAuth.js)                   │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  Auth Routes                                                       │  │
│  │  ├── POST /api/auth/login        - 用户登录                         │  │
│  │  ├── POST /api/auth/refresh      - Token 刷新                       │  │
│  │  ├── POST /api/auth/logout       - 用户登出                         │  │
│  │  ├── GET  /api/auth/me           - 获取当前用户                     │  │
│  │  └── POST /api/auth/oauth/*      - OAuth 回调                       │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  Auth Providers                                                    │  │
│  │  ├── CredentialsProvider   - 账号密码登录                          │  │
│  │  ├── SMSProvider         - 手机验证码登录                          │  │
│  │  ├── EmailProvider       - 邮箱验证码登录                          │  │
│  │  ├── WechatProvider      - 微信 OAuth                              │  │
│  │  ├── DingtalkProvider    - 钉钉 OAuth                              │  │
│  │  └── GitHubProvider      - GitHub OAuth                            │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  JWT Strategy                                                      │  │
│  │  ├── Access Token (2h)  - 包含 user_id, tenant_id, roles           │  │
│  │  └── Refresh Token (7d) - 存储于 Redis，支持设备管理               │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────┼──────────────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────────────┐
│                       Business Logic Layer                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│  │  AuthService    │  │  TenantService  │  │  UserService    │          │
│  │  - 登录验证      │  │  - 租户隔离      │  │  - 用户管理      │          │
│  │  - Token 颁发    │  │  - 数据路由      │  │  - 密码管理      │          │
│  │  - 失败锁定      │  │  - 配置管理      │  │  - 状态管理      │          │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│  │  RoleService    │  │  DeviceService  │  │  AuditService   │          │
│  │  - 角色管理      │  │  - 设备管理      │  │  - 登录日志      │          │
│  │  - 权限加载      │  │  - 并发控制      │  │  - 异常告警      │          │
│  │  - RBAC 验证     │  │  - 踢出设备      │  │  - 安全审计      │          │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘          │
└───────────────────────────┼──────────────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────────────┐
│                         Data Access Layer                                 │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  Repository Pattern                                                │  │
│  │  ├── UserRepository    - 用户 CRUD，带 tenant_id 过滤              │  │
│  │  ├── TenantRepository  - 租户 CRUD                                  │  │
│  │  ├── RoleRepository    - 角色/权限 CRUD                             │  │
│  │  ├── OAuthRepository   - OAuth 绑定管理                             │  │
│  │  └── LoginLogRepository - 登录日志写入                             │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────┼──────────────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────────────┐
│                          Storage Layer                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│  │     MySQL       │  │     Redis       │  │     Logger      │          │
│  │  - users        │  │  - Sessions     │  │  - Filebeat     │          │
│  │  - tenants      │  │  - RefreshTokens│  │  - Elasticsearch│          │
│  │  - user_roles   │  │  - RateLimit    │  │  - Kibana       │          │
│  │  - oauth_accounts│ │  - DeviceMap    │  │                 │          │
│  │  - login_logs   │  │  - LockKeys     │  │                 │          │
│  │  - refresh_tokens│ │                 │  │                 │          │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 核心组件设计

### 3.1 认证流程

```
┌──────────┐                              ┌──────────┐
│  Client  │                              │  Server  │
└────┬─────┘                              └────┬─────┘
     │                                         │
     │  1. POST /api/auth/login                │
     │  { tenantId, identifier, password }     │
     ├────────────────────────────────────────►│
     │                                         │
     │                                         │ 2. 验证租户存在
     │                                         │ 3. 查询用户 (带 tenant_id)
     │                                         │ 4. 验证密码 (bcrypt)
     │                                         │ 5. 检查账号锁定状态
     │                                         │ 6. 检查设备并发限制
     │                                         │
     │                                         │ 7. 生成 JWT Access Token
     │                                         │    payload: {
     │                                         │      sub: user_id,
     │                                         │      tenant_id,
     │                                         │      roles,
     │                                         │      iat, exp
     │                                         │    }
     │                                         │
     │                                         │ 8. 生成 Refresh Token
     │                                         │    - 存储于 Redis (7d)
     │                                         │    - 关联 device_fingerprint
     │                                         │
     │                                         │ 9. 记录登录日志
     │                                         │
     │  10. Response                           │
     │  { accessToken, refreshToken, user }    │
     ◄─────────────────────────────────────────┤
     │                                         │
```

### 3.2 Token 刷新流程

```
┌──────────┐                              ┌──────────┐
│  Client  │                              │  Server  │
└────┬─────┘                              └────┬─────┘
     │                                         │
     │  1. POST /api/auth/refresh              │
     │  { tenantId, refreshToken }             │
     ├────────────────────────────────────────►│
     │                                         │
     │                                         │ 2. 验证 Refresh Token 格式
     │                                         │ 3. 查询 Redis 确认未使用
     │                                         │ 4. 验证未过期
     │                                         │
     │                                         │ 5. 标记旧 Token 为已使用
     │                                         │ 6. 生成新 Access + Refresh Token
     │                                         │    (Token Rotation)
     │                                         │
     │  7. Response                            │
     │  { accessToken, refreshToken }          │
     ◄─────────────────────────────────────────┤
     │                                         │
```

### 3.3 多租户隔离机制

```
┌─────────────────────────────────────────────────────────────────┐
│                     Tenant Isolation Strategy                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Database Schema: Shared Database, Isolated Data                │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  users 表                                                  │   │
│  │  ┌──────┬───────────┬──────────┬─────────────────────┐   │   │
│  │  │ id   │ tenant_id │ username │ ...                 │   │   │
│  │  ├──────┼───────────┼──────────┼─────────────────────┤   │   │
│  │  │ u1   │ tenant_A  │ alice    │ ...                 │   │   │
│  │  │ u2   │ tenant_A  │ bob      │ ...                 │   │   │
│  │  │ u3   │ tenant_B  │ charlie  │ ...                 │   │   │
│  │  └──────┴───────────┴──────────┴─────────────────────┘   │   │
│  │                                                            │   │
│  │  所有查询强制带 WHERE tenant_id = ?                        │   │
│  │  索引：INDEX idx_tenant_user (tenant_id, id)              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  JWT Token 包含 tenant_id，中间件自动验证                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  JWT Payload                                              │   │
│  │  {                                                        │   │
│  │    "sub": "user-uuid",                                    │   │
│  │    "tenant_id": "tenant-uuid",  ◄── 租户隔离关键          │   │
│  │    "roles": ["admin", "user"],                            │   │
│  │    "iat": 1711612800,                                     │   │
│  │    "exp": 1711620000                                      │   │
│  │  }                                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.4 安全机制

#### 3.4.1 密码安全
```
密码注册/修改流程:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  明文密码    │───►│  bcrypt    │───►│  存储哈希    │
│  Secure123  │    │  salt=10   │    │  $2b$10$...  │
└─────────────┘    └─────────────┘    └─────────────┘
```

#### 3.4.2 登录失败锁定
```
┌─────────────────────────────────────────────────────────┐
│              Login Failure Lock Strategy                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Redis Key: lock:login:{tenant_id}:{identifier}         │
│  TTL: 15 分钟                                            │
│                                                          │
│  流程:                                                   │
│  1. 登录失败 → failed_attempts++                         │
│  2. failed_attempts >= 5 → 设置 lock key                 │
│  3. 后续登录尝试 → 检查 lock key 存在 → 拒绝             │
│  4. 15 分钟后自动解锁 / 管理员手动解锁                    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### 3.4.3 设备并发控制
```
┌─────────────────────────────────────────────────────────┐
│              Device Concurrent Login Limit               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Redis Key: devices:{tenant_id}:{user_id}               │
│  Value: Sorted Set (score = login_timestamp)            │
│  Max Size: 3                                             │
│                                                          │
│  流程:                                                   │
│  1. 新登录 → ZADD devices:{user_id} timestamp device_id │
│  2. ZCARD > 3 → ZPOPMIN 踢出最早设备                     │
│  3. 被踢出设备的 Refresh Token 失效                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 4. 数据流图

### 4.1 登录成功数据流

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Client │────►│ Gateway │────►│  Auth   │────►│  User   │────►│  MySQL  │
│         │     │         │     │ Service │     │  Repo   │     │         │
└─────────┘     └─────────┘     └─────────┘     └─────────┘     └─────────┘
     │               │               │               │               │
     │               │               │               │               │
     │               │               │          ┌────▼────┐          │
     │               │               │          │  Redis  │          │
     │               │               │          │  Cache  │          │
     │               │               │          └─────────┘          │
     │               │               │               │               │
     │          ┌────▼────┐     ┌────▼────┐          │               │
     │          │  JWT    │     │  Audit  │◄─────────┘               │
     │          │  Sign   │     │  Log    │                          │
     │          └────┬────┘     └────┬────┘                          │
     │               │               │                               │
     │◄──────────────┴───────────────┴───────────────────────────────│
     │                        Response                                │
```

### 4.2 权限验证数据流

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  API    │────►│  JWT    │────►│  Role   │────►│  MySQL  │
│ Request │     │ Verify  │     │ Service │     │         │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
     │               │               │               │
     │               │ 提取          │ 加载          │
     │               │ tenant_id     │ 用户角色      │
     │               │ user_id       │ & 权限        │
     │               │               │               │
     │          ┌────▼────┐     ┌────▼────┐          │
     │          │  Redis  │     │  Cache  │◄─────────┘
     │          │  Token  │     │  Roles  │
     │          │  Black  │     └─────────┘
     │          │  list   │
     │          └─────────┘
     │
     │  验证通过 → 继续处理
     │  验证失败 → 401 Unauthorized
```

---

## 5. 部署架构

### 5.1 容器化部署

```
┌─────────────────────────────────────────────────────────────────┐
│                     Kubernetes Cluster                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Ingress Controller                       │ │
│  │              (nginx-ingress, TLS termination)               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│         ┌────────────────────┼────────────────────┐             │
│         │                    │                    │             │
│  ┌──────▼──────┐     ┌──────▼──────┐     ┌──────▼──────┐       │
│  │   Auth      │     │   Auth      │     │   Auth      │       │
│  │  Service    │     │  Service    │     │  Service    │       │
│  │  Pod :1     │     │  Pod :2     │     │  Pod :N     │       │
│  │  (Next.js)  │     │  (Next.js)  │     │  (Next.js)  │       │
│  └──────┬──────┘     └──────┬──────┘     └──────┬──────┘       │
│         │                    │                    │             │
│         └────────────────────┼────────────────────┘             │
│                              │                                   │
│         ┌────────────────────┼────────────────────┐             │
│         │                    │                    │             │
│  ┌──────▼──────┐     ┌──────▼──────┐     ┌──────▼──────┐       │
│  │    Redis    │     │    MySQL    │     │  Elasticsearch│      │
│  │  Cluster    │     │  Cluster    │     │   (Logs)    │       │
│  │  (3 nodes)  │     │  (Primary + │     │             │       │
│  │             │     │   Replica)  │     │             │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 环境变量配置

```bash
# .env.example
# Tenant & Database
DATABASE_URL="mysql://user:pass@mysql:3306/saas_platform"
REDIS_URL="redis://redis:6379"

# JWT
JWT_SECRET="your-secret-key-min-32-chars"
ACCESS_TOKEN_EXPIRY="2h"
REFRESH_TOKEN_EXPIRY="7d"

# OAuth Providers
WECHAT_APP_ID="wx..."
WECHAT_APP_SECRET="..."
DINGTALK_APP_KEY="..."
DINGTALK_APP_SECRET="..."

# SMS/Email
SMS_PROVIDER="aliyun"
SMS_ACCESS_KEY="..."
EMAIL_PROVIDER="ses"
EMAIL_ACCESS_KEY="..."

# Security
BCRYPT_ROUNDS=10
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION_MINUTES=15
MAX_CONCURRENT_DEVICES=3

# Observability
LOG_LEVEL="info"
ELASTICSEARCH_URL="http://elasticsearch:9200"
```

---

## 6. 接口设计

### 6.1 API 端点总览

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | /api/auth/login | 用户登录 | ❌ |
| POST | /api/auth/refresh | 刷新 Token | ❌ (需 refresh token) |
| POST | /api/auth/logout | 用户登出 | ❌ (需 refresh token) |
| GET | /api/auth/me | 获取当前用户 | ✅ |
| POST | /api/auth/register | 用户注册 | ❌ |
| POST | /api/auth/forgot-password | 密码找回 | ❌ |
| POST | /api/auth/reset-password | 重置密码 | ❌ |
| POST | /api/auth/verify-code | 验证码验证 | ❌ |
| GET | /api/auth/oauth/:provider | OAuth 重定向 | ❌ |
| GET | /api/auth/oauth/:provider/callback | OAuth 回调 | ❌ |
| GET | /api/auth/devices | 获取设备列表 | ✅ |
| DELETE | /api/auth/devices/:deviceId | 踢出设备 | ✅ |

### 6.2 核心接口详细设计

#### POST /api/auth/login

**Request:**
```typescript
interface LoginRequest {
  tenantId: string;        // UUID, 必填
  identifier: string;      // 用户名/邮箱/手机，必填
  password?: string;       // 密码登录时必填
  verificationCode?: string; // 验证码登录时必填
  loginType: 'password' | 'sms' | 'email' | 'oauth';
  oauthProvider?: 'wechat' | 'dingtalk' | 'github';
  oauthCode?: string;
  rememberMe?: boolean;
  deviceFingerprint?: string;
}
```

**Response (Success):**
```typescript
interface LoginResponse {
  accessToken: string;     // JWT, 2h 有效期
  refreshToken: string;    // 7d 有效期
  expiresIn: number;       // 秒
  user: {
    id: string;
    name: string;
    avatar?: string;
    email?: string;
    phone?: string;
    roles: string[];
  };
  tenant: {
    id: string;
    name: string;
    logo?: string;
  };
  permissions: string[];
}
```

**Error Codes:**
| HTTP | Code | Message |
|------|------|---------|
| 404 | TENANT_NOT_FOUND | 该租户不存在 |
| 401 | USER_NOT_FOUND | 账号或密码错误 |
| 401 | INVALID_CREDENTIALS | 账号或密码错误 |
| 423 | ACCOUNT_LOCKED | 账号已锁定，请 15 分钟后再试 |
| 429 | DEVICE_LIMIT_EXCEEDED | 登录设备过多 |

---

## 7. 监控与告警

### 7.1 关键指标

| 指标 | 阈值 | 告警级别 |
|------|------|----------|
| 登录 P95 延迟 | > 200ms | Warning |
| 登录失败率 | > 10% | Warning |
| 连续失败登录 (单用户) | > 5 次/15min | Critical |
| 异常 IP 登录 | 新地理位置 | Warning |
| Token 验证失败率 | > 5% | Warning |
| Redis 连接失败 | 任何失败 | Critical |

### 7.2 日志结构

```json
{
  "timestamp": "2026-03-28T15:00:00.000Z",
  "level": "info",
  "service": "auth-service",
  "action": "login_attempt",
  "tenant_id": "uuid",
  "user_id": "uuid",
  "identifier": "user@example.com",
  "login_type": "password",
  "success": true,
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "device_fingerprint": "fp_abc123",
  "response_time_ms": 45
}
```

---

## 8. 迭代计划

### v1.0 (MVP - 2 周)
```
┌─────────────────────────────────────────────────────────┐
│  核心功能                                                │
│  ├── 账号密码登录                                        │
│  ├── JWT + Refresh Token                                 │
│  ├── 多租户隔离 (数据库字段级)                           │
│  ├── 登录失败锁定                                        │
│  └── 基础登录日志                                        │
└─────────────────────────────────────────────────────────┘
```

### v1.1 (4 周)
```
┌─────────────────────────────────────────────────────────┐
│  增强功能                                                │
│  ├── 手机验证码登录                                      │
│  ├── 邮箱验证码登录                                      │
│  ├── 密码找回流程                                        │
│  └── 设备管理 (查看/踢出)                                │
└─────────────────────────────────────────────────────────┘
```

### v1.2 (6 周)
```
┌─────────────────────────────────────────────────────────┐
│  第三方集成                                              │
│  ├── 微信 OAuth 登录                                      │
│  ├── 钉钉 OAuth 登录                                      │
│  ├── 单点登录 (SSO) 基础                                  │
│  └── 登录异常告警                                        │
└─────────────────────────────────────────────────────────┘
```

### v2.0 (后续)
```
┌─────────────────────────────────────────────────────────┐
│  企业级功能                                              │
│  ├── 双因素认证 (2FA)                                    │
│  ├── SAML/OIDC 集成                                      │
│  ├── 无密码登录 (Passkey)                                │
│  └── AI 异常行为检测                                      │
└─────────────────────────────────────────────────────────┘
```

---

## 9. 风险与缓解

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|----------|
| 安全漏洞 | High | Medium | 定期安全审计，OWASP Top 10 检测，依赖更新 |
| 性能瓶颈 | Medium | Medium | Redis 缓存 Token，数据库索引优化，水平扩展 |
| 第三方 OAuth 不稳定 | Medium | Low | 降级方案 (回归密码登录)，多 Provider 备份 |
| Token 泄露 | High | Low | HTTPS 强制，HttpOnly Cookie，短有效期 |
| 数据泄露 | High | Low | 多租户严格隔离，加密存储，最小权限原则 |

---

## 10. 验收标准

### 功能验收
- [ ] 所有 Must 优先级用户故事通过测试
- [ ] 多租户隔离验证 (租户 A 用户无法访问租户 B 数据)
- [ ] 并发登录限制生效 (最多 3 设备)
- [ ] 登录失败锁定生效 (5 次失败锁定 15 分钟)

### 性能验收
- [ ] P95 登录延迟 < 200ms
- [ ] 单租户支持 1000 QPS
- [ ] 可用性 > 99.9%

### 安全验收
- [ ] 通过 OWASP Top 10 基础检测
- [ ] 密码 bcrypt 加密验证
- [ ] SQL 注入防护测试通过
- [ ] XSS/CSRF 防护测试通过

### 文档验收
- [ ] API 文档完整 (Swagger/OpenAPI)
- [ ] 部署文档完整
- [ ] 运维手册完整

---

*架构版本：v1.0*  
*创建时间：2026-03-28*  
*作者：architect (saas-platform team)*  
*审核：待 leader 审核*
