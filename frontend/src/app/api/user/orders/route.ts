/**
 * User Orders API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for user orders');
  sql = null;
}

// GET - Get user orders
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    // If no database, return empty orders
    if (!sql) {
      console.log('Database not available, using fallback orders');
      return NextResponse.json({
        ok: true,
        orders: [],
      });
    }

    try {
      const orders = await sql`
        SELECT order_id, total, order_status as status, created_at, items
        FROM orders
        WHERE customer_email = ${user.email} OR user_id = ${user.id}
        ORDER BY created_at DESC
        LIMIT 50
      `.catch(() => []);

      return NextResponse.json({
        ok: true,
        orders: orders.map((o: any) => ({
          ...o,
          items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items || []
        })),
      });
    } catch (dbError: any) {
      console.error('Database error fetching orders:', dbError);
      return NextResponse.json({
        ok: true,
        orders: [],
      });
    }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

