# 数据库设计文档

**版本**: v2.0  
**更新时间**: 2026-03-28  
**数据库**: MySQL 8.0

---

## 设计原则

### 命名规范

```
✅ 表名:
• 小写字母 + 下划线
• base_前缀 (基础表)
• 示例：base_user, base_role, base_dict_type

✅ 字段名:
• f_前缀 + 下划线命名
• 语义清晰
• 示例：f_id, f_account, f_real_name
```

### 通用字段

```
所有表都包含以下审计字段:

主键:
• f_id VARCHAR(50) - UUID

租户 ID:
• f_tenant_id VARCHAR(50) DEFAULT '0'

有效标志:
• f_enabled_mark INT DEFAULT 1 (0-禁用，1-启用)

删除标志:
• f_delete_mark INT DEFAULT 0 (0-删除，1-未删除)
• f_delete_time DATETIME - 删除时间
• f_delete_user_id VARCHAR(50) - 删除人

排序:
• f_sort_code BIGINT DEFAULT 0

创建信息:
• f_creator_time DATETIME - 创建时间
• f_creator_user_id VARCHAR(50) - 创建人

修改信息:
• f_last_modify_time DATETIME - 修改时间
• f_last_modify_user_id VARCHAR(50) - 修改人

描述:
• f_description VARCHAR(500) - 描述说明
```

---

## 核心表设计

### 1. base_user (用户表)

**用途**: 存储所有用户信息 (含管理员)

```sql
CREATE TABLE base_user (
  f_id VARCHAR(50) NOT NULL COMMENT '主键',
  f_tenant_id VARCHAR(50) NOT NULL DEFAULT '0' COMMENT '租户 ID',
  
  -- 账号信息
  f_account VARCHAR(50) COMMENT '账户',
  f_password VARCHAR(50) COMMENT '密码',
  f_secretkey VARCHAR(50) COMMENT '秘钥',
  
  -- 基本信息
  f_real_name VARCHAR(50) COMMENT '姓名',
  f_nick_name VARCHAR(50) COMMENT '昵称',
  f_head_icon TEXT COMMENT '头像',
  f_gender VARCHAR(50) COMMENT '性别',
  f_birthday DATETIME COMMENT '生日',
  f_nation VARCHAR(50) COMMENT '民族',
  f_native_place VARCHAR(50) COMMENT '籍贯',
  
  -- 联系方式
  f_mobile_phone VARCHAR(20) COMMENT '手机',
  f_tele_phone VARCHAR(20) COMMENT '电话',
  f_landline VARCHAR(50) COMMENT '固话',
  f_email VARCHAR(50) COMMENT '邮箱',
  f_postal_address VARCHAR(500) COMMENT '通讯地址',
  
  -- 个人信息
  f_entry_date DATETIME COMMENT '入职日期',
  f_certificates_type VARCHAR(50) COMMENT '证件类型',
  f_certificates_number VARCHAR(50) COMMENT '证件号码',
  f_education VARCHAR(50) COMMENT '文化程度',
  f_urgent_contacts VARCHAR(50) COMMENT '紧急联系人',
  f_urgent_tele_phone VARCHAR(50) COMMENT '紧急电话',
  f_signature VARCHAR(500) COMMENT '自我介绍',
  
  -- 登录信息
  f_quick_query VARCHAR(100) COMMENT '快速查询字段',
  f_first_log_time DATETIME COMMENT '首次登录时间',
  f_first_log_ip VARCHAR(50) COMMENT '首次登录 IP',
  f_prev_log_time DATETIME COMMENT '前次登录时间',
  f_prev_log_ip VARCHAR(50) COMMENT '前次登录 IP',
  f_last_log_time DATETIME COMMENT '最后登录时间',
  f_last_log_ip VARCHAR(50) COMMENT '最后登录 IP',
  f_log_success_count INT DEFAULT 0 COMMENT '登录成功次数',
  f_log_error_count INT DEFAULT 0 COMMENT '登录错误次数',
  f_change_password_date DATETIME COMMENT '最后修改密码时间',
  
  -- 系统设置
  f_language VARCHAR(50) COMMENT '系统语言',
  f_theme VARCHAR(50) COMMENT '系统样式',
  
  -- 组织信息
  f_is_administrator INT DEFAULT 0 COMMENT '是否管理员',
  f_manager_id VARCHAR(50) COMMENT '主管 ID',
  f_organize_id VARCHAR(50) COMMENT '组织 ID',
  f_position_id VARCHAR(50) COMMENT '岗位 ID',
  f_role_id TEXT COMMENT '角色 ID 集合',
  f_portal_id TEXT COMMENT '门户 ID 集合',
  f_group_id VARCHAR(50) COMMENT '分组 ID',
  f_rank VARCHAR(50) COMMENT '职级',
  f_standing VARCHAR(50) COMMENT 'PC 身份',
  f_app_standing VARCHAR(50) COMMENT 'APP 身份',
  
  -- 状态
  f_lock_mark INT DEFAULT 0 COMMENT '是否锁定',
  f_unlock_time DATETIME COMMENT '解锁时间',
  f_handover_mark INT DEFAULT 0 COMMENT '交接状态',
  f_handover_userid VARCHAR(100) COMMENT '交接人 ID',
  
  -- 应用
  f_app_system_id VARCHAR(50) COMMENT 'App 系统 ID',
  
  -- 审计字段
  f_enabled_mark INT DEFAULT 1,
  f_sort_code BIGINT DEFAULT 0,
  f_creator_time DATETIME DEFAULT NOW(),
  f_creator_user_id VARCHAR(50),
  f_last_modify_time DATETIME,
  f_last_modify_user_id VARCHAR(50),
  f_delete_time DATETIME,
  f_delete_user_id VARCHAR(50),
  f_delete_mark INT DEFAULT 0,
  f_description VARCHAR(500),
  
  PRIMARY KEY (f_id, f_tenant_id),
  UNIQUE KEY uk_account_tenant (f_account, f_tenant_id),
  KEY idx_mobile (f_mobile_phone),
  KEY idx_email (f_email),
  KEY idx_organize (f_organize_id),
  KEY idx_delete_mark (f_delete_mark),
  KEY idx_tenant (f_tenant_id)
);
```

**关键字段说明**:

| 字段 | 说明 | 示例 |
|------|------|------|
| f_account | 登录账户 (唯一) | admin |
| f_password | 密码 (加密存储) | bcrypt 加密 |
| f_is_administrator | 是否管理员 | 0-否，1-是 |
| f_lock_mark | 是否锁定 | 0-否，1-是 |
| f_enabled_mark | 有效标志 | 0-禁用，1-启用 |
| f_delete_mark | 删除标志 | 0-删除，1-未删除 |

---

### 2. base_user_device (用户设备表)

**用途**: 记录用户登录设备

```sql
CREATE TABLE base_user_device (
  f_id VARCHAR(50) NOT NULL,
  f_tenant_id VARCHAR(50) NOT NULL DEFAULT '0',
  f_client_id VARCHAR(50) COMMENT '设备 ID',
  f_user_id VARCHAR(50) COMMENT '用户 ID',
  f_enabled_mark INT DEFAULT 1,
  -- 审计字段...
  PRIMARY KEY (f_id, f_tenant_id),
  KEY idx_user_id (f_user_id)
);
```

---

### 3. base_user_extra (用户额外信息表)

**用途**: 存储用户扩展属性

```sql
CREATE TABLE base_user_extra (
  f_id VARCHAR(50) NOT NULL,
  f_tenant_id VARCHAR(50) NOT NULL DEFAULT '0',
  f_property_json TEXT COMMENT '扩展属性 JSON',
  f_common_menu TEXT COMMENT '常用菜单 JSON',
  f_preference_json TEXT COMMENT '主题外观 JSON',
  f_user_id VARCHAR(50) COMMENT '用户 ID',
  -- 审计字段...
  UNIQUE KEY uk_user_tenant (f_user_id, f_tenant_id)
);
```

---

### 4. base_user_old_password (用户旧密码记录表)

**用途**: 记录用户历史密码

```sql
CREATE TABLE base_user_old_password (
  f_id VARCHAR(50) NOT NULL,
  f_tenant_id VARCHAR(50) NOT NULL DEFAULT '0',
  f_user_id VARCHAR(50),
  f_account VARCHAR(50),
  f_old_password VARCHAR(50),
  f_secretkey VARCHAR(50),
  -- 审计字段...
  KEY idx_user_id (f_user_id)
);
```

---

### 5. base_user_relation (用户关系表)

**用途**: 用户与其他对象的关系

```sql
CREATE TABLE base_user_relation (
  f_id VARCHAR(50) NOT NULL,
  f_tenant_id VARCHAR(50) NOT NULL DEFAULT '0',
  f_user_id VARCHAR(50),
  f_object_type VARCHAR(50) COMMENT '对象类型',
  f_object_id VARCHAR(50) COMMENT '对象 ID',
  -- 审计字段...
  KEY idx_user_id (f_user_id),
  KEY idx_object (f_object_type, f_object_id)
);
```

---

### 6. base_role (角色表)

**用途**: 角色定义

```sql
CREATE TABLE base_role (
  f_id VARCHAR(50) NOT NULL,
  f_tenant_id VARCHAR(50) NOT NULL DEFAULT '0',
  f_name VARCHAR(100) COMMENT '角色名称',
  f_code VARCHAR(50) COMMENT '角色代码',
  f_description VARCHAR(500),
  f_permissions TEXT COMMENT '权限集合 JSON',
  f_enabled_mark INT DEFAULT 1,
  f_is_system INT DEFAULT 0,
  -- 审计字段...
  UNIQUE KEY uk_code_tenant (f_code, f_tenant_id)
);
```

---

### 7. session (Session 表)

**用途**: 用户登录 Session

```sql
CREATE TABLE session (
  f_id VARCHAR(50) NOT NULL,
  f_tenant_id VARCHAR(50) NOT NULL DEFAULT '0',
  f_user_id VARCHAR(50),
  f_token VARCHAR(500) UNIQUE COMMENT 'Access Token',
  f_refresh_token VARCHAR(500) UNIQUE COMMENT 'Refresh Token',
  f_device VARCHAR(100),
  f_ip VARCHAR(50),
  f_user_agent VARCHAR(500),
  f_expires_at DATETIME,
  f_created_at DATETIME DEFAULT NOW(),
  KEY idx_user_id (f_user_id),
  KEY idx_token (f_token)
);
```

---

### 8. base_sys_log (系统日志表)

**用途**: 系统操作日志

```sql
CREATE TABLE base_sys_log (
  f_id VARCHAR(50) NOT NULL,
  f_tenant_id VARCHAR(50) NOT NULL DEFAULT '0',
  f_biz_id VARCHAR(50) COMMENT '业务 ID',
  f_user_id VARCHAR(50),
  f_user_name VARCHAR(100),
  f_log_type INT COMMENT '日志类型',
  f_log_level INT COMMENT '日志级别',
  f_ip_address VARCHAR(50),
  f_ip_address_location VARCHAR(100),
  f_request_url VARCHAR(500),
  f_request_method VARCHAR(50),
  f_request_duration INT,
  f_request_param TEXT,
  f_request_target TEXT,
  f_content TEXT,
  f_platform VARCHAR(100),
  f_browser VARCHAR(100),
  f_module_id VARCHAR(50),
  f_module_name VARCHAR(100),
  f_object_id VARCHAR(50),
  f_description VARCHAR(500),
  f_is_login_success INT,
  f_login_type INT,
  -- 审计字段...
  KEY idx_biz_id (f_biz_id),
  KEY idx_user_id (f_user_id),
  KEY idx_log_type (f_log_type),
  KEY idx_create_time (f_creator_time)
);
```

---

### 9. base_dict_type (字典类型表)

**用途**: 字典类型定义

```sql
CREATE TABLE base_dict_type (
  f_id VARCHAR(50) NOT NULL,
  f_tenant_id VARCHAR(50) NOT NULL DEFAULT '0',
  f_name VARCHAR(100),
  f_code VARCHAR(50),
  f_description VARCHAR(500),
  f_enabled_mark INT DEFAULT 1,
  f_is_system INT DEFAULT 0,
  -- 审计字段...
  UNIQUE KEY uk_code_tenant (f_code, f_tenant_id)
);
```

---

### 10. base_dict_item (字典项表)

**用途**: 字典项数据

```sql
CREATE TABLE base_dict_item (
  f_id VARCHAR(50) NOT NULL,
  f_tenant_id VARCHAR(50) NOT NULL DEFAULT '0',
  f_type_id VARCHAR(50),
  f_label VARCHAR(100),
  f_value VARCHAR(100),
  f_code VARCHAR(50),
  f_color VARCHAR(20),
  f_icon VARCHAR(100),
  f_enabled_mark INT DEFAULT 1,
  f_extra TEXT,
  -- 审计字段...
  UNIQUE KEY uk_type_value_tenant (f_type_id, f_value, f_tenant_id),
  KEY idx_type_id (f_type_id)
);
```

---

### 11. base_announcement (公告表)

**用途**: 系统公告

```sql
CREATE TABLE base_announcement (
  f_id VARCHAR(50) NOT NULL,
  f_tenant_id VARCHAR(50) NOT NULL DEFAULT '0',
  f_title VARCHAR(200),
  f_content TEXT,
  f_summary VARCHAR(500),
  f_type VARCHAR(20),
  f_category VARCHAR(50),
  f_scope VARCHAR(20),
  f_priority VARCHAR(20),
  f_status VARCHAR(20),
  f_published_by VARCHAR(50),
  f_published_at DATETIME,
  f_start_time DATETIME,
  f_end_time DATETIME,
  f_is_top INT DEFAULT 0,
  f_top_until DATETIME,
  f_view_count INT DEFAULT 0,
  f_attachments TEXT,
  -- 审计字段...
  KEY idx_type (f_type),
  KEY idx_status (f_status),
  KEY idx_published_at (f_published_at)
);
```

---

## 表关系图

```
┌─────────────────────────────────────────────────────────────────┐
│                    ER 图                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  BaseUser (1) ──< BaseUserDevice (N)                            │
│       │                                                         │
│       ├──< BaseUserExtra (1)                                   │
│       │                                                         │
│       ├──< BaseUserOldPassword (N)                             │
│       │                                                         │
│       ├──< BaseUserRelation (N)                                │
│       │                                                         │
│       └──< Session (N)                                         │
│       │                                                         │
│       └──< BaseSysLog (N)                                      │
│                                                                 │
│  BaseDictType (1) ──< BaseDictItem (N)                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 索引设计

### 通用索引

```sql
-- 租户索引 (所有表)
KEY idx_tenant_id (f_tenant_id)

-- 软删除索引 (所有表)
KEY idx_delete_mark (f_delete_mark)

-- 创建时间索引 (所有表)
KEY idx_create_time (f_creator_time)
```

### 业务索引

```sql
-- 用户表
UNIQUE KEY uk_account_tenant (f_account, f_tenant_id)
KEY idx_mobile_phone (f_mobile_phone)
KEY idx_email (f_email)
KEY idx_organize_id (f_organize_id)

-- 角色表
UNIQUE KEY uk_code_tenant (f_code, f_tenant_id)

-- Session 表
KEY idx_token (f_token)
KEY idx_user_id (f_user_id)

-- 日志表
KEY idx_biz_id (f_biz_id)
KEY idx_user_id (f_user_id)
KEY idx_log_type (f_log_type)
```

---

## 多租户设计

```
所有表都包含 f_tenant_id 字段:

• 默认值：'0'
• 作用：数据隔离
• 索引：每个表都有 f_tenant_id 索引
• 查询：WHERE f_tenant_id = ?
```

---

## 软删除设计

```
所有表都包含软删除字段:

• f_delete_mark: 0-删除，1-未删除
• f_delete_time: 删除时间
• f_delete_user_id: 删除人

查询时自动过滤已删除:
WHERE f_delete_mark = 1
```

---

**文档维护**: 小虾米  
**最后更新**: 2026-03-28
