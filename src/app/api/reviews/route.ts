import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerId, shopId, rating, comment } = body;

    if (!customerId || !shopId || !rating) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Verify rating range
    if (rating < 1 || rating > 5) {
        return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        customerId,
        shopId,
        rating,
        comment,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const shopId = searchParams.get("shopId");
        
        if (!shopId) {
             return NextResponse.json({ error: "Shop ID required" }, { status: 400 });
        }

        const reviews = await prisma.review.findMany({
            where: { shopId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(reviews);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}
