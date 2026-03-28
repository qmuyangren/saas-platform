# 系统配置表设计 (完整版)

**版本**: v1.0  
**更新时间**: 2026-03-28 15:45  
**用途**: 完整系统配置管理

---

## 配置表总览

```
┌─────────────────────────────────────────────────────────────────┐
│                    配置表分类                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  【认证相关】                                                   │
│  • OAuthProvider      - 第三方服务商配置                        │
│  • OAuthClient        - 多应用 OAuth 配置                        │
│  • UserOAuth          - 用户绑定关系                            │
│  • SmsProvider        - 短信运营商配置 ⭐ NEW                   │
│  • EmailProvider      - 邮箱服务商配置 ⭐ NEW                   │
│                                                                 │
│  【安全相关】                                                   │
│  • SecurityConfig     - 登录安全配置 ⭐ NEW                     │
│  • PasswordPolicy     - 密码安全配置 ⭐ NEW                     │
│                                                                 │
│  【系统相关】                                                   │
│  • SystemConfig       - 系统基础信息配置 ⭐ NEW                 │
│  • AdminUser          - 系统管理员配置 ⭐ NEW                   │
│                                                                 │
│  【存储相关】                                                   │
│  • StorageProvider    - 文件存储配置 ⭐ NEW                     │
│  • StorageBucket      - 存储桶配置 ⭐ NEW                       │
│                                                                 │
│  【用户相关】                                                   │
│  • User               - 用户主表                                │
│  • UserSession        - 用户会话                                │
│  • AuditLog           - 审计日志                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 一、认证相关配置

### 1.1 SmsProvider 表 (短信运营商配置)

**用途**: 配置短信服务商，支持多服务商切换

```prisma
model SmsProvider {
  id          String   @id @default(uuid()) @db.VarChar(36)
  name        String   @unique  // aliyun/tencent/huawei/yunpian
  displayName String   // 显示名称：阿里云/腾讯云/华为云/云片
  
  enabled     Boolean  @default(true)
  isDefault   Boolean  @default(false)  // 是否为默认服务商
  
  // 认证信息
  accessKeyId String
  accessKeySecret String
  
  // 配置
  signName    String   // 短信签名
  templateCode String  // 默认模板代码
  
  // 服务商特定配置 (JSON)
  config      Json?
  
  // 限额配置
  dailyLimit  Int      @default(10000)  // 每日发送上限
  rateLimit   Int      @default(100)    // 每分钟发送上限
  
  // 价格配置 (用于成本统计)
  pricePerSms Decimal  @default(0.04)   // 单条价格 (元)
  
  // 统计
  totalSent   Int      @default(0)
  todaySent   Int      @default(0)
  lastResetAt DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([name])
  @@index([enabled])
  @@index([isDefault])
}
```

**示例数据**:

```json
// 阿里云短信
{
  "id": "sms-uuid-1",
  "name": "aliyun",
  "displayName": "阿里云短信",
  "enabled": true,
  "isDefault": true,
  "accessKeyId": "LTAI5t...",
  "accessKeySecret": "secret...",
  "signName": "SaaS 平台",
  "templateCode": "SMS_123456789",
  "config": {
    "region": "cn-hangzhou",
    "endpoint": "dysmsapi.aliyuncs.com"
  },
  "dailyLimit": 10000,
  "rateLimit": 100,
  "pricePerSms": 0.04
}

// 腾讯云短信
{
  "id": "sms-uuid-2",
  "name": "tencent",
  "displayName": "腾讯云短信",
  "enabled": true,
  "isDefault": false,
  "accessKeyId": "AKID...",
  "accessKeySecret": "secret...",
  "signName": "SaaS 平台",
  "templateCode": "123456",
  "config": {
    "region": "ap-guangzhou",
    "appId": "1400123456"
  },
  "dailyLimit": 10000,
  "rateLimit": 100,
  "pricePerSms": 0.035
}
```

---

### 1.2 EmailProvider 表 (邮箱服务商配置)

**用途**: 配置邮件发送服务商

```prisma
model EmailProvider {
  id          String   @id @default(uuid()) @db.VarChar(36)
  name        String   @unique  // aliyun/tencent/sendgrid/smtp
  displayName String   // 阿里云邮件/腾讯云邮件/SendGrid/SMTP
  
  enabled     Boolean  @default(true)
  isDefault   Boolean  @default(false)
  
  // 服务商类型
  type        String   // api/smtp
  
  // API 方式配置
  apiKey      String?
  apiSecret   String?
  apiEndpoint String?
  
  // SMTP 方式配置
  smtpHost    String?
  smtpPort    Int?
  smtpUser    String?
  smtpPassword String?
  smtpSecure  Boolean  @default(true)  // 是否 SSL
  
  // 发件人配置
  fromEmail   String
  fromName    String
  
  // 限额配置
  dailyLimit  Int      @default(1000)
  rateLimit   Int      @default(60)     // 每分钟发送上限
  
  // 统计
  totalSent   Int      @default(0)
  todaySent   Int      @default(0)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([name])
  @@index([enabled])
  @@index([type])
}
```

**示例数据**:

```json
// SendGrid (API 方式)
{
  "id": "email-uuid-1",
  "name": "sendgrid",
  "displayName": "SendGrid",
  "enabled": true,
  "isDefault": true,
  "type": "api",
  "apiKey": "SG.abc123...",
  "apiEndpoint": "https://api.sendgrid.com/v3/mail/send",
  "fromEmail": "noreply@xxx.com",
  "fromName": "SaaS 平台",
  "dailyLimit": 1000,
  "rateLimit": 60
}

// SMTP 方式 (自建邮件服务器)
{
  "id": "email-uuid-2",
  "name": "smtp-self",
  "displayName": "自建 SMTP",
  "enabled": false,
  "isDefault": false,
  "type": "smtp",
  "smtpHost": "smtp.xxx.com",
  "smtpPort": 587,
  "smtpUser": "noreply@xxx.com",
  "smtpPassword": "password",
  "smtpSecure": true,
  "fromEmail": "noreply@xxx.com",
  "fromName": "SaaS 平台",
  "dailyLimit": 500,
  "rateLimit": 30
}
```

---

## 二、安全相关配置

### 2.1 SecurityConfig 表 (登录安全配置)

**用途**: 系统级登录安全策略

```prisma
model SecurityConfig {
  id          String   @id @default(uuid()) @db.VarChar(36)
  configKey   String   @unique  // 配置键
  
  // 密码错误锁定策略
  maxFailedAttempts Int    @default(5)   // 最大失败次数
  lockoutDuration   Int    @default(900) // 锁定时长 (秒，默认 15 分钟)
  
  // 验证码策略
  captchaEnabled    Boolean @default(true)
  captchaAfterFail  Int     @default(1)   // 失败几次后显示验证码
  captchaType       String  @default("slider") // slider/graphic
  
  // 滑块验证配置
  sliderProvider    String  @default("geetest") // geetest/easydata
  sliderThreshold   Decimal @default(0.8)       // 通过阈值
  
  // Session 配置
  sessionTimeout    Int     @default(7200)      // 会话超时 (秒，默认 2 小时)
  maxConcurrentSessions Int @default(5)         // 最大并发会话数
  
  // Token 配置
  accessTokenExpiry   Int   @default(7200)      // Access Token 过期时间 (秒)
  refreshTokenExpiry  Int   @default(604800)    // Refresh Token 过期时间 (秒，7 天)
  
  // 第三方登录配置
  oauthEnabled      Boolean @default(true)
  oauthAutoRegister Boolean @default(true)      // 是否自动注册
  
  // IP 限制
  ipWhitelist       String?  // IP 白名单 (JSON 数组)
  ipBlacklist       String?  // IP 黑名单 (JSON 数组)
  ipLimitEnabled    Boolean @default(false)
  ipLimitPerHour    Int     @default(100)       // 每小时 IP 请求上限
  
  // 地域限制
  geoLimitEnabled   Boolean @default(false)
  allowedRegions    String?  // 允许的地区 (JSON 数组)
  
  // 审计
  auditLoginEnabled Boolean @default(true)
  auditLogoutEnabled Boolean @default(true)
  
  updatedAt   DateTime @updatedAt
  updatedBy   String?  @db.VarChar(36)  // 最后修改的管理员 ID
  
  @@index([configKey])
}
```

**示例数据**:

```json
{
  "id": "security-uuid-1",
  "configKey": "login_security",
  "maxFailedAttempts": 5,
  "lockoutDuration": 900,
  "captchaEnabled": true,
  "captchaAfterFail": 1,
  "captchaType": "slider",
  "sliderProvider": "geetest",
  "sliderThreshold": 0.8,
  "sessionTimeout": 7200,
  "maxConcurrentSessions": 5,
  "accessTokenExpiry": 7200,
  "refreshTokenExpiry": 604800,
  "oauthEnabled": true,
  "oauthAutoRegister": true,
  "ipWhitelist": null,
  "ipBlacklist": null,
  "ipLimitEnabled": false,
  "auditLoginEnabled": true,
  "auditLogoutEnabled": true
}
```

---

### 2.2 PasswordPolicy 表 (密码安全配置)

**用途**: 密码复杂度策略

```prisma
model PasswordPolicy {
  id          String   @id @default(uuid()) @db.VarChar(36)
  configKey   String   @unique
  
  // 长度要求
  minLength   Int      @default(6)
  maxLength   Int      @default(20)
  
  // 复杂度要求
  requireUppercase Boolean @default(true)   // 要求大写字母
  requireLowercase Boolean @default(true)   // 要求小写字母
  requireNumbers   Boolean @default(true)   // 要求数字
  requireSpecial   Boolean @default(false)  // 要求特殊字符
  
  // 密码历史 (不能与最近 N 次密码相同)
  passwordHistory Int    @default(3)
  
  // 密码有效期
  passwordExpiryDays Int @default(0)  // 0=永不过期
  
  // 加密配置
  algorithm       String @default("bcrypt")  // bcrypt/argon2/pbkdf2
  bcryptCost      Int    @default(12)        // bcrypt 成本因子
  argon2Memory    Int    @default(65536)     // argon2 内存 (KB)
  argon2Iterations Int   @default(3)         // argon2 迭代次数
  
  // 弱密码检查
  checkWeakPassword Boolean @default(true)
  weakPasswordList  String?  // 弱密码列表 (JSON 数组)
  
  updatedAt   DateTime @updatedAt
  updatedBy   String?  @db.VarChar(36)
  
  @@index([configKey])
}
```

**示例数据**:

```json
{
  "id": "password-uuid-1",
  "configKey": "default_policy",
  "minLength": 6,
  "maxLength": 20,
  "requireUppercase": true,
  "requireLowercase": true,
  "requireNumbers": true,
  "requireSpecial": false,
  "passwordHistory": 3,
  "passwordExpiryDays": 0,
  "algorithm": "bcrypt",
  "bcryptCost": 12,
  "checkWeakPassword": true,
  "weakPasswordList": ["123456", "password", "admin123"]
}
```

---

## 三、系统相关配置

### 3.1 SystemConfig 表 (系统基础信息配置)

**用途**: 系统全局配置

```prisma
model SystemConfig {
  id          String   @id @default(uuid()) @db.VarChar(36)
  configKey   String   @unique
  
  // 系统信息
  systemName      String  @default("SaaS 平台")
  systemVersion   String  @default("1.0.0")
  systemLogo      String?
  systemFavicon   String?
  
  // 公司信息
  companyName     String?
  companyAddress  String?
  companyPhone    String?
  companyEmail    String?
  companyIcp      String?  // ICP 备案号
  companyGongan   String?  // 公安备案号
  
  // 联系方式
  supportEmail    String?
  supportPhone    String?
  supportQQ       String?
  supportWechat   String?  // 客服微信
  
  // 协议
  userAgreementUrl String?
  privacyPolicyUrl String?
  
  // 功能开关
  registrationEnabled Boolean @default(true)   // 是否允许注册
  emailVerificationRequired Boolean @default(true)  // 注册需验证邮箱
  phoneVerificationRequired Boolean @default(false) // 注册需验证手机
  
  // 默认配置
  defaultTimeZone   String @default("Asia/Shanghai")
  defaultLanguage   String @default("zh-CN")
  defaultCurrency   String @default("CNY")
  
  // 维护模式
  maintenanceMode   Boolean @default(false)
  maintenanceMessage String?
  
  updatedAt   DateTime @updatedAt
  updatedBy   String?  @db.VarChar(36)
  
  @@index([configKey])
}
```

**示例数据**:

```json
{
  "id": "system-uuid-1",
  "configKey": "basic",
  "systemName": "SaaS 平台",
  "systemVersion": "1.0.0",
  "systemLogo": "/images/logo.png",
  "systemFavicon": "/images/favicon.ico",
  "companyName": "XXX 科技有限公司",
  "companyEmail": "contact@xxx.com",
  "companyIcp": "浙 ICP 备 12345678 号",
  "supportEmail": "support@xxx.com",
  "supportPhone": "400-123-4567",
  "userAgreementUrl": "/docs/user-agreement",
  "privacyPolicyUrl": "/docs/privacy",
  "registrationEnabled": true,
  "emailVerificationRequired": true,
  "defaultTimeZone": "Asia/Shanghai",
  "defaultLanguage": "zh-CN",
  "maintenanceMode": false
}
```

---

### 3.2 AdminUser 表 (系统管理员配置)

**用途**: 后台管理员账号

```prisma
model AdminUser {
  id          String   @id @default(uuid()) @db.VarChar(36)
  username    String   @unique
  password    String   // bcrypt 加密
  email       String   @unique
  phone       String?  @unique
  avatar      String?
  nickname    String?
  
  // 角色和权限
  role        AdminRole @default(OPERATOR)
  permissions String?   // 额外权限 (JSON 数组)
  
  // 状态
  status      AdminStatus @default(ACTIVE)
  lastLoginAt DateTime?
  lastLoginIp String?
  
  // 安全
  failedAttempts Int    @default(0)
  lockedUntil    DateTime?
  mustChangePassword Boolean @default(false)  // 首次登录强制改密
  
  // 双因素认证 (可选)
  twoFactorEnabled Boolean @default(false)
  twoFactorSecret  String?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([username])
  @@index([email])
  @@index([status])
}

enum AdminRole {
  SUPER_ADMIN    // 超级管理员
  ADMIN          // 管理员
  OPERATOR       // 操作员
  AUDITOR        // 审计员
}

enum AdminStatus {
  ACTIVE
  DISABLED
  LOCKED
}
```

**示例数据**:

```json
// 超级管理员
{
  "id": "admin-uuid-1",
  "username": "admin",
  "password": "$2b$12$...",  // bcrypt 加密
  "email": "admin@xxx.com",
  "role": "SUPER_ADMIN",
  "status": "ACTIVE",
  "mustChangePassword": true
}

// 操作员
{
  "id": "admin-uuid-2",
  "username": "operator1",
  "password": "$2b$12$...",
  "email": "op1@xxx.com",
  "role": "OPERATOR",
  "permissions": ["user:view", "user:edit"],
  "status": "ACTIVE"
}
```

---

## 四、存储相关配置

### 4.1 StorageProvider 表 (文件存储服务商配置)

**用途**: 配置文件存储服务商，支持本地 + 第三方云存储

```prisma
model StorageProvider {
  id          String   @id @default(uuid()) @db.VarChar(36)
  name        String   @unique  // local/aliyun-oss/tencent-cos/qiniu/aws-s3
  displayName String   // 本地存储/阿里云 OSS/腾讯云 COS/七牛云/AWS S3
  
  enabled     Boolean  @default(true)
  isDefault   Boolean  @default(false)
  
  // 存储类型
  type        String   // local/cloud
  
  // 本地存储配置
  localPath   String?  // 本地存储路径
  
  // 云存储配置
  accessKeyId String?
  accessKeySecret String?
  region      String?  // 存储区域
  endpoint    String?  // 访问域名
  
  // 桶配置
  bucket      String?
  
  // CDN 配置
  cdnEnabled  Boolean  @default(false)
  cdnDomain   String?
  
  // 限额配置
  maxFileSize Int      @default(104857600)   // 最大文件大小 (字节，默认 100MB)
  maxStorage  Int      @default(10737418240) // 最大存储容量 (字节，默认 10GB)
  
  // 统计
  usedStorage Int      @default(0)
  fileCount   Int      @default(0)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([name])
  @@index([type])
  @@index([enabled])
}
```

**示例数据**:

```json
// 本地存储
{
  "id": "storage-uuid-1",
  "name": "local",
  "displayName": "本地存储",
  "enabled": true,
  "isDefault": true,
  "type": "local",
  "localPath": "/data/uploads",
  "maxFileSize": 104857600,
  "maxStorage": 10737418240
}

// 阿里云 OSS
{
  "id": "storage-uuid-2",
  "name": "aliyun-oss",
  "displayName": "阿里云 OSS",
  "enabled": true,
  "isDefault": false,
  "type": "cloud",
  "accessKeyId": "LTAI5t...",
  "accessKeySecret": "secret...",
  "region": "oss-cn-hangzhou",
  "endpoint": "oss-cn-hangzhou.aliyuncs.com",
  "bucket": "saas-uploads",
  "cdnEnabled": true,
  "cdnDomain": "cdn.xxx.com",
  "maxFileSize": 104857600,
  "maxStorage": 107374182400  // 100GB
}

// 腾讯云 COS
{
  "id": "storage-uuid-3",
  "name": "tencent-cos",
  "displayName": "腾讯云 COS",
  "enabled": false,
  "isDefault": false,
  "type": "cloud",
  "accessKeyId": "AKID...",
  "accessKeySecret": "secret...",
  "region": "ap-guangzhou",
  "bucket": "saas-123456",
  "maxFileSize": 104857600,
  "maxStorage": 107374182400
}
```

---

### 4.2 StorageBucket 表 (存储桶配置)

**用途**: 多业务系统独立存储桶配置

```prisma
model StorageBucket {
  id          String   @id @default(uuid()) @db.VarChar(36)
  providerId  String   @db.VarChar(36)
  
  // 业务标识
  appId       String   // ecommerce/oa/cms/admin
  appName     String   // 电商系统/OA 系统/CMS 系统
  
  // 桶配置
  bucket      String   // 存储桶名称
  path        String   @default("/")  // 存储路径前缀
  
  // 访问配置
  accessLevel String   @default("private")  // private/public
  domain      String?  // 自定义域名
  
  // 生命周期
  expiryDays  Int?     // 文件过期天数 (null=永不过期)
  
  enabled     Boolean  @default(true)
  
  // 统计
  usedStorage Int      @default(0)
  fileCount   Int      @default(0)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // 关联
  provider    StorageProvider @relation(fields: [providerId], references: [id], onDelete: Cascade)
  
  @@unique([providerId, appId])
  @@index([appId])
}
```

**示例数据**:

```json
// 电商系统 - 阿里云 OSS
{
  "id": "bucket-uuid-1",
  "providerId": "storage-uuid-2",
  "appId": "ecommerce",
  "appName": "电商系统",
  "bucket": "saas-ecommerce",
  "path": "/products",
  "accessLevel": "public",
  "domain": "img.xxx.com",
  "enabled": true
}

// OA 系统 - 本地存储
{
  "id": "bucket-uuid-2",
  "providerId": "storage-uuid-1",
  "appId": "oa",
  "appName": "OA 系统",
  "bucket": "local",
  "path": "/oa/documents",
  "accessLevel": "private",
  "enabled": true
}

// CMS 系统 - 阿里云 OSS
{
  "id": "bucket-uuid-3",
  "providerId": "storage-uuid-2",
  "appId": "cms",
  "appName": "CMS 系统",
  "bucket": "saas-cms",
  "path": "/articles",
  "accessLevel": "public",
  "enabled": true
}
```

---

### 4.3 File 表 (文件记录)

**用途**: 文件上传记录

```prisma
model File {
  id          String   @id @default(uuid()) @db.VarChar(36)
  
  // 文件信息
  filename    String   // 原始文件名
  storedName  String   // 存储文件名 (UUID)
  extension   String   // 文件扩展名
  mimeType    String   // MIME 类型
  size        Int      // 文件大小 (字节)
  
  // 存储位置
  providerId  String   @db.VarChar(36)
  bucketId    String?  @db.VarChar(36)
  path        String   // 存储路径
  url         String   // 访问 URL
  cdnUrl      String?  // CDN URL
  
  // 上传信息
  uploadedBy  String?  @db.VarChar(36)  // 上传用户 ID
  uploadedAt  DateTime @default(now())
  
  // 业务关联
  appId       String?  // 业务系统标识
  businessId  String?  // 业务 ID
  businessType String? // 业务类型
  
  // 状态
  status      String   @default("active")  // active/deleted
  
  // 元数据
  metadata    Json?
  
  @@index([providerId])
  @@index([uploadedBy])
  @@index([appId])
  @@index([uploadedAt])
}
```

---

## 五、配置管理后台

```
┌─────────────────────────────────────────────────────────────────┐
│                    后台管理 - 系统配置                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 短信配置                                                    │
│     • 短信服务商管理 (阿里云/腾讯云/华为云)                     │
│     • 签名和模板管理                                           │
│     • 发送统计和成本分析                                       │
│                                                                 │
│  2. 邮箱配置                                                    │
│     • 邮箱服务商管理 (SendGrid/阿里云/SMTP)                     │
│     • 发件人配置                                               │
│     • 模板管理                                                 │
│                                                                 │
│  3. 安全配置                                                    │
│     • 登录安全策略 (失败锁定/验证码)                            │
│     • 密码安全策略 (复杂度/加密算法)                            │
│     • IP 限制和地域限制                                         │
│                                                                 │
│  4. 系统配置                                                    │
│     • 系统基本信息                                             │
│     • 公司信息                                                 │
│     • 联系方式                                                 │
│     • 功能开关                                                 │
│                                                                 │
│  5. 管理员管理                                                  │
│     • 管理员账号管理                                           │
│     • 角色权限管理                                             │
│     • 登录日志                                                 │
│                                                                 │
│  6. 存储配置                                                    │
│     • 存储服务商管理 (本地/OSS/COS/S3)                          │
│     • 存储桶配置 (多业务独立)                                   │
│     • 文件管理                                                 │
│     • 存储统计                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 六、配置表 ER 图

```
┌─────────────────────────────────────────────────────────────────┐
│                    完整 ER 图                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SecurityConfig (1)                                             │
│  PasswordPolicy (1)                                             │
│  SystemConfig (1)                                               │
│                                                                 │
│  SmsProvider (1) ────< SmsLog (N)                               │
│                                                                 │
│  EmailProvider (1) ────< EmailLog (N)                           │
│                                                                 │
│  AdminUser (N)                                                  │
│                                                                 │
│  StorageProvider (1) ────< StorageBucket (N)                    │
│       │                          │                              │
│       │                          └──────< File (N)              │
│       │                                                         │
│       └──────────────────────────────────< File (N)             │
│                                                                 │
│  OAuthProvider (1) ────< OAuthClient (N)                        │
│       │                          │                              │
│       └──────────────────────────< UserOAuth (N)                │
│                                                                 │
│  User (1) ────────────────< UserOAuth (N)                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

**文档维护**: 小虾米  
**最后更新**: 2026-03-28 15:45
