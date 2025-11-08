/**
 * Admin Orders API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get all orders
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);

    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = sql`
      SELECT 
        o.id, o.order_id, o.customer_name, o.customer_email, o.customer_phone,
        o.total, o.order_status, o.payment_status, o.created_at,
        json_agg(
          json_build_object(
            'sku', oi.sku,
            'name', oi.name,
            'price', oi.price,
            'quantity', oi.quantity
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      WHERE 1=1
    `;

    if (status && status !== 'all') {
      query = sql`${query} AND o.order_status = ${status}`;
    }

    query = sql`${query} GROUP BY o.id, o.order_id, o.customer_name, o.customer_email, o.customer_phone, o.total, o.order_status, o.payment_status, o.created_at ORDER BY o.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

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

    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

