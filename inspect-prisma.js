const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('Available models:', Object.keys(prisma).filter(key => key.match(/^[a-z]/)));

async function main() {
  await prisma.$disconnect();
}
main();
