// using native fetch

async function testOrder() {
  const baseUrl = "http://localhost:3000";

  console.log("1. Fetching Shops...");
  const shopsRes = await fetch(`${baseUrl}/api/shops`);
  if (!shopsRes.ok) {
    console.error("Failed to fetch shops:", await shopsRes.text());
    return;
  }
  const shops = await shopsRes.json();
  if (shops.length === 0) {
    console.error("No shops found! Create a shop first.");
    return;
  }
  
  const shopId = shops[0].id;
  console.log(`   Found Shop: ${shopId} (${shops[0].name})`);

  console.log("\n2. Placing Order...");
  const payload = {
    customerId: "test-customer-456",
    shopId: shopId,
    totalAmount: 1500,
    items: { "some-service-id": 2 }
  };

  const orderRes = await fetch(`${baseUrl}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (orderRes.ok) {
    const order = await orderRes.json();
    console.log("✅ Order Success:", order);
  } else {
    console.error("❌ Order Failed:", orderRes.status, await orderRes.text());
  }
}

testOrder();
