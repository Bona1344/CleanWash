import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, email, name, role, intent, phone, address, age, description } = body;

    // Normalize role to match database ENUM format
    const normalizedRole = role === "shop_owner" ? "SHOP_OWNER" : "CUSTOMER";

    // ... (rest of validation)

    const user = await prisma.user.upsert({
      where: { id: uid },
      update: {
        email,
        name,
        role: normalizedRole,
        phone,
        address,
        age: age ? parseInt(age) : null,
        description,
      },
      create: {
        id: uid,
        email,
        name,
        role: normalizedRole,
        phone,
        address,
        age: age ? parseInt(age) : null,
        description,
      },
      include: {
        shop: {
          select: { id: true }
        }
      }
    });

    return NextResponse.json({ ...user, hasShop: !!user.shop });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
