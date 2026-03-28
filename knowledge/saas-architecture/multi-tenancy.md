# 多租户架构设计 (Multi-Tenancy Architecture)

## 三种主流策略对比

```
┌────────────────────────────────────────────────────────────────────────┐
│  策略 1: 独立数据库 (Database-per-Tenant)                              │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐                           │
│  │ Tenant A │   │ Tenant B │   │ Tenant C │                           │
│  │   DB     │   │   DB     │   │   DB     │                           │
│  │          │   │          │   │          │                           │
│  │ [users]  │   │ [users]  │   │ [users]  │                           │
│  │ [orders] │   │ [orders] │   │ [orders] │                           │
│  │ [products]│  │ [products]│  │ [products]│                          │
│  └──────────┘   └──────────┘   └──────────┘                           │
│       ↑              ↑              ↑                                  │
│       └──────────────┼──────────────┘                                  │
│                      │                                                 │
│              ┌───────▼───────┐                                         │
│              │  Connection   │                                         │
│              │    Pool       │                                         │
│              └───────────────┘                                         │
│                                                                        │
│  ✅ 优点:                                                              │
│  • 数据隔离最彻底，安全性最高                                           │
│  • 可按租户定制 schema                                                  │
│  • 备份/恢复独立                                                        │
│  • 适合高价值客户/合规要求                                              │
│                                                                        │
│  ❌ 缺点:                                                              │
│  • 成本高 (每个租户一个数据库)                                          │
│  • 连接池管理复杂                                                       │
│  • 跨租户分析困难                                                       │
│  • 迁移/升级工作量大                                                    │
│                                                                        │
│  适用场景：企业客户、金融、医疗等强合规场景                              │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  策略 2: 共享数据库，独立 Schema (Schema-per-Tenant)                   │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────────────────────────────────────────────────┐          │
│  │                    PostgreSQL DB                         │          │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │          │
│  │  │ Schema: A   │  │ Schema: B   │  │ Schema: C   │       │          │
│  │  │             │  │             │  │             │       │          │
│  │  │ [users]     │  │ [users]     │  │ [users]     │       │          │
│  │  │ [orders]    │  │ [orders]    │  │ [orders]    │       │          │
│  │  │ [products]  │  │ [products]  │  │ [products]  │       │          │
│  │  └─────────────┘  └─────────────┘  └─────────────┘       │          │
│  └──────────────────────────────────────────────────────────┘          │
│                          ↑                                             │
│                  ┌───────┴───────┐                                     │
│                  │  SET search   │                                     │
│                  │  path TO A    │                                     │
│                  └───────────────┘                                     │
│                                                                        │
│  ✅ 优点:                                                              │
│  • 数据隔离较好                                                        │
│  • 成本适中 (单数据库)                                                  │
│  • 可按租户定制表结构                                                   │
│  • 备份可独立                                                           │
│                                                                        │
│  ❌ 缺点:                                                              │
│  • 仅支持 PostgreSQL (MySQL 无 schema 概念)                             │
│  • 连接池仍需管理                                                       │
│  • 跨租户查询需要切换 schema                                            │
│                                                                        │
│  适用场景：中等规模 SaaS，技术栈为 PostgreSQL                            │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  策略 3: 共享数据库 + 行级隔离 (Row-Level Isolation) ⭐ 推荐起步        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────────────────────────────────────────────────┐          │
│  │                      Single DB                           │          │
│  │  ┌─────────────────────────────────────────────────┐     │          │
│  │  │  tenants 表                                      │     │          │
│  │  │  ┌────┬───────────┬──────────┬───────────────┐  │     │          │
│  │  │  │ id │ tenant_id │   name   │   subdomain   │  │     │          │
│  │  │  ├────┼───────────┼──────────┼───────────────┤  │     │          │
│  │  │  │ 1  │ t_001     │ CompanyA │ a.saas.com    │  │     │          │
│  │  │  │ 2  │ t_002     │ CompanyB │ b.saas.com    │  │     │          │
│  │  │  └────┴───────────┴──────────┴───────────────┘  │     │          │
│  │  └─────────────────────────────────────────────────┘     │          │
│  │  ┌─────────────────────────────────────────────────┐     │          │
│  │  │  users 表 (所有租户共享)                          │     │          │
│  │  │  ┌────┬───────────┬──────────┬───────────────┐  │     │          │
│  │  │  │ id │ tenant_id │  email   │    role       │  │     │          │
│  │  │  ├────┼───────────┼──────────┼───────────────┤  │     │          │
│  │  │  │ 1  │ t_001     │ u1@a.com │ admin         │  │     │          │
│  │  │  │ 2  │ t_001     │ u2@a.com │ user          │  │     │          │
│  │  │  │ 3  │ t_002     │ u3@b.com │ admin         │  │     │          │
│  │  │  └────┴───────────┴──────────┴───────────────┘  │     │          │
│  │  └─────────────────────────────────────────────────┘     │          │
│  │  ┌─────────────────────────────────────────────────┐     │          │
│  │  │  orders 表 (所有租户共享)                         │     │          │
│  │  │  ┌────┬───────────┬──────────┬───────────────┐  │     │          │
│  │  │  │ id │ tenant_id │  amount  │    status     │  │     │          │
│  │  │  ├────┼───────────┼──────────┼───────────────┤  │     │          │
│  │  │  │ 1  │ t_001     │  100.00  │ paid          │  │     │          │
│  │  │  │ 2  │ t_002     │  250.00  │ pending       │  │     │          │
│  │  │  └────┴───────────┴──────────┴───────────────┘  │     │          │
│  │  └─────────────────────────────────────────────────┘     │          │
│  └──────────────────────────────────────────────────────────┘          │
│                          ↑                                             │
│              ┌───────────┴───────────┐                                 │
│              │  WHERE tenant_id = ?  │                                 │
│              │  (每条查询自动附加)     │                                 │
│              └───────────────────────┘                                 │
│                                                                        │
│  ✅ 优点:                                                              │
│  • 成本最低 (单数据库单 schema)                                          │
│  • 运维简单 (一次升级全租户生效)                                         │
│  • 跨租户分析容易                                                       │
│  • 连接池管理简单                                                       │
│                                                                        │
│  ❌ 缺点:                                                              │
│  • 代码层需确保 tenant_id 不泄露                                         │
│  • 数据隔离依赖应用层 (需严格测试)                                       │
│  • 大租户可能影响小租户性能                                              │
│                                                                        │
│  适用场景：初创 SaaS、中小客户、快速迭代阶段 ⭐                           │
└────────────────────────────────────────────────────────────────────────┘
```

## 推荐方案：混合策略

```
┌─────────────────────────────────────────────────────────────────┐
│                    混合策略 (Hybrid Approach)                    │
│                                                                 │
│  默认：行级隔离 (90% 租户)                                       │
│  ┌─────────────────────────────────────────────────────┐       │
│  │  Shared DB - Row-Level Isolation                    │       │
│  │  • 中小客户                                          │       │
│  │  • 免费/基础版用户                                    │       │
│  │  • 快速上线，低成本                                  │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
│  VIP：独立数据库 (10% 租户)                                     │
│  ┌─────────────────────────────────────────────────────┐       │
│  │  Dedicated DB - Enterprise Clients                  │       │
│  │  • 大客户/企业版                                     │       │
│  │  • 强合规要求 (金融、医疗)                            │       │
│  │  • 可定制 schema                                      │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
│  好处：                                                          │
│  • 起步成本低                                                    │
│  • 未来可升级 (租户增长后迁移独立 DB)                              │
│  • 满足不同客户需求                                              │
└─────────────────────────────────────────────────────────────────┘
```

## 技术实现细节

### 1. 租户识别 (Tenant Identification)

```
请求 → 识别租户 → 设置上下文 → 自动附加 tenant_id

识别方式:
┌──────────────────────────────────────────────────────┐
│ 1. Subdomain (推荐)                                  │
│    https://acme.saas.com → tenant: acme              │
│    https://beta.saas.com → tenant: beta              │
├──────────────────────────────────────────────────────┤
│ 2. Custom Domain                                     │
│    https://app.acme.com → CNAME → saas.com           │
│    查 DNS → 映射到 tenant                            │
├──────────────────────────────────────────────────────┤
│ 3. Header / JWT Claim                                │
│    X-Tenant-ID: acme                                 │
│    JWT: { "tenant_id": "acme" }                      │
├──────────────────────────────────────────────────────┤
│ 4. Path Prefix (不推荐，SEO 差)                        │
│    https://saas.com/acme/dashboard                   │
└──────────────────────────────────────────────────────┘
```

### 2. 数据库设计示例

```sql
-- 租户表
CREATE TABLE tenants (
  id VARCHAR(20) PRIMARY KEY,        -- t_001, t_002...
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(100) UNIQUE,     -- acme, beta...
  custom_domain VARCHAR(255),
  plan ENUM('free', 'pro', 'enterprise'),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 用户表 (所有租户共享)
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tenant_id VARCHAR(20) NOT NULL,    -- 关键字段！
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'member', 'viewer'),
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_tenant_users (tenant_id, email),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- 订单表 (示例业务表)
CREATE TABLE orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tenant_id VARCHAR(20) NOT NULL,    -- 关键字段！
  order_no VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2),
  status ENUM('pending', 'paid', 'shipped'),
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_tenant_orders (tenant_id, created_at),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
```

### 3. 应用层实现 (Node.js + TypeScript)

```typescript
// 中间件：自动识别租户并设置上下文
app.use(async (req, res, next) => {
  // 1. 从 subdomain 提取租户
  const subdomain = req.get('host')?.split('.')[0];
  const tenant = await db.tenants.findOne({ where: { subdomain } });
  
  if (!tenant) {
    return res.status(404).json({ error: 'Tenant not found' });
  }
  
  // 2. 设置请求上下文
  req.tenant = tenant;
  
  // 3. 后续所有查询自动附加 tenant_id
  next();
});

// Repository 层：自动附加 tenant_id
class OrderRepository {
  async findAll(req: Request) {
    return db.orders.findMany({
      where: {
        tenant_id: req.tenant.id,  // 自动附加
        // ...其他条件
      }
    });
  }
  
  async create(req: Request, data: OrderCreateInput) {
    return db.orders.create({
      data: {
        ...data,
        tenant_id: req.tenant.id,  // 自动附加
      }
    });
  }
}
```

## 安全注意事项

```
⚠️ 关键风险点:

1. 忘记附加 tenant_id
   → 使用 ORM 钩子/中间件强制附加
   → Code Review 重点检查

2. 批量操作泄露
   → DELETE/UPDATE 必须带 tenant_id
   → 使用事务 + 严格 WHERE 条件

3. 跨租户 IDOR
   → 用户 A 不能通过猜测 ID 访问用户 B 数据
   → 所有查询必须校验 tenant_id

4. 数据导出/导入
   → 导出时过滤 tenant_id
   → 导入时校验租户权限
```

---

_下一步：用户/权限系统 (RBAC) 设计_
