import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      );
    }

    // TODO: Implement proper token validation
    // For now, we'll just check if the token exists and is not expired
    // In a real implementation, you would:
    // 1. Store reset tokens in a separate table with expiry
    // 2. Validate the token against the database
    // 3. Check if the token has expired

    // For now, we'll simulate token validation
    // In production, you should implement proper token storage and validation
    const isValidToken = token.length === 64; // Basic validation for demo

    if (!isValidToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Token is valid',
    });

  } catch (error: any) {
    console.error('Token validation error:', error);

    return NextResponse.json(
      { error: 'Failed to validate reset token' },
      { status: 500 }
    );
  }
}