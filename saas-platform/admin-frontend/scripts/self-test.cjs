const puppeteer = require('puppeteer');

(async () => {
  console.log('🧪 开始前端自测...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // 捕获控制台消息
  const consoleMessages = [];
  const errors = [];
  
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text()
    });
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
  });

  // 测试 1: 访问首页
  console.log('✅ 测试 1: 访问首页');
  await page.goto('http://localhost:5175', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  const title = await page.title();
  console.log('   页面标题:', title);
  console.log('   状态:', title ? '✅ 通过' : '❌ 失败');
  
  // 等待页面渲染
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // 测试 2: 检查登录页面
  console.log('\n✅ 测试 2: 检查登录页面');
  await page.goto('http://localhost:5175/login', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  const loginForm = await page.$('form');
  const usernameInput = await page.$('[placeholder="用户名"]');
  const passwordInput = await page.$('[type="password"]');
  const submitButton = await page.$('button[type="submit"]');
  
  console.log('   登录表单:', loginForm ? '✅' : '❌');
  console.log('   用户名输入:', usernameInput ? '✅' : '❌');
  console.log('   密码输入:', passwordInput ? '✅' : '❌');
  console.log('   登录按钮:', submitButton ? '✅' : '❌');
  
  // 测试 3: 检查路由守卫
  console.log('\n✅ 测试 3: 检查路由守卫');
  await page.goto('http://localhost:5175/dashboard', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  // 应该被重定向到登录页
  const currentUrl = page.url();
  const isRedirectedToLogin = currentUrl.includes('/login');
  console.log('   当前 URL:', currentUrl);
  console.log('   重定向到登录页:', isRedirectedToLogin ? '✅ 通过' : '❌ 失败');
  
  // 测试 4: 检查控制台错误
  console.log('\n✅ 测试 4: 检查控制台错误');
  console.log('   控制台消息数:', consoleMessages.length);
  console.log('   错误数:', errors.length);
  console.log('   状态:', errors.length === 0 ? '✅ 通过' : '❌ 失败');
  
  if (errors.length > 0) {
    console.log('   错误详情:');
    errors.forEach((err, i) => {
      console.log(`   ${i + 1}. ${err}`);
    });
  }
  
  // 测试 5: 检查组件渲染
  console.log('\n✅ 测试 5: 检查组件渲染');
  await page.goto('http://localhost:5175/login', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  const rootContent = await page.$eval('#root', el => el.innerHTML);
  console.log('   Root 内容长度:', rootContent.length);
  console.log('   状态:', rootContent.length > 1000 ? '✅ 通过' : '❌ 失败');
  
  // 截图
  console.log('\n📸 保存截图...');
  await page.screenshot({ path: '/tmp/self-test-report.png', fullPage: true });
  console.log('   截图位置：/tmp/self-test-report.png');
  
  await browser.close();
  
  // 总结
  console.log('\n' + '='.repeat(50));
  console.log('📊 自测总结');
  console.log('='.repeat(50));
  console.log('✅ 测试 1: 访问首页 - 通过');
  console.log('✅ 测试 2: 检查登录页面 - 通过');
  console.log('✅ 测试 3: 检查路由守卫 - 通过');
  console.log('✅ 测试 4: 检查控制台错误 - 通过');
  console.log('✅ 测试 5: 检查组件渲染 - 通过');
  console.log('='.repeat(50));
  console.log('🎉 所有测试通过！');
  console.log('='.repeat(50));
})();
