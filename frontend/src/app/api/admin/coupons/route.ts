/**
 * Admin Coupons API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get all coupons
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);

    const { searchParams } = request.nextUrl;
    const active = searchParams.get('active');

    let query = sql`
      SELECT * FROM loyalty_coupons
      WHERE 1=1
    `;

    if (active === 'true') {
      query = sql`${query} AND active = true AND (valid_until IS NULL OR valid_until >= NOW())`;
    } else if (active === 'false') {
      query = sql`${query} AND (active = false OR (valid_until IS NOT NULL AND valid_until < NOW()))`;
    }

    query = sql`${query} ORDER BY created_at DESC`;

    const coupons = await query.catch(() => []);

    return NextResponse.json({
      ok: true,
      coupons,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

// POST - Create new coupon
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();

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

    if (!code || !discount_type || !discount_value) {
      return NextResponse.json(
        { ok: false, error: 'code, discount_type, and discount_value are required' },
        { status: 400 }
      );
    }

    // Check if code already exists
    const [existing] = await sql`
      SELECT id FROM loyalty_coupons WHERE code = ${code.toUpperCase()} LIMIT 1
    `.catch(() => []);

    if (existing) {
      return NextResponse.json(
        { ok: false, error: 'Coupon code already exists' },
        { status: 400 }
      );
    }

    // Get user_id if user_email provided
    let userId = null;
    if (user_email) {
      const [user] = await sql`
        SELECT id FROM users WHERE email = ${user_email} LIMIT 1
      `.catch(() => []);
      if (user) userId = user.id;
    }

    // Create coupon
    const [newCoupon] = await sql`
      INSERT INTO loyalty_coupons (
        code, user_id, user_email, discount_type, discount_value,
        min_purchase, max_discount, usage_limit, valid_from, valid_until,
        active, created_by
      )
      VALUES (
        ${code.toUpperCase()},
        ${userId},
        ${user_email || null},
        ${discount_type},
        ${discount_value},
        ${min_purchase || null},
        ${max_discount || null},
        ${usage_limit || 1},
        ${valid_from || null},
        ${valid_until || null},
        ${active !== false},
        ${admin.email}
      )
      RETURNING *
    `.catch(() => []);

    if (!newCoupon) {
      return NextResponse.json(
        { ok: false, error: 'Failed to create coupon' },
        { status: 500 }
      );
    }

    // Create audit log
    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.COUPON_CREATED,
      'coupon',
      newCoupon.id,
      { code: newCoupon.code, discount_type: newCoupon.discount_type },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      coupon: newCoupon,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create coupon' },
      { status: 500 }
    );
  }
}

