const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log("Raw file content length:", envContent.length);
  
  const keys = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ];

  keys.forEach(key => {
    const regex = new RegExp(`${key}=(.*)$`, "m");
    const match = envContent.match(regex);
    if (match) {
      const val = match[1].trim().replace(/['"]/g, '');
      console.log(`✅ ${key}: Found (${val.substring(0, 5)}...)`);
    } else {
      console.log(`❌ ${key}: MISSING`);
    }
  });



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
