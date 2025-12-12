import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch services for a specific user (shop owner) or shopId
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid"); // Firebase User ID
  const shopId = searchParams.get("shopId");

  try {
    let targetShopId = shopId;

    // If uid provided, find the shop owned by this user
    if (uid && !shopId) {
      const shop = await prisma.shop.findUnique({
        where: { ownerId: uid },
      });
      if (!shop) {
        return NextResponse.json({ services: [] }); // User has no shop yet
      }
      targetShopId = shop.id;
    }

    if (!targetShopId) {
      return NextResponse.json({ error: "Missing uid or shopId" }, { status: 400 });
    }

    const services = await prisma.service.findMany({
      where: { shopId: targetShopId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Add a new service
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, name, price, category } = body;

    if (!uid || !name || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Find the Shop owned by this user
    const shop = await prisma.shop.findUnique({
      where: { ownerId: uid },
    });

    if (!shop) {
      // Auto-create a shop if one doesn't exist (for easier testing)
      // ENSURE THE USER EXISTS FIRST (Foreign Key Requirement)
      await prisma.user.upsert({
        where: { id: uid },
        update: {},
        create: {
          id: uid,
          email: "test@example.com", // Dummy email for mock user
          name: "Test User",
          role: "SHOP_OWNER"
        }
      });

      const newShop = await prisma.shop.create({
        data: {
          ownerId: uid,
          name: "My Laundry Shop", // Default name
          address: "123 Main St", // Placeholder
        }
      });
      
      const service = await prisma.service.create({
        data: {
          shopId: newShop.id,
          name,
          category: category || "General",
          price: parseFloat(price),
        },
      });
      return NextResponse.json(service);
    }

    // 2. Create Service
    const service = await prisma.service.create({
      data: {
        shopId: shop.id,
        name,
        category: category || "General",
        price: parseFloat(price),
      },
    });

    return NextResponse.json(service);

  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
