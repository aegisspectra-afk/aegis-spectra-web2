import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@netlify/neon';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for public coupons');
  sql = null;
}

export const dynamic = 'force-dynamic';

// GET - Get public coupons
export async function GET(request: NextRequest) {
  try {
    // If no database, return empty coupons
    if (!sql) {
      console.log('Database not available, using fallback public coupons');
      return NextResponse.json({
        ok: true,
        coupons: [],
      });
    }

    try {
      const coupons = await sql`
        SELECT id, code, discount_type, discount_value, min_purchase, max_discount, 
               valid_until, status, used_count, usage_limit
        FROM loyalty_coupons
        WHERE status = 'active' 
          AND (user_id IS NULL AND user_email IS NULL)
          AND (valid_until IS NULL OR valid_until > NOW())
          AND (usage_limit IS NULL OR used_count < usage_limit)
        ORDER BY created_at DESC
        LIMIT 20
      `.catch(() => []);

      return NextResponse.json({
        ok: true,
        coupons: coupons.map((c: any) => ({
          id: c.id,
          code: c.code,
          discount_type: c.discount_type,
          discount_value: c.discount_value,
          min_purchase: c.min_purchase,
          max_discount: c.max_discount,
          valid_until: c.valid_until,
          status: c.status,
          used_count: c.used_count,
          usage_limit: c.usage_limit,
        })),
      });
    } catch (dbError: any) {
      console.error('Database error fetching public coupons:', dbError);
      return NextResponse.json({
        ok: true,
        coupons: [],
      });
    }
  } catch (error: any) {
    console.error('Error fetching public coupons:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch public coupons' },
      { status: 500 }
    );
  }
}

