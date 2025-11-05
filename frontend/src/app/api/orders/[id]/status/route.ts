import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aegis2024';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const providedPassword = authHeader?.replace('Bearer ', '');
  return providedPassword === ADMIN_PASSWORD;
}

// PATCH - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);
    const body = await request.json();
    const { status, notes, created_by } = body;

    if (!status) {
      return NextResponse.json(
        { ok: false, error: 'status is required' },
        { status: 400 }
      );
    }

    // Check if order exists
    const [order] = await sql`
      SELECT * FROM orders WHERE id = ${orderId} LIMIT 1
    `;

    if (!order) {
      return NextResponse.json(
        { ok: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Use database function to update status
    const result = await sql`
      SELECT update_order_status(
        ${orderId},
        ${status},
        ${notes || null},
        ${created_by || 'admin'}
      ) as result
    `;

    const resultData = result[0]?.result;

    if (!resultData || !resultData.success) {
      return NextResponse.json(
        { ok: false, error: resultData?.error || 'Failed to update status' },
        { status: 400 }
      );
    }

    // Get updated order
    const [updatedOrder] = await sql`
      SELECT * FROM orders WHERE id = ${orderId} LIMIT 1
    `;

    // Get status history
    const statusHistory = await sql`
      SELECT * FROM order_status_history
      WHERE order_id = ${orderId}
      ORDER BY created_at DESC
      LIMIT 10
    `;

    return NextResponse.json({
      ok: true,
      order: updatedOrder,
      status_history: statusHistory,
      change: {
        old_status: resultData.old_status,
        new_status: resultData.new_status
      }
    });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}

