const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log("🔄 Attempting to connect to database...");
  console.log("📝 Connection String (masked):", process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@') : "UNDEFINED");

  try {
    const start = Date.now();
    // Try a simple query
    const count = await prisma.user.count();
    const duration = Date.now() - start;
    
    console.log(`✅ Success! Connected and counted ${count} users in ${duration}ms.`);
  } catch (e) {
    console.error("❌ Connection Failed!");
    console.error("Error Code:", e.code);
    console.error("Message:", e.message);
    
    if (e.message.includes("Can't reach database server")) {
      console.log("\n⚠️  DIAGNOSIS: Your internet is blocking Port 5432.");
      console.log("   This is common on School/Work WiFi or some mobile hotspots.");
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
