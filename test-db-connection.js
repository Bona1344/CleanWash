const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔌 Connecting to DB...');
  try {
    const userCount = await prisma.user.count();
    console.log('✅ Connected! User count:', userCount);
    
    // Check EmailOTP model
    const otpCount = await prisma.emailOTP.count();
    console.log('✅ EmailOTP table accessible. Count:', otpCount);
  } catch (e) {
    console.error('❌ DB Connection failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
