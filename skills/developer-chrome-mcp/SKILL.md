# Developer 自测技能 (Chrome MCP 版)

**版本**: v3.0  
**更新时间**: 2026-03-28  
**基于**: Chrome DevTools MCP (官方最新版)

---

## 一、Chrome DevTools MCP 简介

### 什么是 Chrome DevTools MCP？

Chrome DevTools MCP 是一个 Model Context Protocol (MCP) 服务器，让 AI 编程助手能够：
- **控制 Chrome 浏览器** - 自动化操作
- **性能分析** - 记录 traces 并提取性能洞察
- **高级调试** - 分析网络请求、截图、检查控制台消息
- **可靠自动化** - 使用 Puppeteer 自动等待操作结果

### 核心工具

#### 输入自动化 (9 个工具)
- `click` - 点击元素
- `drag` - 拖拽元素
- `fill` - 填充表单字段
- `fill_form` - 填充整个表单
- `handle_dialog` - 处理对话框
- `hover` - 悬停元素
- `press_key` - 按键
- `type_text` - 输入文本
- `upload_file` - 上传文件

#### 导航自动化 (6 个工具)
- `close_page` - 关闭页面
- `list_pages` - 列出所有页面
- `navigate_page` - 导航到 URL
- `new_page` - 打开新页面
- `select_page` - 选择页面
- `wait_for` - 等待元素/条件

#### 调试工具 (6 个工具)
- `evaluate_script` - 执行 JavaScript
- `get_console_message` - 获取控制台消息
- `lighthouse_audit` - Lighthouse 审计
- `list_console_messages` - 列出控制台消息
- `take_screenshot` - 截图
- `take_snapshot` - 获取 DOM 快照

#### 网络工具 (2 个工具)
- `get_network_request` - 获取网络请求详情
- `list_network_requests` - 列出所有网络请求

#### 性能工具 (4 个工具)
- `performance_analyze_insight` - 分析性能洞察
- `performance_start_trace` - 开始性能追踪
- `performance_stop_trace` - 停止性能追踪
- `take_memory_snapshot` - 获取内存快照

---

## 二、安装配置

### 系统要求

- Node.js v20.19 或更高版本
- Chrome 最新稳定版或更高版本
- npm

### 安装方法

#### 方法 1: 全局安装 (推荐)

```bash
npm install -g chrome-devtools-mcp
```

#### 方法 2: 使用 npx (无需安装)

```bash
npx -y chrome-devtools-mcp@latest
```

### MCP 客户端配置

#### Claude Code

```bash
# 安装 MCP 服务器
claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest

# 或使用 slim 模式 (仅基本功能)
claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest -- --slim --headless
```

#### Cursor

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

#### VS Code

```bash
# macOS/Linux
code --add-mcp '{"name":"io.github.ChromeDevTools/chrome-devtools-mcp","command":"npx","args":["-y","chrome-devtools-mcp"],"env":{}}'

# Windows PowerShell
code --add-mcp '{"""name""":""io.github.ChromeDevTools/chrome-devtools-mcp""","""command""":""npx""","""args"":["""-y""","""chrome-devtools-mcp"""]}'
```

---

## 三、开发者自测流程

### 3.1 测试准备

```bash
# 1. 确认前后端已启动
exec: lsof -i :3000  # 后端
exec: lsof -i :5173  # 前端

# 2. 打开 Chrome DevTools MCP
# 在 Claude Code/Cursor 中自动启动
```

### 3.2 登录功能测试 (完整示例)

```markdown
【测试场景】：用户登录

【MCP 测试步骤】:

1. 导航到登录页面
   ```
   navigate_page: https://localhost:5173/login
   ```

2. 检查页面加载
   ```
   take_screenshot
   list_console_messages
   ```

3. 填充登录表单
   ```
   fill_form: {
     "input[type='text']": "admin",
     "input[type='password']": "Admin123",
     "input[name='captcha']": "abcd"
   }
   ```

4. 点击登录按钮
   ```
   click: .ant-btn-primary
   ```

5. 等待导航
   ```
   wait_for: { selector: ".dashboard", timeout: 5000 }
   ```

6. 验证网络请求
   ```
   list_network_requests: {
     patterns: ["/api/v1/auth/login"],
     resourceTypes: ["fetch", "xhr"]
   }
   
   get_network_request: {
     requestId: "从列表中选择登录请求"
   }
   ```

7. 检查响应数据
   ```
   evaluate_script: `
     const request = await fetch('/api/v1/auth/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         account: 'admin',
         password: 'Admin123',
         captcha: 'abcd'
       })
     });
     const response = await request.json();
     console.log('登录响应:', response);
     return response;
   `
   ```

8. 验证本地存储
   ```
   evaluate_script: `
     const token = localStorage.getItem('accessToken');
     console.log('Token:', token);
     return {
       hasToken: !!token,
       tokenStartsWith: token ? token.substring(0, 20) : null
     };
   `
   ```

9. 检查控制台错误
   ```
   list_console_messages: { level: 'error' }
   ```

10. 截图验证
    ```
    take_screenshot
    ```

【测试通过标准】:
✅ 页面正常加载，无控制台错误
✅ 登录成功，跳转到仪表盘
✅ 网络请求返回 200 状态码
✅ Token 正确存储在 localStorage
✅ 无 JavaScript 错误

【测试失败处理】:
❌ 页面加载失败 → 检查前端服务器
❌ 登录失败 → 查看后端日志
❌ Token 未存储 → 检查登录逻辑
❌ 控制台错误 → 修复错误后重试
```

### 3.3 标签页功能测试

```markdown
【测试场景】：标签页管理

【MCP 测试步骤】:

1. 打开多个页面
   ```
   click: [data-menu-key="users"]
   wait_for: { selector: ".user-list" }
   
   click: [data-menu-key="roles"]
   wait_for: { selector: ".role-list" }
   
   click: [data-menu-key="settings"]
   wait_for: { selector: ".settings-form" }
   ```

2. 验证标签页显示
   ```
   take_screenshot
   evaluate_script: `
     const tabs = document.querySelectorAll('.ant-tabs-tab');
     return {
       count: tabs.length,
       titles: Array.from(tabs).map(t => t.textContent.trim())
     };
   `
   ```

3. 测试标签页切换
   ```
   click: '.ant-tabs-tab:nth-child(2)'
   wait_for: { selector: ".user-list", timeout: 3000 }
   take_screenshot
   ```

4. 测试标签页关闭
   ```
   click: '.ant-tabs-tab .ant-tabs-tab-remove'
   wait_for: { timeout: 1000 }
   evaluate_script: `
     const tabs = document.querySelectorAll('.ant-tabs-tab');
     return tabs.length;
   `
   ```

5. 性能测试
   ```
   performance_start_trace
   click: '.ant-tabs-tab:nth-child(1)'
   performance_stop_trace
   performance_analyze_insight
   ```

【测试通过标准】:
✅ 标签页正常添加/切换/关闭
✅ 页面切换流畅 (< 300ms)
✅ 无内存泄漏
✅ 无控制台错误
```

### 3.4 主题切换测试

```markdown
【测试场景】：主题切换

【MCP 测试步骤】:

1. 打开设置面板
   ```
   click: .settings-trigger
   wait_for: { selector: ".ant-drawer-content" }
   ```

2. 测试亮色/暗色切换
   ```
   # 切换到暗色
   click: button[aria-label*="暗色"]
   wait_for: { timeout: 500 }
   
   evaluate_script: `
     return {
       isDark: document.documentElement.classList.contains('dark'),
       bgColor: getComputedStyle(document.body).backgroundColor
     };
   `
   
   take_screenshot
   
   # 切换到亮色
   click: button[aria-label*="亮色"]
   wait_for: { timeout: 500 }
   
   evaluate_script: `
     return {
       isDark: document.documentElement.classList.contains('dark'),
       bgColor: getComputedStyle(document.body).backgroundColor
     };
   `
   
   take_screenshot
   ```

3. 验证持久化
   ```
   evaluate_script: `
     const theme = localStorage.getItem('settings-storage');
     return JSON.parse(theme)?.state?.theme;
   `
   ```

4. 性能分析
   ```
   performance_start_trace
   click: button[aria-label*="暗色"]
   click: button[aria-label*="亮色"]
   performance_stop_trace
   performance_analyze_insight
   ```

【测试通过标准】:
✅ 主题切换立即生效
✅ 无白屏闪烁
✅ 主题持久化正常
✅ 切换流畅 (< 100ms)
```

---

## 四、自动化测试脚本

### 4.1 完整测试流程

```yaml
# test-flow.yaml
name: 后台管理前端完整测试
steps:
  - name: 启动浏览器
    action: new_page
    params:
      url: http://localhost:5173
  
  - name: 测试登录
    action: test_login
    params:
      account: admin
      password: Admin123
  
  - name: 测试导航
    action: test_navigation
    params:
      menus:
        - users
        - roles
        - dicts
  
  - name: 测试标签页
    action: test_tabs
    params:
      openCount: 3
  
  - name: 测试主题切换
    action: test_theme_switch
  
  - name: 性能测试
    action: performance_test
  
  - name: 生成报告
    action: generate_report
```

### 4.2 使用 Claude Code 执行

```bash
# 在 Claude Code 中
claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest

# 然后输入测试指令
"使用 Chrome MCP 测试后台管理前端，包括：
1. 登录功能测试
2. 标签页功能测试
3. 主题切换测试
4. 性能分析
5. 生成测试报告"
```

---

## 五、测试报告模板

```markdown
# Chrome MCP 测试报告

**测试日期**: 2026-03-28
**测试人**: [姓名]
**测试范围**: [功能名称]

## 测试环境
- 前端：http://localhost:5173
- 后端：http://localhost:3000
- Chrome DevTools MCP: v1.0.0
- Chrome: v144.0

## 测试工具使用
- navigate_page: ✅
- click: ✅
- fill_form: ✅
- wait_for: ✅
- take_screenshot: ✅
- list_network_requests: ✅
- evaluate_script: ✅
- list_console_messages: ✅
- performance_start_trace: ✅
- performance_analyze_insight: ✅

## 测试结果

### 功能测试
- [ ] 功能 1: [描述] ✅/❌
- [ ] 功能 2: [描述] ✅/❌

### 性能测试
- 页面加载时间：[X]ms (目标：< 2000ms)
- 标签页切换：[X]ms (目标：< 300ms)
- 主题切换：[X]ms (目标：< 100ms)

### 网络请求
- 总请求数：[X]
- 失败请求：[X]
- 平均响应时间：[X]ms

### 控制台错误
- 错误数：[X]
- 警告数：[X]
- 详情：[列出错误]

## 问题记录
[记录发现的问题及截图]

## 测试结论
✅ 通过测试，可以提交代码
❌ 未通过测试，需要修复

## 附件
- [截图 1](screenshot-1.png)
- [截图 2](screenshot-2.png)
- [性能报告](performance-report.json)
```

---

## 六、常见问题

### Q1: Chrome DevTools MCP 无法启动浏览器

**原因**: Chrome 未安装或版本过旧

**解决**:
```bash
# 更新 Chrome 到最新版
# 或指定 Chrome 路径
npx chrome-devtools-mcp@latest --executable-path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

### Q2: 连接失败

**原因**: 端口冲突或权限问题

**解决**:
```bash
# 使用 headless 模式
npx chrome-devtools-mcp@latest --headless

# 或连接到已有 Chrome 实例
npx chrome-devtools-mcp@latest --browser-url=http://127.0.0.1:9222
```

### Q3: 测试超时

**原因**: 页面加载慢或元素未找到

**解决**:
```javascript
// 增加超时时间
wait_for: { selector: '.element', timeout: 10000 }

// 或使用更精确的选择器
click: 'button[type="submit"].ant-btn-primary'
```

---

## 七、最佳实践

### 1. 使用 Slim 模式

如果只需要基本功能，使用 slim 模式更快：

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest", "--slim", "--headless"]
    }
  }
}
```

### 2. 自动等待

Chrome MCP 会自动等待操作完成，无需手动 sleep：

```javascript
// ✅ 正确
click: '.btn'
wait_for: { selector: '.result' }

// ❌ 不需要
click: '.btn'
sleep: 2000
```

### 3. 错误处理

```javascript
try {
  click: '.element'
} catch (error) {
  console.error('元素未找到:', error);
  take_screenshot;
}
```

### 4. 性能优化

```javascript
// 开始性能追踪
performance_start_trace

// 执行操作
click: '.btn'
wait_for: { selector: '.result' }

// 停止并分析
performance_stop_trace
performance_analyze_insight
```

---

## 八、参考资料

- [Chrome DevTools MCP GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Tool Reference](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md)
- [Slim Tool Reference](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/slim-tool-reference.md)
- [Troubleshooting Guide](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/troubleshooting.md)

---

**维护者**: 小虾米  
**最后更新**: 2026-03-28  
**基于版本**: Chrome DevTools MCP v1.0.0
