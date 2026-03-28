# NestJS 企业级开发完整能力清单

> 基于 Nest.js 的企业级 SaaS 平台开发能力参考

**版本**: v1.0  
**创建时间**: 2026-03-28  
**适用范围**: 200+ 接口的 SaaS 平台

---

## 一、NestJS 专属架构组件

| 序号 | 组件类型 | 类名 | 核心功能 | 说明 |
|------|----------|------|----------|------|
| 1.1 | Module | SharedModule | 共享模块 | 导出公共 Providers（Logger、Cache、Config） |
| 1.2 | Module | CoreModule | 核心模块 | 单例服务（HttpClient、EventBus） |
| 1.3 | Module | DatabaseModule | 数据库模块 | 动态模块，支持多数据源 |
| 1.4 | Module | ConfigModule | 配置模块 | 全局配置，支持 .env 和环境验证 |
| 1.5 | Decorator | @Public() | 公开装饰器 | 跳过 AuthGuard |
| 1.6 | Decorator | @Roles() | 角色装饰器 | @Roles('admin', 'user') |
| 1.7 | Decorator | @CurrentUser() | 当前用户 | 参数装饰器，获取登录用户 |
| 1.8 | Decorator | @ApiVersion() | API 版本 | @ApiVersion('1') |
| 1.9 | Decorator | @Audit() | 审计装饰器 | @Audit('用户删除') |
| 1.10 | Decorator | @Cache() | 缓存装饰器 | @Cache('user:{id}', ttl) |
| 1.11 | Decorator | @RateLimit() | 限流装饰器 | @RateLimit({ points: 10, duration: 60 }) |
| 1.12 | Guard | JwtAuthGuard | JWT 认证守卫 | 扩展 AuthGuard('jwt') |
| 1.13 | Guard | ApiKeyGuard | API Key 守卫 | 第三方 API 认证 |
| 1.14 | Guard | PermissionGuard | 权限守卫 | 细粒度权限校验 |
| 1.15 | Interceptor | TransformInterceptor | 响应转换 | 统一包装 ApiResponse |
| 1.16 | Interceptor | LoggingInterceptor | 日志拦截器 | 记录请求/响应 |
| 1.17 | Interceptor | TimeoutInterceptor | 超时拦截器 | 请求超时处理 |
| 1.18 | Interceptor | CacheInterceptor | 缓存拦截器 | 自动缓存 GET 请求 |
| 1.19 | Pipe | ValidationPipe | 验证管道 | DTO 自动校验 |
| 1.20 | Pipe | ParseIdPipe | ID 解析 | 字符串转数字/UUID |
| 1.21 | Pipe | DefaultValuePipe | 默认值 | 参数默认值 |
| 1.22 | Filter | HttpExceptionFilter | HTTP 异常 | 统一错误响应 |
| 1.23 | Filter | PrismaExceptionFilter | Prisma 异常 | 数据库错误转换 |
| 1.24 | Middleware | LoggerMiddleware | 日志中间件 | 请求日志 |
| 1.25 | Middleware | CorsMiddleware | CORS 中间件 | 跨域配置 |
| 1.26 | Middleware | HelmetMiddleware | 安全中间件 | 安全头设置 |
| 1.27 | Middleware | CompressionMiddleware | 压缩中间件 | gzip 压缩 |

---

## 二、数据库与 ORM 集成

| 序号 | 类名 | 核心功能 | 说明 |
|------|------|----------|------|
| 2.1 | PrismaService | Prisma 封装 | 扩展 PrismaClient，添加中间件（软删除、审计、日志） |
| 2.2 | TypeOrmService | TypeORM 封装 | 多数据源、实体管理 |
| 2.3 | MongooseService | Mongoose 封装 | MongoDB 连接管理 |
| 2.4 | RedisService | Redis 封装 | 缓存、锁、Pub/Sub |
| 2.5 | ElasticsearchService | ES 封装 | 日志搜索、全文检索 |
| 2.6 | SoftDeleteMiddleware | 软删除中间件 | Prisma 自动过滤 deletedAt |
| 2.7 | AuditMiddleware | 审计中间件 | 自动记录创建人/更新人 |
| 2.8 | BaseRepository | 仓储基类 | 通用 CRUD 抽象 |
| 2.9 | BaseService | 服务基类 | 通用业务逻辑 |
| 2.10 | TransactionDecorator | 事务装饰器 | @Transaction() 方法级事务 |
| 2.11 | QueryBuilderService | 动态查询 | 复杂条件构建 |

---

## 三、微服务基础设施

| 序号 | 类名 | 核心功能 | 说明 |
|------|------|----------|------|
| 3.1 | GrpcClientModule | gRPC 客户端 | 动态模块，服务发现 |
| 3.2 | GrpcServerModule | gRPC 服务端 | 反射、拦截器 |
| 3.3 | KafkaModule | Kafka 模块 | 生产者/消费者封装 |
| 3.4 | RabbitMQModule | RabbitMQ 模块 | 连接池、重试 |
| 3.5 | ServiceRegistry | 服务注册 | Consul/Nacos 集成 |
| 3.6 | ServiceDiscovery | 服务发现 | 负载均衡 |
| 3.7 | ApiGateway | API 网关 | 路由转发、聚合 |
| 3.8 | CircuitBreakerModule | 熔断器模块 | Resilience4j 风格 |
| 3.9 | RetryModule | 重试模块 | 指数退避 |
| 3.10 | BulkheadModule | 舱壁隔离 | 资源隔离 |

---

## 四、安全与认证增强

| 序号 | 类名 | 核心功能 | 说明 |
|------|------|----------|------|
| 4.1 | CasbinService | Casbin 授权 | 灵活权限模型（ACL/RBAC/ABAC） |
| 4.2 | CasbinGuard | Casbin 守卫 | @UseGuards(CasbinGuard) |
| 4.3 | SessionStore | 会话存储 | Redis 会话存储 |
| 4.4 | CsrfService | CSRF 防护 | Token 生成/验证 |
| 4.5 | HelmetService | 安全头 | CSP、HSTS、XSS 防护 |
| 4.6 | SensitiveDataInterceptor | 敏感数据拦截 | 响应脱敏 |
| 4.7 | IpFilterGuard | IP 过滤守卫 | 黑白名单 |
| 4.8 | UserAgentGuard | UA 过滤守卫 | 设备限制 |

---

## 五、文件处理增强

| 序号 | 类名 | 核心功能 | 说明 |
|------|------|----------|------|
| 5.1 | MulterModule | 文件上传模块 | 配置存储、限制 |
| 5.2 | FileInterceptor | 文件拦截器 | @UseInterceptors(FileInterceptor('file')) |
| 5.3 | FilesInterceptor | 多文件拦截器 | @UseInterceptors(FilesInterceptor('files')) |
| 5.4 | SharpService | 图片处理 | 裁剪、压缩、水印 |
| 5.5 | ExcelExportService | Excel 导出 | 大数据量流式导出 |
| 5.6 | CsvExportService | CSV 导出 | 流式导出 |
| 5.7 | PdfGeneratorService | PDF 生成 | Puppeteer 渲染 |
| 5.8 | BulkUploadService | 批量上传 | 分批处理、进度追踪 |

---

## 六、API 文档与测试

| 序号 | 类名 | 核心功能 | 说明 |
|------|------|----------|------|
| 6.1 | SwaggerModule | Swagger 集成 | 自动生成 OpenAPI 文档 |
| 6.2 | ApiResponseDecorator | API 响应装饰器 | @ApiResponse({ type: UserDto }) |
| 6.3 | ApiPaginatedResponse | 分页响应装饰器 | @ApiPaginatedResponse(UserDto) |
| 6.4 | E2ETestModule | E2E 测试模块 | 测试数据库、Mock |
| 6.5 | TestDbService | 测试数据库 | 事务回滚隔离 |
| 6.6 | MockFactory | Mock 工厂 | 自动生成测试数据 |
| 6.7 | ContractTestModule | 契约测试 | Pact 集成 |

---

## 七、定时任务与队列

| 序号 | 类名 | 核心功能 | 说明 |
|------|------|----------|------|
| 7.1 | ScheduleModule | 调度模块 | @nestjs/schedule 封装 |
| 7.2 | CronDecorator | Cron 装饰器 | @Cron('0 * * * * *') |
| 7.3 | BullModule | Bull 队列模块 | Redis 队列 |
| 7.4 | QueueService | 队列服务 | 任务入队、处理 |
| 7.5 | QueueProcessor | 队列处理器 | @Processor('task') |
| 7.6 | BullBoardModule | Bull 可视化 | 任务监控面板 |
| 7.7 | AgendaModule | Agenda 模块 | MongoDB 任务调度 |

---

## 八、监控与运维增强

| 序号 | 类名 | 核心功能 | 说明 |
|------|------|----------|------|
| 8.1 | TerminusModule | 健康检查模块 | @nestjs/terminus |
| 8.2 | HealthIndicator | 健康指标 | 自定义指标 |
| 8.3 | MetricsModule | 指标模块 | Prometheus 集成 |
| 8.4 | OpenTelemetryModule | OTEL 模块 | 分布式追踪 |
| 8.5 | SentryModule | Sentry 模块 | 错误上报 |
| 8.6 | AuditModule | 审计模块 | 操作日志 |
| 8.7 | ActivityLogInterceptor | 活动日志拦截器 | 自动记录用户操作 |
| 8.8 | PerformanceInterceptor | 性能拦截器 | 记录耗时 |

---

## 九、配置与环境管理

| 序号 | 类名 | 核心功能 | 说明 |
|------|------|----------|------|
| 9.1 | ConfigModule | 配置模块 | @nestjs/config |
| 9.2 | EnvironmentValidator | 环境校验 | Joi/Yup schema 验证 |
| 9.3 | AppConfig | 应用配置 | 类型安全配置类 |
| 9.4 | DatabaseConfig | 数据库配置 | 多数据源配置 |
| 9.5 | RedisConfig | Redis 配置 | 集群/哨兵配置 |
| 9.6 | JwtConfig | JWT 配置 | 密钥、过期时间 |
| 9.7 | FeatureFlags | 特性开关 | 动态配置 |
| 9.8 | RemoteConfigService | 远程配置 | Apollo/Nacos 集成 |

---

## 十、事件驱动与消息

| 序号 | 类名 | 核心功能 | 说明 |
|------|------|----------|------|
| 10.1 | EventEmitterModule | 事件模块 | @nestjs/event-emitter |
| 10.2 | DomainEvent | 领域事件基类 | DDD 事件 |
| 10.3 | EventHandler | 事件处理器 | @OnEvent('user.created') |
| 10.4 | CqrsModule | CQRS 模块 | @nestjs/cqrs |
| 10.5 | CommandBus | 命令总线 | 处理命令 |
| 10.6 | QueryBus | 查询总线 | 处理查询 |
| 10.7 | EventBus | 事件总线 | 发布事件 |
| 10.8 | Saga | 长事务 | 事件驱动流程 |

---

## 十一、WebSocket 实时通信

| 序号 | 类名 | 核心功能 | 说明 |
|------|------|----------|------|
| 11.1 | WebSocketGateway | WebSocket 网关 | @WebSocketGateway() |
| 11.2 | WsAuthGuard | WS 认证守卫 | 连接认证 |
| 11.3 | WsExceptionFilter | WS 异常过滤 | 统一异常处理 |
| 11.4 | RoomService | 房间服务 | 房间管理、广播 |
| 11.5 | PresenceService | 在线状态 | 用户在线状态 |
| 11.6 | SseGateway | SSE 网关 | Server-Sent Events |

---

## 十二、GraphQL 支持

| 序号 | 类名 | 核心功能 | 说明 |
|------|------|----------|------|
| 12.1 | GraphQLModule | GraphQL 模块 | Apollo Server 集成 |
| 12.2 | GraphQLGuard | GraphQL 守卫 | 认证授权 |
| 12.3 | GraphQLInterceptor | GraphQL 拦截器 | 响应转换 |
| 12.4 | GraphQLExceptionFilter | GraphQL 异常 | 错误格式化 |
| 12.5 | DataLoaderService | DataLoader | N+1 查询优化 |
| 12.6 | FederationModule | Apollo Federation | 联邦网关 |

---

## 十三、DTO 与实体设计

| 序号 | 类型 | 类名 | 说明 |
|------|------|------|------|
| 13.1 | DTO | CreateUserDto | 创建请求 |
| 13.2 | DTO | UpdateUserDto | 更新请求（PartialType） |
| 13.3 | DTO | UserResponseDto | 响应（@Exclude 敏感字段） |
| 13.4 | DTO | PaginatedDto | 分页 DTO 泛型 |
| 13.5 | Entity | BaseEntity | id, createdAt, updatedAt |
| 13.6 | Entity | SoftDeleteEntity | deletedAt 扩展 |
| 13.7 | VO | ValueObject | 值对象基类 |
| 13.8 | Aggregate | AggregateRoot | 聚合根基类 |

---

## 十四、开发工具与调试

| 序号 | 类名 | 核心功能 | 说明 |
|------|------|----------|------|
| 14.1 | ConsoleModule | 控制台模块 | 自定义 CLI 命令 |
| 14.2 | SeederCommand | 数据填充命令 | nest console seed |
| 14.3 | MigrationCommand | 迁移命令 | nest console migrate |
| 14.4 | DevtoolsModule | 开发工具 | 调试面板、性能分析 |
| 14.5 | SwaggerUi | Swagger UI | API 调试界面 |
| 14.6 | GraphQLPlayground | GraphQL Playground | GraphQL 调试 |
| 14.7 | HotReload | 热重载 | 开发模式自动重启 |

---

## 十五、部署与运维配置

| 序号 | 配置文件 | 说明 |
|------|----------|------|
| 15.1 | Dockerfile | 多阶段构建 |
| 15.2 | docker-compose.yml | 服务编排（PostgreSQL/Redis/ES） |
| 15.3 | .env.example | 环境变量模板 |
| 15.4 | pm2.json | PM2 配置 |
| 15.5 | kubernetes/ | K8s 部署文件 |
| 15.6 | nginx.conf | 反向代理配置 |
| 15.7 | healthcheck.sh | 健康检查脚本 |
| 15.8 | migration-runner.js | 迁移执行器 |

---

## 十六、项目目录结构（完整版）

```
project/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/
│   │   ├── decorators/        # 自定义装饰器
│   │   ├── filters/           # 异常过滤器
│   │   ├── guards/            # 守卫
│   │   ├── interceptors/      # 拦截器
│   │   ├── pipes/             # 管道
│   │   ├── middleware/        # 中间件
│   │   ├── interfaces/        # 接口定义
│   │   └── utils/             # 工具函数
│   ├── config/                # 配置
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── validation.schema.ts
│   ├── database/              # 数据库
│   │   ├── entities/          # TypeORM 实体
│   │   ├── prisma/            # Prisma schema
│   │   ├── migrations/        # 迁移文件
│   │   ├── seeds/             # 数据填充
│   │   ├── factories/         # 测试工厂
│   │   └── repositories/      # 自定义仓储
│   ├── modules/               # 业务模块
│   │   ├── user/
│   │   │   ├── user.module.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.repository.ts
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── listeners/
│   │   │   ├── subscribers/
│   │   │   └── tests/
│   │   ├── auth/
│   │   ├── order/
│   │   └── ...
│   ├── shared/                # 共享模块
│   │   ├── services/
│   │   ├── constants/
│   │   └── types/
│   ├── microservices/         # 微服务
│   │   ├── grpc/
│   │   ├── kafka/
│   │   └── rabbitmq/
│   └── jobs/                  # 定时任务
│       ├── scheduled/
│       └── queues/
├── test/
│   ├── e2e/
│   ├── unit/
│   ├── factories/
│   └── mocks/
├── scripts/                   # 脚本
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── nest-cli.json
├── tsconfig.json
├── package.json
├── pm2.json
└── README.md
```

---

## 十七、生产环境必备检查清单

| 类别 | 检查项 | 说明 |
|------|--------|------|
| **安全** | Helmet 启用 | 安全头配置 |
| **安全** | Rate Limit 配置 | 防 DDoS |
| **安全** | CORS 限制 | 白名单策略 |
| **安全** | 敏感数据脱敏 | 日志/响应 |
| **安全** | SQL 注入防护 | 参数化查询 |
| **性能** | 压缩启用 | gzip/brotli |
| **性能** | 缓存策略 | Redis 缓存热点 |
| **性能** | 连接池配置 | DB/Redis 连接池 |
| **性能** | 慢查询监控 | >100ms 记录 |
| **可观测** | 结构化日志 | JSON 格式 |
| **可观测** | 分布式追踪 | TraceId 注入 |
| **可观测** | 指标采集 | Prometheus |
| **可观测** | 健康检查 | /health, /ready, /live |
| **高可用** | 优雅关闭 | SIGTERM 处理 |
| **高可用** | 重试机制 | 外部依赖重试 |
| **高可用** | 熔断器 | 故障隔离 |
| **运维** | 容器化 | Docker + K8s |
| **运维** | 日志轮转 | 防止磁盘占满 |
| **运维** | 备份策略 | DB/配置备份 |
| **开发** | API 文档 | Swagger/OpenAPI |
| **开发** | 环境隔离 | dev/staging/prod |
| **开发** | 代码规范 | ESLint + Prettier |
| **开发** | Git Hooks | Husky + lint-staged |

---

## 十八、推荐安装的 NestJS 包

```json
{
  "dependencies": {
    // 核心
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/platform-fastify": "^10.0.0",
    
    // 配置
    "@nestjs/config": "^3.0.0",
    
    // 数据库
    "@nestjs/typeorm": "^10.0.0",
    "@nestjs/mongoose": "^10.0.0",
    "@nestjs/prisma": "^2.0.0",
    
    // 缓存
    "@nestjs/cache-manager": "^2.0.0",
    "cache-manager-redis-yet": "^4.0.0",
    
    // 微服务
    "@nestjs/microservices": "^10.0.0",
    "@nestjs/websockets": "^10.0.0",
    "@nestjs/platform-socket.io": "^10.0.0",
    
    // 认证
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/throttler": "^5.0.0",
    
    // 事件
    "@nestjs/event-emitter": "^2.0.0",
    "@nestjs/cqrs": "^10.0.0",
    
    // 任务
    "@nestjs/schedule": "^4.0.0",
    "@nestjs/bull": "^10.0.0",
    
    // 文档
    "@nestjs/swagger": "^7.0.0",
    
    // 监控
    "@nestjs/terminus": "^10.0.0",
    
    // 测试
    "@nestjs/testing": "^10.0.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0"
  }
}
```

---

## 实施路线图

### 第一阶段：核心基础 (2 周) ⭐⭐⭐⭐⭐

```
✅ 已完成:
• AuthService/JwtService/PasswordService
• TransformInterceptor/LoggingInterceptor
• AllExceptionsFilter
• CurrentUser/Public 装饰器

⏳ 待实现:
• RoleService/PermissionService
• BaseRepository/BaseService
• BusinessException/PrismaExceptionFilter
• ValidationPipe/ParseIdPipe
• CacheService
```

### 第二阶段：业务支持 (1 个月) ⭐⭐⭐⭐

```
• SessionManager/RefreshTokenService
• RateLimiter/ThrottlerGuard
• CaptchaService
• EmailService/SmsService
• FileInterceptor/StorageService
• ScheduleModule
• BullModule
```

### 第三阶段：企业级 (3 个月) ⭐⭐⭐

```
• CasbinService
• MultiTenant
• WorkflowEngine
• BillingEngine
• AuditModule
• Microservices
```

### 第四阶段：扩展 (按需) ⭐⭐

```
• gRPC/Kafka/RabbitMQ
• Elasticsearch
• WebSocket/SSE
• GraphQL
```

---

## 使用指南

### 何时查阅本文档？

1. **新模块开发前** - 查看需要哪些组件
2. **遇到技术问题时** - 查找标准解决方案
3. **代码审查时** - 检查是否遵循最佳实践
4. **性能优化时** - 查看缓存/限流/熔断方案
5. **生产部署前** - 对照检查清单

### 如何使用？

```
1. 确定需求场景
   ↓
2. 查找对应章节
   ↓
3. 参考类名和功能
   ↓
4. 按需实现
   ↓
5. 不要过度设计
```

---

**维护者**: 小虾米  
**创建时间**: 2026-03-28  
**最后更新**: 2026-03-28

**提示**: 本文档作为能力参考字典，按需查阅，不要一次性实现所有内容。
