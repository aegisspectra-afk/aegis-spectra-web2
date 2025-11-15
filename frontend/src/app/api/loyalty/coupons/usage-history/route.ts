import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { neon } from '@netlify/neon';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for coupon usage history');
  sql = null;
}

export const dynamic = 'force-dynamic';

// GET - Get coupon usage history
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    // If no database, return empty history
    if (!sql) {
      console.log('Database not available, using fallback usage history');
      return NextResponse.json({
        ok: true,
        history: [],
      });
    }

    try {
      // Create coupon usage history table if not exists
      await sql`
        CREATE TABLE IF NOT EXISTS coupon_usage_history (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          user_email VARCHAR(255),
          coupon_code VARCHAR(255) NOT NULL,
          order_id VARCHAR(255),
          discount_amount INTEGER NOT NULL,
          used_at TIMESTAMP DEFAULT NOW()
        )
      `.catch(() => {});

      const history = await sql`
        SELECT id, coupon_code, order_id, discount_amount, used_at
        FROM coupon_usage_history
        WHERE user_id = ${user.id} OR user_email = ${user.email}
        ORDER BY used_at DESC
        LIMIT 50
      `.catch(() => []);

      return NextResponse.json({
        ok: true,
        history: history.map((h: any) => ({
          id: h.id.toString(),
          coupon_code: h.coupon_code,
          order_id: h.order_id,
          discount_amount: h.discount_amount,
          used_at: h.used_at,
        })),
      });
    } catch (dbError: any) {
      console.error('Database error fetching usage history:', dbError);
      return NextResponse.json({
        ok: true,
        history: [],
      });
    }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Error fetching usage history:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch usage history' },
      { status: 500 }
    );
  }
}

