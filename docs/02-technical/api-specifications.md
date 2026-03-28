# 技术选型与 API 规范

**版本**: v1.0  
**更新时间**: 2026-03-28 16:03  
**用途**: 技术栈/API 规范/响应格式/网关配置

---

## 一、技术栈选型

### 1.1 完整技术栈

```
┌─────────────────────────────────────────────────────────────────┐
│                    技术栈总览                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  【前端技术栈】                                                 │
│  • 框架：React 18 + TypeScript 5                               │
│  • 构建：Vite 5                                                │
│  • UI 库：shadcn/ui + Ant Design 5                             │
│  • 样式：Tailwind CSS 3                                        │
│  • 状态：Zustand 4                                             │
│  • 路由：React Router 6                                        │
│  • HTTP: Axios 1 + @tanstack/react-query 5                     │
│  • 表单：react-hook-form 7 + Zod 3                             │
│  • 图表：ECharts 5 / AntV G2                                   │
│  • 富文本：TipTap / Quill                                      │
│                                                                 │
│  【后端技术栈】                                                 │
│  • 框架：Fastify 4 (高性能) / NestJS 10 (企业级)               │
│  • 语言：Node.js 20 + TypeScript 5                             │
│  • ORM: Prisma 5                                               │
│  • 数据库：MySQL 8.0                                           │
│  • 缓存：Redis 7                                               │
│  • 消息队列：RabbitMQ / Redis Stream                           │
│  • 认证：NextAuth.js / JWT + bcrypt                            │
│  • 验证：Zod / class-validator                                 │
│  • 文档：Swagger / OpenAPI 3                                   │
│                                                                 │
│  【移动端】                                                     │
│  • 框架：uni-app 3 + Vue 3                                     │
│  • 小程序：微信小程序 / 支付宝小程序                            │
│  • H5: 同上 (前端技术栈)                                       │
│                                                                 │
│  【运维部署】                                                   │
│  • 容器：Docker + Docker Compose                               │
│  • 编排：Kubernetes (可选)                                     │
│  • CI/CD: GitHub Actions / GitLab CI                           │
│  • 监控：Sentry + Prometheus + Grafana                         │
│  • 日志：Winston + ELK Stack                                   │
│  • 存储：阿里云 OSS / 腾讯云 COS / 本地存储                     │
│                                                                 │
│  【第三方服务】                                                 │
│  • 短信：阿里云短信 / 腾讯云短信                               │
│  • 邮件：SendGrid / 阿里云邮件推送                             │
│  • 支付：微信支付 / 支付宝 / Stripe                            │
│  • 地图：高德地图 / 腾讯地图                                   │
│  • 推送：极光推送 / 个推                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 1.2 UI 框架选择

```
┌─────────────────────────────────────────────────────────────────┐
│                    UI 框架选择                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  【主框架】shadcn/ui ⭐                                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  优点：                                                   │  │
│  │  • 基于 Radix UI，无障碍支持好                           │  │
│  │  • 代码在自己项目中，完全可控                            │  │
│  │  • 高度可定制，易于主题化                                │  │
│  │  • TypeScript 支持好                                      │  │
│  │  • Tailwind CSS 集成                                     │  │
│  │  • 体积小，按需引入                                      │  │
│  │                                                          │  │
│  │  缺点：                                                   │  │
│  │  • 组件数量相对较少                                      │  │
│  │  • 需要自己组合复杂组件                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  【补充框架】Ant Design 5 ⭐                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  使用场景：                                               │  │
│  │  • 复杂表单 (ProForm)                                    │  │
│  │  • 高级表格 (ProTable)                                   │  │
│  │  • 后台管理系统                                          │  │
│  │  • 企业级应用                                            │  │
│  │                                                          │  │
│  │  优点：                                                   │  │
│  │  • 组件丰富，开箱即用                                    │  │
│  │  • 企业级设计规范                                        │  │
│  │  • 文档完善                                              │  │
│  │  • 社区活跃                                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  【使用策略】                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • C 端业务 (电商/门户): shadcn/ui 为主                   │  │
│  │  • B 端业务 (后台/OA): Ant Design 为主                    │  │
│  │  • 混合场景：shadcn/ui + Ant Design 按需组合             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 二、消息模板配置表

### 2.1 MessageTemplate 表 (更新版)

**用途**: 支持多渠道、多业务的消息模板

```prisma
model MessageTemplate {
  id          String   @id @default(uuid()) @db.VarChar(36)
  
  // 模板信息
  name        String   // 模板名称
  code        String   @unique  // 模板代码 (如：USER_REGISTER)
  category    String   // 分类：user/order/finance/system
  
  // 业务标识
  appId       String   @default("default")  // 业务系统标识 (ecommerce/oa/cms)
  
  // 渠道配置
  channel     String   // sms/email/inapp/wechat
  
  // 模板内容
  title       String?  // 标题 (邮件/站内信用)
  content     String   @db.Text  // 内容 (支持 HTML/变量)
  subject     String?  // 邮件主题
  
  // 短信专用
  smsSignName String?  // 短信签名
  smsTemplateCode String?  // 短信模板代码
  
  // 变量定义 (JSON)
  variables   Json?    // [{"name": "username", "type": "string", "required": true}]
  
  // 状态
  enabled     Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([code])
  @@index([channel])
  @@index([appId])
}
```

**示例数据**:

```json
// 用户注册 - 短信模板
{
  "id": "tpl-sms-uuid-1",
  "name": "用户注册验证码 - 短信",
  "code": "USER_REGISTER_SMS",
  "category": "user",
  "appId": "ecommerce",
  "channel": "sms",
  "content": "【SaaS 平台】您的验证码是${code}，${minute}分钟内有效，请勿泄露。",
  "smsSignName": "SaaS 平台",
  "smsTemplateCode": "SMS_123456789",
  "variables": [
    {"name": "code", "type": "string", "required": true},
    {"name": "minute", "type": "number", "required": true, "default": 5}
  ],
  "enabled": true
}

// 用户注册 - 邮件模板
{
  "id": "tpl-email-uuid-1",
  "name": "用户注册欢迎 - 邮件",
  "code": "USER_REGISTER_EMAIL",
  "category": "user",
  "appId": "ecommerce",
  "channel": "email",
  "subject": "欢迎加入 SaaS 平台！",
  "content": "<html><body><h1>欢迎 ${username}！</h1><p>您的账号已创建成功。</p></body></html>",
  "variables": [
    {"name": "username", "type": "string", "required": true},
    {"name": "email", "type": "string", "required": true}
  ],
  "enabled": true
}

// 用户注册 - 站内信模板
{
  "id": "tpl-inapp-uuid-1",
  "name": "用户注册欢迎 - 站内信",
  "code": "USER_REGISTER_INAPP",
  "category": "user",
  "appId": "ecommerce",
  "channel": "inapp",
  "title": "欢迎加入 SaaS 平台！",
  "content": "亲爱的 ${username}，欢迎加入 SaaS 平台！您的账号已创建成功。",
  "variables": [
    {"name": "username", "type": "string", "required": true}
  ],
  "enabled": true
}

// 订单创建 - 短信模板
{
  "id": "tpl-sms-uuid-2",
  "name": "订单创建通知 - 短信",
  "code": "ORDER_CREATED_SMS",
  "category": "order",
  "appId": "ecommerce",
  "channel": "sms",
  "content": "【SaaS 平台】您的订单${orderNo}已创建，金额${amount}元，请及时支付。",
  "variables": [
    {"name": "orderNo", "type": "string", "required": true},
    {"name": "amount", "type": "number", "required": true}
  ],
  "enabled": true
}
```

---

## 三、网关配置

### 3.1 ApiGateway 表 (API 网关配置)

**用途**: API 网关路由和限流配置

```prisma
model ApiGateway {
  id          String   @id @default(uuid()) @db.VarChar(36)
  
  // 路由信息
  path        String   @unique  // API 路径 (如：/api/v1/users)
  method      String   // HTTP 方法 (GET/POST/PUT/DELETE)
  
  // 服务配置
  serviceName String   // 后端服务名
  serviceUrl  String   // 后端服务 URL
  
  // 认证配置
  authRequired Boolean @default(true)
  authType    String   @default("jwt")  // jwt/oauth/api_key
  
  // 限流配置
  rateLimitEnabled Boolean @default(true)
  rateLimitPerMinute Int @default(100)
  rateLimitPerHour   Int @default(1000)
  
  // 缓存配置
  cacheEnabled Boolean @default(false)
  cacheTtl     Int    @default(300)  // 缓存时间 (秒)
  
  // 状态
  enabled     Boolean @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([path])
  @@index([enabled])
}
```

---

## 四、API 接口规范

### 4.1 响应数据结构规范

```
┌─────────────────────────────────────────────────────────────────┐
│                    响应数据结构                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  【成功响应格式】                                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  {                                                        │  │
│  │    "success": true,                                      │  │
│  │    "code": "SUCCESS",                                   │  │
│  │    "message": "操作成功",                                │  │
│  │    "data": { ... },  // 业务数据                         │  │
│  │    "timestamp": 1711641600000,                           │  │
│  │    "traceId": "abc-123-def"                              │  │
│  │  }                                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  【错误响应格式】                                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  {                                                        │  │
│  │    "success": false,                                     │  │
│  │    "code": "USER_NOT_FOUND",                            │  │
│  │    "message": "用户不存在",                              │  │
│  │    "data": null,                                         │  │
│  │    "timestamp": 1711641600000,                           │  │
│  │    "traceId": "abc-123-def",                             │  │
│  │    "details": {  // 可选，详细错误信息                   │  │
│  │      "field": "userId",                                  │  │
│  │      "reason": "ID 格式不正确"                            │  │
│  │    }                                                      │  │
│  │  }                                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  【列表响应格式】                                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  {                                                        │  │
│  │    "success": true,                                      │  │
│  │    "code": "SUCCESS",                                   │  │
│  │    "message": "查询成功",                                │  │
│  │    "data": {                                              │  │
│  │      "list": [ ... ],  // 数据列表                       │  │
│  │      "pagination": {                                      │  │
│  │        "page": 1,         // 当前页码                     │  │
│  │        "pageSize": 20,    // 每页数量                     │  │
│  │        "total": 100,      // 总记录数                     │  │
│  │        "totalPages": 5    // 总页数                       │  │
│  │      }                                                      │  │
│  │    },                                                       │  │
│  │    "timestamp": 1711641600000,                             │  │
│  │    "traceId": "abc-123-def"                                │  │
│  │  }                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4.2 统一响应类型定义

```typescript
// types/api-response.ts

// 基础响应结构
interface ApiResponse<T = any> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  timestamp: number;
  traceId: string;
}

// 成功响应
interface SuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
  code: 'SUCCESS' | string;
}

// 错误响应
interface ErrorResponse extends ApiResponse<null> {
  success: false;
  code: string;
  details?: {
    field: string;
    reason: string;
  };
}

// 分页参数
interface PaginationParams {
  page?: number;      // 页码 (从 1 开始)
  pageSize?: number;  // 每页数量 (默认 20)
  sort?: string;      // 排序字段
  order?: 'asc' | 'desc';  // 排序方向
}

// 分页响应
interface PaginatedResponse<T = any> extends ApiResponse<{
  list: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}> {}

// 列表响应 (简单版，无分页信息)
interface ListResponse<T = any> extends ApiResponse<{
  list: T[];
  total?: number;
}> {}
```

---

### 4.3 操作响应规范

```typescript
// 添加操作响应
interface CreateResponse<T = any> extends SuccessResponse<{
  id: string;
  createdAt: string;
  data?: T;
}> {}

// 示例
POST /api/v1/users
Request: { "username": "test", "email": "test@example.com" }
Response: {
  "success": true,
  "code": "USER_CREATED",
  "message": "用户创建成功",
  "data": {
    "id": "uuid-123",
    "createdAt": "2026-03-28T08:00:00Z",
    "data": {
      "username": "test",
      "email": "test@example.com"
    }
  },
  "timestamp": 1711641600000,
  "traceId": "abc-123-def"
}

// 编辑操作响应
interface UpdateResponse<T = any> extends SuccessResponse<{
  id: string;
  updatedAt: string;
  data?: T;
}> {}

// 示例
PUT /api/v1/users/:id
Request: { "username": "updated" }
Response: {
  "success": true,
  "code": "USER_UPDATED",
  "message": "用户更新成功",
  "data": {
    "id": "uuid-123",
    "updatedAt": "2026-03-28T08:00:00Z",
    "data": {
      "username": "updated"
    }
  },
  "timestamp": 1711641600000,
  "traceId": "abc-123-def"
}

// 删除操作响应
interface DeleteResponse extends SuccessResponse<{
  id: string;
  deletedAt: string;
}> {}

// 示例
DELETE /api/v1/users/:id
Response: {
  "success": true,
  "code": "USER_DELETED",
  "message": "用户删除成功",
  "data": {
    "id": "uuid-123",
    "deletedAt": "2026-03-28T08:00:00Z"
  },
  "timestamp": 1711641600000,
  "traceId": "abc-123-def"
}

// 查询单个响应
interface DetailResponse<T = any> extends SuccessResponse<T> {}

// 示例
GET /api/v1/users/:id
Response: {
  "success": true,
  "code": "SUCCESS",
  "message": "查询成功",
  "data": {
    "id": "uuid-123",
    "username": "test",
    "email": "test@example.com"
  },
  "timestamp": 1711641600000,
  "traceId": "abc-123-def"
}

// 查询列表响应 (分页)
interface ListResponse<T = any> extends SuccessResponse<{
  list: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}> {}

// 示例
GET /api/v1/users?page=1&pageSize=20
Response: {
  "success": true,
  "code": "SUCCESS",
  "message": "查询成功",
  "data": {
    "list": [
      { "id": "uuid-1", "username": "test1" },
      { "id": "uuid-2", "username": "test2" }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "timestamp": 1711641600000,
  "traceId": "abc-123-def"
}
```

---

### 4.4 GET 请求时间戳参数

```typescript
// GET 请求添加时间戳防缓存
interface GetRequestParams {
  _t?: number;  // 时间戳参数 (防浏览器缓存)
  [key: string]: any;
}

// API 调用示例
function apiGet<T>(url: string, params?: GetRequestParams): Promise<ApiResponse<T>> {
  const timestamp = Date.now();
  return axios.get(url, {
    params: {
      ...params,
      _t: timestamp  // 添加时间戳
    }
  });
}

// 使用示例
// GET /api/v1/users/123?_t=1711641600000
apiGet('/api/v1/users/123');

// GET /api/v1/users?page=1&pageSize=20&_t=1711641600000
apiGet('/api/v1/users', { page: 1, pageSize: 20 });
```

**时间戳参数规则**:
- 参数名：`_t`
- 值：`Date.now()` (毫秒时间戳)
- 作用：防止浏览器缓存 GET 请求
- 后端处理：忽略此参数，不进入业务逻辑

---

### 4.5 错误码规范

```typescript
// 错误码定义
enum ErrorCode {
  // 成功
  SUCCESS = 'SUCCESS',
  
  // 通用错误 (1000-1999)
  BAD_REQUEST = 'BAD_REQUEST',           // 400
  UNAUTHORIZED = 'UNAUTHORIZED',         // 401
  FORBIDDEN = 'FORBIDDEN',               // 403
  NOT_FOUND = 'NOT_FOUND',               // 404
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED', // 405
  INTERNAL_ERROR = 'INTERNAL_ERROR',     // 500
  
  // 用户相关 (2000-2999)
  USER_NOT_FOUND = 'USER_NOT_FOUND',     // 2001
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS', // 2002
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS', // 2003
  USER_LOCKED = 'USER_LOCKED',           // 2004
  
  // 认证相关 (3000-3999)
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',       // 3001
  TOKEN_INVALID = 'TOKEN_INVALID',       // 3002
  TOKEN_MISSING = 'TOKEN_MISSING',       // 3003
  
  // 验证码相关 (4000-4999)
  CAPTCHA_REQUIRED = 'CAPTCHA_REQUIRED', // 4001
  CAPTCHA_INVALID = 'CAPTCHA_INVALID',   // 4002
  SMS_CODE_INVALID = 'SMS_CODE_INVALID', // 4003
  EMAIL_CODE_INVALID = 'EMAIL_CODE_INVALID', // 4004
  
  // 业务相关 (5000-5999)
  // 根据具体业务定义
}

// 错误码使用规则:
// • 通用错误使用标准 HTTP 状态码对应的错误码
// • 业务错误使用分段错误码，便于定位问题
// • 错误码应该是英文大写，下划线分隔
```

---

### 4.6 API 版本管理

```
┌─────────────────────────────────────────────────────────────────┐
│                    API 版本管理                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  版本格式：/api/v{version}/{resource}                          │
│                                                                 │
│  示例：                                                         │
│  • /api/v1/users          - v1 版本用户 API                     │
│  • /api/v2/users          - v2 版本用户 API                     │
│  • /api/v1/orders         - v1 版本订单 API                     │
│                                                                 │
│  版本策略：                                                     │
│  • v1: 初始版本                                                │
│  • v2: 向后兼容的重大更新                                      │
│  • v3: 破坏性变更                                              │
│                                                                 │
│  版本废弃：                                                     │
│  • 提前 3 个月通知                                              │
│  • 返回 Deprecation 响应头                                      │
│  • 文档标注废弃时间                                             │
│                                                                 │
│  响应头：                                                       │
│  X-API-Version: v1                                             │
│  X-API-Deprecated: true  (已废弃时)                            │
│  X-API-Sunset: 2026-06-28  (废弃时间)                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4.7 请求头规范

```
┌─────────────────────────────────────────────────────────────────┐
│                    请求头规范                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  【必需请求头】                                                 │
│  Content-Type: application/json                                │
│  Authorization: Bearer {token}  (需要认证的接口)                │
│  X-Request-ID: {uuid}  (请求追踪 ID)                           │
│                                                                 │
│  【可选请求头】                                                 │
│  X-API-Version: v1  (指定 API 版本)                             │
│  X-App-ID: ecommerce  (业务系统标识)                           │
│  X-Tenant-ID: {tenantId}  (多租户标识)                         │
│  Accept-Language: zh-CN  (国际化)                              │
│                                                                 │
│  【响应头】                                                     │
│  X-Request-ID: {uuid}  (与请求 ID 一致)                         │
│  X-API-Version: v1                                             │
│  X-RateLimit-Limit: 100                                        │
│  X-RateLimit-Remaining: 99                                     │
│  X-RateLimit-Reset: 1711641600                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 五、错误处理规范

```typescript
// 统一错误处理中间件

// 业务错误
class BusinessError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = 'BusinessError';
  }
}

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const traceId = req.headers['x-request-id'] as string || generateTraceId();
  
  if (err instanceof BusinessError) {
    return res.status(err.status).json({
      success: false,
      code: err.code,
      message: err.message,
      data: null,
      timestamp: Date.now(),
      traceId,
      details: err.details
    });
  }
  
  // 未知错误
  return res.status(500).json({
    success: false,
    code: 'INTERNAL_ERROR',
    message: '服务器内部错误',
    data: null,
    timestamp: Date.now(),
    traceId
  });
});
```

---

**文档维护**: 小虾米  
**最后更新**: 2026-03-28 16:03
