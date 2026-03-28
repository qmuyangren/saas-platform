const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🔍 检查测试账号...');
    
    const existing = await prisma.baseUser.findFirst({
      where: { account: 'admin' },
    });

    if (existing) {
      console.log('✅ 测试账号已存在');
      console.log('   账号：admin');
      console.log('   密码：Admin123');
      return;
    }

    console.log('🔐 创建测试账号...');
    const hashedPassword = await bcrypt.hash('Admin123', 10);
    
    const user = await prisma.baseUser.create({
      data: {
        account: 'admin',
        password: hashedPassword,
      },
    });

    console.log('✅ 测试账号创建成功!');
    console.log('   账号：admin');
    console.log('   密码：Admin123');
    console.log('   ID:', user.id);
  } catch (error) {
    console.error('❌ 创建失败:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
