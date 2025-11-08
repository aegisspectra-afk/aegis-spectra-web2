/**
 * Admin Order Status API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// PATCH - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Get current order
    const [currentOrder] = await sql`
      SELECT order_status FROM orders WHERE order_id = ${id} LIMIT 1
    `.catch(() => []);

    if (!currentOrder) {
      return NextResponse.json(
        { ok: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order status
    await sql`
      UPDATE orders
      SET order_status = ${status}, updated_at = NOW()
      WHERE order_id = ${id}
    `;

    // Create audit log
    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.ORDER_STATUS_CHANGED,
      'order',
      id,
      { oldStatus: currentOrder.order_status, newStatus: status },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      message: 'Order status updated successfully',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error updating order status:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}

