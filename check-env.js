const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log("Raw file content length:", envContent.length);
  
  const match = envContent.match(/DATABASE_URL=(.*)$/m);
  
  if (!match) {
    console.log("❌ DATABASE_URL not found.");
    process.exit(1);
  }

  let urlString = match[1].trim(); // Trim whitespace from capture
  // Remove quotes if present
  if ((urlString.startsWith('"') && urlString.endsWith('"')) || (urlString.startsWith("'") && urlString.endsWith("'"))) {
    urlString = urlString.slice(1, -1);
  }

  console.log(`\n🔍 Debugging URL Start: "${urlString.substring(0, 15)}..."`);
  
  try {
    const url = new URL(urlString);
    console.log("✅ URL parsed successfully!");
    console.log("Protocol:", url.protocol);
    console.log("Host:", url.hostname);
    console.log("Port:", url.port);
  } catch (e) {
    console.log("❌ Parse Error:", e.message);
    if (urlString.includes(" ")) console.log("⚠️ WARNING: URL contains spaces!");
    if (!urlString.includes("://")) console.log("⚠️ WARNING: Missing '://'");
  }

} catch (err) {
  console.log("Error reading file:", err.message);
}
