import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch orders for a shop OR a customer
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const shopId = searchParams.get("shopId");
  const customerId = searchParams.get("customerId");

  if (!shopId && !customerId) {
      return NextResponse.json({ error: "Shop ID or Customer ID required" }, { status: 400 });
  }

  const where = shopId ? { shopId } : { customerId };

  try {
    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: { name: true, email: true }
        },
        shop: {
          include: {
            services: true
          }
        }
      },
      take: 20
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerId, shopId, totalAmount, items, customerEmail, customerName } = body;

    if (!customerId || !shopId || !totalAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ensure customer exists in database
    await prisma.user.upsert({
        where: { id: customerId },
        update: {},
        create: {
            id: customerId,
            email: customerEmail || "customer@cleanmatch.com",
            name: customerName || "Customer",
            role: "CUSTOMER"
        }
    });

    const order = await prisma.order.create({
      data: {
        customerId,
        shopId,
        totalAmount: parseFloat(totalAmount),
        status: "PENDING",
        items: items || {},
      },
    });

    return NextResponse.json(order);

  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
