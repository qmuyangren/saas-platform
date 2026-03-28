# 第三方配置表设计

**版本**: v1.0  
**更新时间**: 2026-03-28 15:40  
**用途**: 第三方登录配置管理

---

## 配置表总览

```
┌─────────────────────────────────────────────────────────────────┐
│                    配置表关系                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  OAuthProvider (第三方服务商配置)                               │
│       ↓                                                         │
│  OAuthClient (多应用配置 - 业务 A/B/C)                          │
│       ↓                                                         │
│  UserOAuth (用户绑定关系)                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. OAuthProvider 表 (第三方服务商配置)

**用途**: 存储第三方登录服务商的基础配置

```prisma
model OAuthProvider {
  id          String   @id @default(uuid()) @db.VarChar(36)
  name        String   @unique  // wechat/dingtalk/github/alipay
  displayName String   // 显示名称：微信/钉钉/GitHub/支付宝
  enabled     Boolean  @default(true)  // 是否启用
  
  // OAuth 配置
  authUrl     String   // 授权地址
  tokenUrl    String   // Token 交换地址
  userInfoUrl String?  // 用户信息地址 (可选)
  scope       String   // 默认请求的权限范围
  
  // 字段映射 (不同第三方返回的字段名不同)
  openIdField     String  // OpenID 字段名
  unionIdField    String? // UnionID 字段名 (可选)
  nicknameField   String  // 昵称字段名
  avatarField     String  // 头像字段名
  emailField      String? // 邮箱字段名 (可选)
  phoneField      String? // 手机号字段名 (可选)
  
  // 回调地址配置
  redirectUri   String   // 默认回调地址
  
  // 图标和样式
  iconUrl       String?
  buttonColor   String?  // 登录按钮颜色
  
  // 排序和显示
  sortOrder     Int      @default(0)
  description   String?
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // 关联
  clients       OAuthClient[]
  
  @@index([name])
  @@index([enabled])
}
```

**示例数据**:

```json
// 微信
{
  "id": "uuid-1",
  "name": "wechat",
  "displayName": "微信",
  "enabled": true,
  "authUrl": "https://open.weixin.qq.com/connect/qrconnect",
  "tokenUrl": "https://api.weixin.qq.com/sns/oauth2/access_token",
  "userInfoUrl": "https://api.weixin.qq.com/sns/userinfo",
  "scope": "snsapi_login",
  "openIdField": "openid",
  "unionIdField": "unionid",
  "nicknameField": "nickname",
  "avatarField": "headimgurl",
  "redirectUri": "https://auth.xxx.com/oauth/callback/wechat",
  "iconUrl": "/icons/wechat.svg",
  "buttonColor": "#07C160",
  "sortOrder": 1
}

// 钉钉
{
  "id": "uuid-2",
  "name": "dingtalk",
  "displayName": "钉钉",
  "enabled": true,
  "authUrl": "https://oapi.dingtalk.com/connect/qrconnect",
  "tokenUrl": "https://oapi.dingtalk.com/sns/gettoken",
  "userInfoUrl": "https://oapi.dingtalk.com/sns/getuserinfo_bycode",
  "scope": "snsapi_login",
  "openIdField": "openid",
  "unionIdField": "unionid",
  "nicknameField": "nick",
  "avatarField": "avatar",
  "redirectUri": "https://auth.xxx.com/oauth/callback/dingtalk",
  "iconUrl": "/icons/dingtalk.svg",
  "buttonColor": "#0089FF",
  "sortOrder": 2
}

// GitHub
{
  "id": "uuid-3",
  "name": "github",
  "displayName": "GitHub",
  "enabled": true,
  "authUrl": "https://github.com/login/oauth/authorize",
  "tokenUrl": "https://github.com/login/oauth/access_token",
  "userInfoUrl": "https://api.github.com/user",
  "scope": "read:user,user:email",
  "openIdField": "id",
  "nicknameField": "login",
  "avatarField": "avatar_url",
  "emailField": "email",
  "redirectUri": "https://auth.xxx.com/oauth/callback/github",
  "iconUrl": "/icons/github.svg",
  "buttonColor": "#333333",
  "sortOrder": 3
}
```

---

## 2. OAuthClient 表 (多应用配置)

**用途**: 不同业务系统使用不同的 Client ID/Secret

```prisma
model OAuthClient {
  id          String   @id @default(uuid()) @db.VarChar(36)
  providerId  String   @db.VarChar(36)
  appId       String   // 业务应用 ID (如：ecommerce/oa/cms/admin)
  appName     String   // 业务应用名称
  
  // OAuth 凭证 (每个业务独立配置)
  clientId    String
  clientSecret String
  
  // 回调地址 (每个业务可不同)
  redirectUri String
  
  // 配置
  enabled     Boolean  @default(true)
  scopes      String?  // 自定义权限范围 (为空则使用 provider 默认)
  
  // 额外参数 (JSON 格式，存储第三方特殊配置)
  extraConfig Json?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // 关联
  provider    OAuthProvider @relation(fields: [providerId], references: [id], onDelete: Cascade)
  
  @@unique([providerId, appId])
  @@index([appId])
  @@index([enabled])
}
```

**示例数据**:

```json
// 微信 - 电商系统
{
  "id": "uuid-101",
  "providerId": "uuid-1",
  "appId": "ecommerce",
  "appName": "电商系统",
  "clientId": "wxabc123456789",
  "clientSecret": "secret_ecommerce",
  "redirectUri": "https://ecommerce.xxx.com/auth/callback/wechat",
  "enabled": true,
  "scopes": "snsapi_login"
}

// 微信 - OA 系统
{
  "id": "uuid-102",
  "providerId": "uuid-1",
  "appId": "oa",
  "appName": "OA 系统",
  "clientId": "wxabc123456789",
  "clientSecret": "secret_oa",
  "redirectUri": "https://oa.xxx.com/auth/callback/wechat",
  "enabled": true,
  "scopes": "snsapi_login"
}

// 微信 - CMS 系统
{
  "id": "uuid-103",
  "providerId": "uuid-1",
  "appId": "cms",
  "appName": "CMS 系统",
  "clientId": "wxabc123456789",
  "clientSecret": "secret_cms",
  "redirectUri": "https://cms.xxx.com/auth/callback/wechat",
  "enabled": true
}

// GitHub - 电商系统
{
  "id": "uuid-201",
  "providerId": "uuid-3",
  "appId": "ecommerce",
  "appName": "电商系统",
  "clientId": "Iv1.abc123",
  "clientSecret": "github_secret_ecommerce",
  "redirectUri": "https://ecommerce.xxx.com/auth/callback/github",
  "enabled": true,
  "scopes": "read:user,user:email"
}
```

---

## 3. UserOAuth 表 (用户绑定关系)

**用途**: 用户与第三方账号的绑定关系

```prisma
model UserOAuth {
  id          String   @id @default(uuid()) @db.VarChar(36)
  userId      String   @db.VarChar(36)
  providerId  String   @db.VarChar(36)  // 关联 provider
  provider    String   // wechat/dingtalk/github (冗余字段，方便查询)
  
  // 第三方账号信息
  openId      String
  unionId     String?  // 微信 unionId(可选，用于跨应用识别)
  
  // 用户信息快照 (避免每次都调用第三方 API)
  avatar      String?
  nickname    String?
  email       String?  // 第三方返回的邮箱 (可选)
  phone       String?  // 第三方返回的手机 (可选)
  
  // OAuth Token (可选，用于调用第三方 API)
  accessToken String?
  expiresAt   DateTime?
  refreshToken String?
  
  // 绑定信息
  boundAt     DateTime @default(now())
  lastLoginAt DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // 关联
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  provider    OAuthProvider @relation(fields: [providerId], references: [id], onDelete: Cascade)
  
  @@unique([provider, openId])  // 同一第三方账号只能绑定一次
  @@index([userId])
  @@index([provider, openId])
  @@index([unionId])
}
```

**示例数据**:

```json
// 用户绑定了微信
{
  "id": "uuid-1001",
  "userId": "user-uuid-123",
  "providerId": "uuid-1",
  "provider": "wechat",
  "openId": "oXYZ123456789",
  "unionId": "union-abc123",
  "avatar": "https://wx.qlogo.cn/mmopen/...",
  "nickname": "小虾米",
  "boundAt": "2026-03-28T15:00:00Z",
  "lastLoginAt": "2026-03-28T15:30:00Z"
}

// 同一用户还绑定了 GitHub
{
  "id": "uuid-1002",
  "userId": "user-uuid-123",  // 同一个 userId
  "providerId": "uuid-3",
  "provider": "github",
  "openId": "12345678",  // GitHub 的 id
  "avatar": "https://avatars.githubusercontent.com/u/...",
  "nickname": "xiaoxiami",
  "email": "xiaoxiami@example.com",
  "boundAt": "2026-03-27T10:00:00Z",
  "lastLoginAt": "2026-03-28T14:00:00Z"
}
```

---

## 4. OAuthCallbackLog 表 (回调日志)

**用途**: 记录第三方回调详情，便于排查问题

```prisma
model OAuthCallbackLog {
  id          String   @id @default(uuid()) @db.VarChar(36)
  provider    String
  appId       String
  code        String?  // OAuth code
  state       String?  // 防 CSRF 的 state 参数
  
  // 第三方返回的原始数据 (加密存储)
  rawData     String?  // JSON 格式
  
  // 处理结果
  status      String   // success/failure
  userId      String?  @db.VarChar(36)  // 关联的用户 ID
  action      String   // login/register/bind
  
  // 错误信息
  errorCode   String?
  errorMessage String?
  
  // 请求信息
  ip          String?
  userAgent   String?
  
  createdAt   DateTime @default(now())
  
  @@index([provider])
  @@index([status])
  @@index([createdAt])
}
```

---

## 配置管理后台

```
┌─────────────────────────────────────────────────────────────────┐
│                    后台管理 - 第三方配置                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 第三方服务商管理                                            │
│     ┌──────────────────────────────────────────────────────┐   │
│     │  [新增服务商]                                         │   │
│     │                                                       │   │
│     │  服务商列表：                                         │   │
│     │  ┌──────┬────────┬──────────┬────────┬────────────┐  │   │
│     │  │ 状态 │ 名称   │ 显示名称 │ 排序   │ 操作       │  │   │
│     │  ├──────┼────────┼──────────┼────────┼────────────┤  │   │
│     │  │ ✅   │ 微信   │ 微信     │ 1      │ 编辑/禁用  │  │   │
│     │  │ ✅   │ 钉钉   │ 钉钉     │ 2      │ 编辑/禁用  │  │   │
│     │  │ ✅   │ GitHub │ GitHub   │ 3      │ 编辑/禁用  │  │   │
│     │  │ ❌   │ 支付宝 │ 支付宝   │ 4      │ 编辑/启用  │  │   │
│     │  └──────┴────────┴──────────┴────────┴────────────┘  │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
│  2. 服务商配置详情                                              │
│     ┌──────────────────────────────────────────────────────┐   │
│     │  基本信息                                            │   │
│     │  • 名称：wechat                                      │   │
│     │  • 显示名称：微信                                    │   │
│     │  • 状态：启用                                        │   │
│     │                                                       │   │
│     │  OAuth 配置                                           │   │
│     │  • 授权地址：https://open.weixin.qq.com/...          │   │
│     │  • Token 地址：https://api.weixin.qq.com/...         │   │
│     │  • 用户信息地址：https://api.weixin.qq.com/...       │   │
│     │  • Scope: snsapi_login                               │   │
│     │                                                       │   │
│     │  字段映射                                            │   │
│     │  • OpenID 字段：openid                                │   │
│     │  • UnionID 字段：unionid                              │   │
│     │  • 昵称字段：nickname                                │   │
│     │  • 头像字段：headimgurl                              │   │
│     │                                                       │   │
│     │  样式配置                                            │   │
│     │  • 图标：/icons/wechat.svg                           │   │
│     │  • 按钮颜色：#07C160                                 │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
│  3. 业务应用配置                                                │
│     ┌──────────────────────────────────────────────────────┐   │
│     │  微信配置 - 已配置 3 个应用                             │   │
│     │                                                       │   │
│     │  ┌──────────┬──────────────┬────────────┬─────────┐  │   │
│     │  │ 应用     │ Client ID    │ 回调地址   │ 状态    │  │   │
│     │  ├──────────┼──────────────┼────────────┼─────────┤  │   │
│     │  │ 电商系统 │ wxabc123...  │ /auth/...  │ ✅      │  │   │
│     │  │ OA 系统   │ wxabc123...  │ /auth/...  │ ✅      │  │   │
│     │  │ CMS 系统  │ wxabc123...  │ /auth/...  │ ✅      │  │   │
│     │  └──────────┴──────────────┴────────────┴─────────┘  │   │
│     │                                                       │   │
│     │  [添加应用配置]                                       │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
│  4. 用户绑定统计                                                │
│     ┌──────────────────────────────────────────────────────┐   │
│     │  第三方绑定统计 (近 7 天)                               │   │
│     │                                                       │   │
│     │  微信：1,234 人绑定，今日新增 56 人                     │   │
│     │  钉钉：567 人绑定，今日新增 23 人                       │   │
│     │  GitHub: 89 人绑定，今日新增 5 人                       │   │
│     │                                                       │   │
│     │  [查看详情]                                           │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 环境配置

```bash
# .env.example

# 微信开放平台
WECHAT_OPEN_APP_ID=your_wechat_app_id
WECHAT_OPEN_APP_SECRET=your_wechat_app_secret

# 钉钉开放平台
DINGTALK_APP_KEY=your_dingtalk_app_key
DINGTALK_APP_SECRET=your_dingtalk_app_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# 统一回调地址前缀
OAUTH_CALLBACK_BASE_URL=https://auth.xxx.com/oauth/callback
```

---

## 配置表关系图

```
┌─────────────────────────────────────────────────────────────────┐
│                    ER 图                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  OAuthProvider (1) ────────< OAuthClient (N)                    │
│       │                          │                              │
│       │                          │                              │
│       │                          └──────────┐                   │
│       │                                     │                   │
│       │                                     ↓                   │
│       │                              UserOAuth (N)              │
│       │                                     │                   │
│       │                                     │                   │
│       └─────────────────────────────────────┘                   │
│                                                                 │
│  User (1) ────────────────< UserOAuth (N)                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

**文档维护**: 小虾米  
**最后更新**: 2026-03-28 15:40
