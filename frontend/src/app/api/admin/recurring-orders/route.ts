/**
 * Admin Recurring Orders API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get all recurring orders
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    const frequency = searchParams.get('frequency');

    let query = sql`
      SELECT 
        ro.*,
        o.customer_name,
        o.customer_email,
        o.total
      FROM recurring_orders ro
      LEFT JOIN orders o ON ro.order_id = o.order_id
      WHERE 1=1
    `;

    if (status && status !== 'all') {
      query = sql`${query} AND ro.status = ${status}`;
    }

    if (frequency && frequency !== 'all') {
      query = sql`${query} AND ro.frequency = ${frequency}`;
    }

    query = sql`${query} ORDER BY ro.next_order_date ASC LIMIT 100`;

    const orders = await query.catch(() => []);

    return NextResponse.json({
      ok: true,
      orders,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching recurring orders:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch recurring orders' },
      { status: 500 }
    );
  }
}

