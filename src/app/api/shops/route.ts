import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    const where = uid ? { ownerId: uid } : {};

    const shops = await prisma.shop.findMany({
      where,
      include: {
        _count: {
          select: { services: true }
        },
        reviews: {
          select: { rating: true }
        }
      }
    });

    const shopsWithRating = shops.map(shop => {
        const totalRating = shop.reviews.reduce((acc, r) => acc + r.rating, 0);
        const avgRating = shop.reviews.length > 0 ? totalRating / shop.reviews.length : 0;
        const { reviews, ...rest } = shop; 
        return { ...rest, rating: avgRating, reviewCount: shop.reviews.length };
    });

    return NextResponse.json(shopsWithRating);
  } catch (error) {
    console.error("Error fetching shops:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, address, phone, email, ownerId } = body;

    if (!name || !address || !ownerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user exists first
    const user = await prisma.user.findUnique({
      where: { id: ownerId }
    });

    if (!user) {
      console.error("Owner not found:", ownerId);
      return NextResponse.json({ error: "User account not found. Please log out and sign up again." }, { status: 404 });
    }

    // Use a transaction to create/update shop AND update user role to ensure consistency
    const result = await prisma.$transaction(async (tx) => {
      // Use upsert to handle case where shop already exists (e.g. from previous failed attempt)
      const newShop = await tx.shop.upsert({
        where: { ownerId },
        create: {
          name,
          description: description || "",
          address,
          phone: phone || "",
          email: email || "",
          ownerId,
        },
        update: {
          name,
          description: description || "",
          address,
          phone: phone || "",
          email: email || "",
        }
      });

      // Ensure user has SHOP_OWNER role
      await tx.user.update({
        where: { id: ownerId },
        data: { role: "SHOP_OWNER" }
      });

      return newShop;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error creating shop:", error);
    // Return the actual error message for debugging
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
