/**
 * Admin Payments API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get all payments
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const method = searchParams.get('method');

    let query = sql`
      SELECT 
        p.*,
        o.customer_name,
        o.customer_email
      FROM payments p
      LEFT JOIN orders o ON p.order_id = o.order_id
      WHERE 1=1
    `;

    if (status && status !== 'all') {
      query = sql`${query} AND p.status = ${status}`;
    }

    if (method && method !== 'all') {
      query = sql`${query} AND p.method = ${method}`;
    }

    query = sql`${query} ORDER BY p.created_at DESC LIMIT 100`;

    const payments = await query.catch(() => []);

    return NextResponse.json({
      ok: true,
      payments,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

