
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    const shopCount = await prisma.shop.count();
    console.log(`🏪 Total Shops in DB: ${shopCount}`);
    
    if (shopCount > 0) {
      const shops = await prisma.shop.findMany({ select: { id: true, name: true, ownerId: true } });
      console.log("📝 Sample Shops:", shops);
    } else {
      console.log("❌ No shops found. Did you create them with a different user?");
    }
  } catch (e) {
    console.error("❌ DB Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
