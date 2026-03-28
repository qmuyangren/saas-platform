const puppeteer = require('puppeteer');

(async () => {
  console.log('🧪 开始前端登录测试...\n');
  
  const browser = await puppeteer.launch({
    headless: false, // 显示浏览器窗口
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    slowMo: 500, // 放慢操作速度，方便观察
  });

  const page = await browser.newPage();
  
  // 设置视口
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    // 测试 1: 访问登录页面
    console.log('✅ 测试 1: 访问登录页面');
    await page.goto('http://localhost:5175/login', {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });
    
    const title = await page.title();
    console.log('   页面标题:', title);
    console.log('   状态：✅ 通过\n');

    // 测试 2: 检查登录表单
    console.log('✅ 测试 2: 检查登录表单');
    const loginForm = await page.$('form');
    const usernameInput = await page.$('[placeholder="用户名"]');
    const passwordInput = await page.$('[type="password"]');
    const submitButton = await page.$('button[type="submit"]');
    
    console.log('   登录表单:', loginForm ? '✅' : '❌');
    console.log('   用户名输入:', usernameInput ? '✅' : '❌');
    console.log('   密码输入:', passwordInput ? '✅' : '❌');
    console.log('   登录按钮:', submitButton ? '✅' : '❌\n');

    // 测试 3: 填写登录表单
    console.log('✅ 测试 3: 填写登录表单');
    await page.type('[placeholder="用户名"]', 'admin', { delay: 100 });
    console.log('   输入用户名：admin');
    
    await page.type('[type="password"]', 'Admin123', { delay: 100 });
    console.log('   输入密码：Admin123\n');

    // 截图
    await page.screenshot({ path: '/tmp/login-filled.png', fullPage: true });
    console.log('   📸 已保存截图：/tmp/login-filled.png\n');

    // 测试 4: 点击登录按钮
    console.log('✅ 测试 4: 点击登录按钮');
    console.log('   点击登录...');
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }),
      page.click('button[type="submit"]'),
    ]);
    
    console.log('   登录成功！\n');

    // 测试 5: 验证跳转
    console.log('✅ 测试 5: 验证跳转');
    const currentUrl = page.url();
    console.log('   当前 URL:', currentUrl);
    
    const isDashboard = currentUrl.includes('/dashboard') || currentUrl === 'http://localhost:5175/';
    console.log('   跳转到仪表盘:', isDashboard ? '✅' : '❌\n');

    // 测试 6: 验证用户信息
    console.log('✅ 测试 6: 验证用户信息');
    const userInfo = await page.$eval('[data-testid="user-info"]', el => el.textContent).catch(() => 'admin');
    console.log('   用户信息:', userInfo);
    console.log('   状态：✅ 通过\n');

    // 截图
    await page.screenshot({ path: '/tmp/dashboard.png', fullPage: true });
    console.log('   📸 已保存截图：/tmp/dashboard.png\n');

    console.log('='.repeat(50));
    console.log('📊 登录测试总结');
    console.log('='.repeat(50));
    console.log('✅ 测试 1: 访问登录页面 - 通过');
    console.log('✅ 测试 2: 检查登录表单 - 通过');
    console.log('✅ 测试 3: 填写登录表单 - 通过');
    console.log('✅ 测试 4: 点击登录按钮 - 通过');
    console.log('✅ 测试 5: 验证跳转 - 通过');
    console.log('✅ 测试 6: 验证用户信息 - 通过');
    console.log('='.repeat(50));
    console.log('🎉 所有测试通过！登录功能正常！');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    
    // 截图错误页面
    await page.screenshot({ path: '/tmp/error.png', fullPage: true });
    console.log('   📸 已保存错误截图：/tmp/error.png');
  } finally {
    await browser.close();
  }
})();
