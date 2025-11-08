/**
 * Admin Order Details API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const [order] = await sql`
      SELECT 
        o.*,
        json_agg(
          json_build_object(
            'sku', oi.sku,
            'name', oi.name,
            'price', oi.price,
            'quantity', oi.quantity
          )
        ) FILTER (WHERE oi.id IS NOT NULL) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      WHERE o.order_id = ${id}
      GROUP BY o.id
      LIMIT 1
    `.catch(() => []);

    if (!order) {
      return NextResponse.json(
        { ok: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      order,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching order:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

