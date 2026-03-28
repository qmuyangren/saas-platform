const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log('📊 检查数据库表...');
    
    // 尝试创建测试账号（如果表存在）
    const existing = await prisma.$queryRaw`
      SELECT * FROM BaseUser WHERE account = 'admin' LIMIT 1
    `;

    if (existing && existing.length > 0) {
      console.log('✅ 测试账号已存在');
      console.log('   账号：admin');
      console.log('   密码：Admin123');
      return;
    }

    // 如果表不存在，会抛出错误
    console.log('⚠️  数据库表未创建，请先运行迁移');
    console.log('   命令：pnpm prisma migrate dev --name init');
    
  } catch (error) {
    if (error.message.includes('BaseUser')) {
      console.log('❌ 数据库表不存在');
      console.log('   请先运行：pnpm prisma migrate dev --name init');
      console.log('   或使用 SQL 手动创建表');
    } else {
      console.log('✅ 数据库连接正常');
      console.log('   错误:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
