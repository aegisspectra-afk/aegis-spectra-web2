/**
 * Promotions API - Manage coupons and discounts
 */
import { NextRequest, NextResponse } from 'next/server';

export interface Promotion {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  validFrom?: string;
  validTo?: string;
  applicablePackageSlugs?: string[];
  usageLimit?: number;
  usageCount: number;
  enabled: boolean;
  createdAt: string;
}

// GET: List promotions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const enabled = searchParams.get('enabled');

    // TODO: Load from database
    const promotions: Promotion[] = [];

    let filtered = promotions;

    if (code) {
      filtered = filtered.filter(p => p.code === code);
    }

    if (enabled !== null) {
      filtered = filtered.filter(p => p.enabled === (enabled === 'true'));
    }

    return NextResponse.json({
      success: true,
      data: filtered,
    });
  } catch (error: any) {
    console.error('Promotions GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch promotions' },
      { status: 500 }
    );
  }
}

// POST: Create promotion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const promotion: Omit<Promotion, 'id' | 'usageCount' | 'createdAt'> = body;

    if (!promotion.code || !promotion.type || !promotion.value) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Save to database
    const newPromotion: Promotion = {
      ...promotion,
      id: `promo_${Date.now()}`,
      usageCount: 0,
      enabled: promotion.enabled !== false,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newPromotion,
    });
  } catch (error: any) {
    console.error('Promotions POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create promotion' },
      { status: 500 }
    );
  }
}

