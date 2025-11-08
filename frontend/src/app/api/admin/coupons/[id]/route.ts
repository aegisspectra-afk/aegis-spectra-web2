/**
 * Admin Coupon API - Get, Update, Delete specific coupon
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get coupon by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const [coupon] = await sql`
      SELECT * FROM loyalty_coupons WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!coupon) {
      return NextResponse.json(
        { ok: false, error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      coupon,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching coupon:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch coupon' },
      { status: 500 }
    );
  }
}

// PATCH - Update coupon
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    // Get current coupon
    const [currentCoupon] = await sql`
      SELECT * FROM loyalty_coupons WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!currentCoupon) {
      return NextResponse.json(
        { ok: false, error: 'Coupon not found' },
        { status: 404 }
      );
    }

    const {
      code,
      discount_type,
      discount_value,
      min_purchase,
      max_discount,
      usage_limit,
      valid_from,
      valid_until,
      user_email,
      active,
    } = body;

    // Get user_id if user_email provided
    let userId = currentCoupon.user_id;
    if (user_email !== undefined) {
      if (user_email) {
        const [user] = await sql`
          SELECT id FROM users WHERE email = ${user_email} LIMIT 1
        `.catch(() => []);
        userId = user ? user.id : null;
      } else {
        userId = null;
      }
    }

    // Update coupon
    const [updatedCoupon] = await sql`
      UPDATE loyalty_coupons
      SET 
        code = COALESCE(${code || null}, code),
        user_id = ${userId !== undefined ? userId : currentCoupon.user_id},
        user_email = COALESCE(${user_email !== undefined ? user_email : null}, user_email),
        discount_type = COALESCE(${discount_type || null}, discount_type),
        discount_value = COALESCE(${discount_value !== undefined ? discount_value : null}, discount_value),
        min_purchase = COALESCE(${min_purchase !== undefined ? min_purchase : null}, min_purchase),
        max_discount = COALESCE(${max_discount !== undefined ? max_discount : null}, max_discount),
        usage_limit = COALESCE(${usage_limit !== undefined ? usage_limit : null}, usage_limit),
        valid_from = COALESCE(${valid_from || null}, valid_from),
        valid_until = COALESCE(${valid_until || null}, valid_until),
        active = COALESCE(${active !== undefined ? active : null}, active),
        updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `.catch(() => []);

    if (!updatedCoupon) {
      return NextResponse.json(
        { ok: false, error: 'Failed to update coupon' },
        { status: 500 }
      );
    }

    // Create audit log
    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.COUPON_UPDATED,
      'coupon',
      id,
      { changes: Object.keys(body) },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      coupon: updatedCoupon,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

// DELETE - Delete coupon
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;

    // Delete coupon
    await sql`
      DELETE FROM loyalty_coupons WHERE id = ${parseInt(id)}
    `.catch(() => {
      throw new Error('Failed to delete coupon');
    });

    // Create audit log
    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.COUPON_DELETED,
      'coupon',
      id,
      {},
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}

