import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendOTPEmail } from '@/lib/resend';

const prisma = new PrismaClient();

// Generate random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Rate limiting: Check if user has requested too many OTPs recently
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOTPs = await prisma.emailOTP.count({
      where: {
        email: email.toLowerCase(),
        createdAt: {
          gte: oneHourAgo,
        },
      },
    });

    if (recentOTPs >= 3) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Invalidate any existing unverified OTPs for this email
    await prisma.emailOTP.updateMany({
      where: {
        email: email.toLowerCase(),
        verified: false,
      },
      data: {
        verified: true, // Mark as used so they can't be reused
      },
    });

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    await prisma.emailOTP.create({
      data: {
        email: email.toLowerCase(),
        otp,
        expiresAt,
      },
    });

    // Send OTP via email
    await sendOTPEmail(email, otp, name);

    return NextResponse.json(
      { 
        success: true, 
        message: 'OTP sent successfully',
        expiresIn: 600 // seconds
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    );
  }
}
