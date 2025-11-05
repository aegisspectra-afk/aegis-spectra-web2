/**
 * Quote Share API - Public preview of quote via share token
 */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; token: string } }
) {
  try {
    const { id, token } = params;

    // TODO: Load quote from database
    // TODO: Verify share token matches
    // TODO: Check token expiry
    // TODO: Return quote data (read-only)

    // Mock response
    return NextResponse.json({
      success: true,
      data: {
        id,
        shareToken: token,
        quote: {},
        readOnly: true,
      },
    });
  } catch (error: any) {
    console.error('Quote share error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to load shared quote' },
      { status: 500 }
    );
  }
}

