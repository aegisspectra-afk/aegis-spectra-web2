/**
 * Admin Payment Refund API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// POST - Process refund
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const { amount, reason } = body;

    // Get payment
    const [payment] = await sql`
      SELECT * FROM payments WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!payment) {
      return NextResponse.json(
        { ok: false, error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (payment.status !== 'completed') {
      return NextResponse.json(
        { ok: false, error: 'Only completed payments can be refunded' },
        { status: 400 }
      );
    }

    const refundAmount = amount || payment.amount;

    // Update payment status
    const [updatedPayment] = await sql`
      UPDATE payments
      SET 
        status = 'refunded',
        refund_amount = ${refundAmount},
        refund_reason = ${reason || null},
        refunded_at = NOW(),
        updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `.catch(() => []);

    if (!updatedPayment) {
      return NextResponse.json(
        { ok: false, error: 'Failed to process refund' },
        { status: 500 }
      );
    }

    // Create audit log
    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.ORDER_UPDATED,
      'payment',
      id,
      { action: 'refund', amount: refundAmount },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      payment: updatedPayment,
      message: 'Refund processed successfully',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error processing refund:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to process refund' },
      { status: 500 }
    );
  }
}

