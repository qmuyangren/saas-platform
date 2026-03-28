# 用户登录功能需求文档

## Phase 1: 需求澄清

### 核心问题回答

1. **需求现实**: SaaS 平台的基础功能，多租户系统的入口点。证据：所有后续业务系统（电商、党建、OA 等）都需要统一的用户认证。

2. **现状**: 传统方案是每个系统独立登录，导致用户需要记住多套账号密码，管理成本高。

3. **具体用户**: 
   - 企业管理员：需要管理多个子系统的用户权限
   - 普通员工：需要访问多个业务系统但不想重复登录
   - 系统开发者：需要统一的认证接口对接各业务模块

4. **最小楔子**: 支持用户名 + 密码登录，单租户验证，Session 管理。

5. **关键观察**: 用户需要的是"一次登录，处处访问"的体验，而非单纯的登录功能。

6. **未来适配**: 3 年后更重要——AI Agent 普及后，需要支持机器身份认证、API Token、OAuth 2.0 等扩展场景。

---

## Phase 2: 前提挑战

```
PREMISES:
1. "用户登录只需要用户名密码" — 不同意。需要支持多种认证方式（手机、邮箱、第三方 OAuth）
2. "登录是独立功能" — 不同意。登录是用户体系的入口，必须与权限系统深度集成
3. "先做简单版本再迭代" — 同意。但数据结构设计要预留扩展性
```

---

## Phase 3: 方案生成

### APPROACH A: 自研认证系统
  Summary: 基于 JWT + Redis 实现完整的认证授权系统
  Effort:  L (2-3 周)
  Risk:    Medium
  Pros:    
    - 完全可控，可深度定制
    - 与 SaaS 多租户架构天然契合
    - 无外部依赖，部署简单
  Cons:    
    - 需要自行处理安全细节（密码加密、防暴力破解等）
    - 第三方登录需要逐个对接

### APPROACH B: 集成 Auth0/Clerk 等认证服务
  Summary: 使用第三方认证服务，快速接入
  Effort:  S (3-5 天)
  Risk:    High
  Pros:    
    - 开箱即用，安全性有保障
    - 支持多种登录方式（社交登录、SAML、OIDC）
  Cons:    
    - 数据不在自己掌控中
    - 按 MAU 收费，成本高
    - 国内访问可能不稳定

### APPROACH C: NextAuth.js + 自研扩展
  Summary: 基于 NextAuth.js 框架，自定义 Provider 和数据库适配
  Effort:  M (1-2 周)
  Risk:    Low
  Pros:    
    - 社区成熟，文档完善
    - 支持多种 Provider，扩展方便
    - 可自定义数据库表结构
  Cons:    
    - 依赖 Node.js 生态
    - 需要理解框架内部机制

**RECOMMENDATION:** 选择 **Approach C (NextAuth.js + 自研扩展)** 
原因：平衡开发效率与可控性，适合 SaaS 平台长期演进。多租户隔离通过数据库字段实现，而非依赖外部服务。

---

## 功能描述

实现 SaaS 平台统一用户认证中心，支持：
- 多租户隔离（不同企业用户数据完全隔离）
- 多种登录方式（账号密码、手机验证码、邮箱验证码、第三方 OAuth）
- Session/Token 管理（支持 Web 端和 API 调用）
- 与权限系统无缝集成（登录后自动加载用户角色和权限）

---

## 用户故事

| ID | 角色 | 故事 | 价值 | 优先级 |
|----|------|------|------|--------|
| US-01 | 新用户 | 作为新用户，我想用邮箱注册并登录，以便开始使用系统 | 降低使用门槛 | Must |
| US-02 | 老用户 | 作为老用户，我想记住登录状态，以便下次访问无需重新登录 | 提升体验 | Must |
| US-03 | 企业员工 | 作为员工，我想用公司账号登录，以便访问授权的业务系统 | 统一身份 | Must |
| US-04 | 管理员 | 作为管理员，我想查看登录日志，以便发现异常行为 | 安全审计 | Should |
| US-05 | 开发者 | 作为开发者，我想用 API Token 调用接口，以便集成第三方系统 | 开放能力 | Should |
| US-06 | 用户 | 作为用户，我想用微信/钉钉登录，以便无需记住新密码 | 便捷登录 | Could |
| US-07 | 安全团队 | 作为安全团队，我想强制开启 2FA，以便保护高权限账号 | 增强安全 | Won't (v2) |

---

## 功能需求

### 输入

| 字段 | 类型 | 必填 | 验证规则 |
|------|------|------|----------|
| tenantId | string | 是 | 租户 ID，UUID 格式 |
| identifier | string | 是 | 用户名/邮箱/手机号 |
| password | string | 条件必填 | 密码登录时必填，最少 8 位，含大小写字母和数字 |
| verificationCode | string | 条件必填 | 验证码登录时必填，6 位数字 |
| loginType | enum | 是 | password / sms / email / oauth |
| oauthProvider | string | 条件必填 | OAuth 登录时必填 (wechat / dingtalk / github) |
| oauthCode | string | 条件必填 | OAuth 回调时必填 |
| rememberMe | boolean | 否 | 默认 false，true 时 Session 有效期 30 天 |

### 输出

| 字段 | 类型 | 说明 |
|------|------|------|
| accessToken | string | JWT Token，有效期 2 小时 |
| refreshToken | string | 刷新 Token，有效期 7 天 |
| expiresIn | number | Token 过期时间（秒） |
| user | object | 用户基本信息（id, name, avatar, roles） |
| tenant | object | 租户信息（id, name, logo） |
| permissions | array | 用户权限列表 |

### 业务规则

1. **多租户隔离**: 所有查询必须带 tenantId，禁止跨租户访问
2. **密码安全**: 使用 bcrypt 加密，salt rounds = 10
3. **失败锁定**: 连续 5 次登录失败，账号锁定 15 分钟
4. **Token 刷新**: refreshToken 只能使用一次，使用后颁发新的 refresh token
5. **并发登录**: 同一账号允许最多 3 个设备同时在线，超出时踢出最早的设备
6. **密码策略**: 支持企业自定义密码复杂度要求
7. **登录日志**: 记录每次登录的 IP、设备、时间、结果

### 异常情况

| 情况 | HTTP 码 | 错误码 | 提示信息 |
|------|---------|--------|----------|
| 租户不存在 | 404 | TENANT_NOT_FOUND | 该租户不存在 |
| 用户不存在 | 401 | USER_NOT_FOUND | 账号或密码错误 |
| 密码错误 | 401 | INVALID_CREDENTIALS | 账号或密码错误 |
| 账号已锁定 | 423 | ACCOUNT_LOCKED | 账号已锁定，请 15 分钟后再试 |
| Token 过期 | 401 | TOKEN_EXPIRED | 登录已过期，请重新登录 |
| Token 无效 | 401 | INVALID_TOKEN | 无效的认证信息 |
| 刷新 Token 已使用 | 401 | REFRESH_TOKEN_USED | 请重新登录 |
| OAuth 状态无效 | 400 | INVALID_OAUTH_STATE | 认证状态无效，请重试 |
| 第三方账号未绑定 | 400 | OAUTH_NOT_BOUND | 该第三方账号未绑定任何用户 |
| 超出设备限制 | 429 | DEVICE_LIMIT_EXCEEDED | 登录设备过多，请在其他设备退出后重试 |

---

## 非功能需求

| 指标 | 要求 |
|------|------|
| 响应时间 | P95 < 200ms（不含第三方 OAuth） |
| 并发支持 | 单租户 1000 QPS |
| 可用性 | 99.9%（月度） |
| 安全性 | 通过 OWASP Top 10 基础检测 |
| 兼容性 | 支持主流浏览器（Chrome/Firefox/Safari/Edge 最近 2 版本） |
| 可观测性 | 所有登录行为可追溯，日志保留 180 天 |

---

## 数据模型（核心表结构）

```sql
-- 租户表
CREATE TABLE tenants (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  status ENUM('active', 'suspended', 'deleted') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户表
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(36) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  username VARCHAR(50),
  password_hash VARCHAR(255),
  name VARCHAR(100) NOT NULL,
  avatar VARCHAR(500),
  status ENUM('active', 'disabled', 'locked') DEFAULT 'active',
  failed_login_attempts INT DEFAULT 0,
  locked_until TIMESTAMP NULL,
  last_login_at TIMESTAMP NULL,
  last_login_ip VARCHAR(45) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tenant_user (tenant_id, id),
  INDEX idx_email (tenant_id, email),
  INDEX idx_phone (tenant_id, phone)
);

-- 用户角色关联表
CREATE TABLE user_roles (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  role_id VARCHAR(36) NOT NULL,
  INDEX idx_user (tenant_id, user_id)
);

-- OAuth 绑定表
CREATE TABLE oauth_accounts (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP NULL,
  UNIQUE KEY uniq_provider_account (tenant_id, provider, provider_account_id),
  INDEX idx_user (tenant_id, user_id)
);

-- 登录日志表
CREATE TABLE login_logs (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36),
  identifier VARCHAR(255) NOT NULL,
  login_type ENUM('password', 'sms', 'email', 'oauth') NOT NULL,
  success BOOLEAN NOT NULL,
  failure_reason VARCHAR(100),
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_fingerprint VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (tenant_id, user_id, created_at),
  INDEX idx_created (tenant_id, created_at)
);

-- Refresh Token 表
CREATE TABLE refresh_tokens (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  device_info VARCHAR(255),
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_token (tenant_id, token_hash),
  INDEX idx_user (tenant_id, user_id)
);
```

---

## API 接口设计

### POST /api/auth/login
```json
// Request
{
  "tenantId": "uuid",
  "identifier": "user@example.com",
  "password": "SecurePass123",
  "loginType": "password",
  "rememberMe": true
}

// Response (200)
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "dGhpcyBp...",
  "expiresIn": 7200,
  "user": {
    "id": "uuid",
    "name": "张三",
    "avatar": "https://...",
    "roles": ["admin", "user"]
  },
  "tenant": {
    "id": "uuid",
    "name": "示例企业",
    "logo": "https://..."
  },
  "permissions": ["user:read", "user:write", "order:read"]
}
```

### POST /api/auth/refresh
```json
// Request
{
  "tenantId": "uuid",
  "refreshToken": "dGhpcyBp..."
}

// Response (200)
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "bmV3IHRv...",
  "expiresIn": 7200
}
```

### POST /api/auth/logout
```json
// Request
{
  "tenantId": "uuid",
  "refreshToken": "dGhpcyBp..."
}

// Response (200)
{
  "success": true
}
```

### GET /api/auth/me
```json
// Headers: Authorization: Bearer <accessToken>

// Response (200)
{
  "user": {
    "id": "uuid",
    "name": "张三",
    "email": "user@example.com",
    "avatar": "https://...",
    "roles": ["admin", "user"]
  },
  "tenant": {
    "id": "uuid",
    "name": "示例企业"
  },
  "permissions": ["user:read", "user:write"]
}
```

---

## 完成标准 (DoD)

### 核心功能
- [ ] 用户名/邮箱/手机号 + 密码登录
- [ ] JWT Token 颁发与验证
- [ ] Refresh Token 机制
- [ ] 多租户数据隔离
- [ ] 登录失败锁定
- [ ] 密码 bcrypt 加密

### 安全要求
- [ ] 密码传输使用 HTTPS
- [ ] 敏感信息不在日志中明文输出
- [ ] SQL 注入防护（参数化查询）
- [ ] XSS 防护（Token 存储在 HttpOnly Cookie）
- [ ] CSRF 防护

### 可观测性
- [ ] 登录日志完整记录
- [ ] 关键错误告警（连续失败、异常 IP）
- [ ] 性能监控（P95 延迟）

### 文档与测试
- [ ] API 文档完整（Swagger/OpenAPI）
- [ ] 单元测试覆盖率 > 80%
- [ ] 集成测试覆盖主要流程
- [ ] 压力测试报告（1000 QPS）

### 部署
- [ ] 数据库迁移脚本
- [ ] 环境变量配置文档
- [ ] Docker 镜像构建
- [ ] 健康检查端点 `/api/health`

---

## 迭代计划

### v1.0 (MVP - 2 周)
- 账号密码登录
- JWT + Refresh Token
- 基础多租户隔离
- 登录日志

### v1.1 (4 周)
- 手机验证码登录
- 邮箱验证码登录
- 密码找回功能
- 设备管理（查看/踢出设备）

### v1.2 (6 周)
- 微信/钉钉 OAuth 登录
- 单点登录 (SSO) 基础支持
- 登录异常告警

### v2.0 (后续迭代)
- 双因素认证 (2FA)
- SAML/OIDC 企业集成
- 无密码登录 (Passkey)
- AI 异常行为检测

---

## 风险与依赖

### 风险
1. **安全风险**: 认证系统是攻击重点，需定期安全审计
2. **性能风险**: Token 验证频繁，需 Redis 缓存优化
3. **依赖风险**: 第三方 OAuth 服务不稳定时需降级方案

### 依赖
- Redis: Session/Token 存储
- 短信服务商：验证码发送
- 邮件服务商：验证码/通知发送
- 微信/钉钉开放平台：OAuth 接入

---

## 验收标准

1. 产品经理确认："这就是我想要的"
2. 安全团队通过基础安全检测
3. 性能测试达到 P95 < 200ms
4. 所有 Must 优先级用户故事通过验收
5. 文档完整，可交付开发团队

---

*文档版本：v1.0*  
*创建时间：2026-03-28*  
*作者：leader (saas-platform team)*
