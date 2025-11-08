/**
 * Admin Recurring Order API - Update specific recurring order
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// PATCH - Update recurring order
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const [currentOrder] = await sql`
      SELECT * FROM recurring_orders WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!currentOrder) {
      return NextResponse.json(
        { ok: false, error: 'Recurring order not found' },
        { status: 404 }
      );
    }

    const { status, frequency, next_order_date } = body;

    const [updatedOrder] = await sql`
      UPDATE recurring_orders
      SET 
        status = COALESCE(${status || null}, status),
        frequency = COALESCE(${frequency || null}, frequency),
        next_order_date = COALESCE(${next_order_date ? new Date(next_order_date).toISOString() : null}, next_order_date),
        updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `.catch(() => []);

    if (!updatedOrder) {
      return NextResponse.json(
        { ok: false, error: 'Failed to update recurring order' },
        { status: 500 }
      );
    }

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.ORDER_UPDATED,
      'recurring_order',
      id,
      { changes: Object.keys(body) },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      order: updatedOrder,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error updating recurring order:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update recurring order' },
      { status: 500 }
    );
  }
}

