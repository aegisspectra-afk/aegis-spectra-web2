/**
 * Admin Subscription API - Update specific subscription
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// PATCH - Update subscription
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const [currentSubscription] = await sql`
      SELECT * FROM subscriptions WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!currentSubscription) {
      return NextResponse.json(
        { ok: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    const { status, plan_name, price, billing_cycle, next_billing_date } = body;

    const [updatedSubscription] = await sql`
      UPDATE subscriptions
      SET 
        status = COALESCE(${status || null}, status),
        plan_name = COALESCE(${plan_name || null}, plan_name),
        price = COALESCE(${price !== undefined ? price : null}, price),
        billing_cycle = COALESCE(${billing_cycle || null}, billing_cycle),
        next_billing_date = COALESCE(${next_billing_date ? new Date(next_billing_date).toISOString() : null}, next_billing_date),
        updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `.catch(() => []);

    if (!updatedSubscription) {
      return NextResponse.json(
        { ok: false, error: 'Failed to update subscription' },
        { status: 500 }
      );
    }

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.ORDER_UPDATED,
      'subscription',
      id,
      { changes: Object.keys(body) },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      subscription: updatedSubscription,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

