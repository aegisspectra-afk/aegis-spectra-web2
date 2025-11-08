/**
 * User Orders API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get user orders
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const orders = await sql`
      SELECT order_id, total, status, created_at
      FROM orders
      WHERE customer_email = ${user.email}
      ORDER BY created_at DESC
      LIMIT 50
    `.catch(() => []);

    return NextResponse.json({
      ok: true,
      orders,
    });
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

