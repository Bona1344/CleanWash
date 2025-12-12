import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Find the most recent unverified OTP for this email
    const otpRecord = await prisma.emailOTP.findFirst({
      where: {
        email: email.toLowerCase(),
        otp: otp,
        verified: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid OTP code. Please check and try again.' },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    await prisma.emailOTP.update({
      where: {
        id: otpRecord.id,
      },
      data: {
        verified: true,
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'OTP verified successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP. Please try again.' },
      { status: 500 }
    );
  }
}
