const https = require('https');

function testUrl(hostname) {
    console.log(`Testing connection to: ${hostname}...`);
    const options = {
        hostname: hostname,
        port: 443,
        method: 'HEAD',
        timeout: 5000
    };
    
    const req = https.request(options, res => {
        console.log(`✅ ${hostname}: REACHABLE (Status: ${res.statusCode})`);
    });
    
    req.on('error', error => {
        console.error(`❌ ${hostname}: UNREACHABLE - ${error.message}`);
    });
    
    req.on('timeout', () => {
        req.destroy();
        console.error(`❌ ${hostname}: TIMEOUT`);
    });
    
    req.end();
}

console.log("Starting Network Diagnostics...");
testUrl('cleanmatch-e0851.firebaseapp.com'); // Auth Domain
testUrl('identitytoolkit.googleapis.com');   // Auth API
testUrl('firestore.googleapis.com');         // Database API
