/**
 * Quote Draft API Endpoint - Save/load quote drafts
 */
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packageSlug, options, propertyDetails, packageSnapshot } = body;

    if (!packageSlug) {
      return NextResponse.json(
        { success: false, error: 'Package slug is required' },
        { status: 400 }
      );
    }

    // TODO: Store in database (quotes table with status='draft')
    // For now, generate a draft ID
    const draftId = `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // In production, you would:
    // 1. Store draft in database
    // 2. Return draft ID
    // 3. Set expiry (e.g., 7 days)

    return NextResponse.json({
      success: true,
      draftId,
      message: 'Draft saved',
    });
  } catch (error: any) {
    console.error('Save draft error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save draft' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const draftId = searchParams.get('id');

    if (!draftId) {
      return NextResponse.json(
        { success: false, error: 'Draft ID is required' },
        { status: 400 }
      );
    }

    // TODO: Load from database
    // For now, return error
    return NextResponse.json(
      { success: false, error: 'Draft not found' },
      { status: 404 }
    );
  } catch (error: any) {
    console.error('Load draft error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to load draft' },
      { status: 500 }
    );
  }
}

