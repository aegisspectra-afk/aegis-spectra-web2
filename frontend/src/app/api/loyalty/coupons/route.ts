import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aegis2024';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const providedPassword = authHeader?.replace('Bearer ', '');
  return providedPassword === ADMIN_PASSWORD;
}

// GET - Get coupons for user or validate coupon
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get('user_id');
    const userEmail = searchParams.get('user_email');
    const code = searchParams.get('code');

    if (code) {
      // Validate coupon
      const [coupon] = await sql`
        SELECT * FROM loyalty_coupons
        WHERE code = ${code}
          AND status = 'active'
          AND (valid_until IS NULL OR valid_until > NOW())
          AND used_count < usage_limit
      `;

      if (!coupon) {
        return NextResponse.json(
          { ok: false, error: 'Invalid or expired coupon' },
          { status: 404 }
        );
      }

      // Check if user-specific and matches
      if (coupon.user_id && userId && coupon.user_id !== parseInt(userId)) {
        return NextResponse.json(
          { ok: false, error: 'Coupon not valid for this user' },
          { status: 403 }
        );
      }

      if (coupon.user_email && userEmail && coupon.user_email !== userEmail) {
        return NextResponse.json(
          { ok: false, error: 'Coupon not valid for this user' },
          { status: 403 }
        );
      }

      return NextResponse.json({ ok: true, coupon });
    }

    // Get user's coupons
    if (!userId && !userEmail) {
      return NextResponse.json(
        { ok: false, error: 'user_id or user_email is required' },
        { status: 400 }
      );
    }

    const coupons = await sql`
      SELECT * FROM loyalty_coupons
      WHERE ${userId ? sql`user_id = ${parseInt(userId)}` : sql`user_email = ${userEmail}`}
        AND status = 'active'
        AND (valid_until IS NULL OR valid_until > NOW())
        AND used_count < usage_limit
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      ok: true,
      coupons
    });
  } catch (error: any) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

// POST - Create coupon (admin only)
export async function POST(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      code,
      user_id,
      user_email,
      discount_type,
      discount_value,
      min_purchase,
      max_discount,
      usage_limit,
      valid_until,
      description
    } = body;

    if (!code || !discount_type || !discount_value) {
      return NextResponse.json(
        { ok: false, error: 'code, discount_type, and discount_value are required' },
        { status: 400 }
      );
    }

    // Generate code if not provided
    let couponCode = code;
    if (!couponCode) {
      couponCode = `COUPON-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    }

    const [coupon] = await sql`
      INSERT INTO loyalty_coupons (
        code, user_id, user_email, discount_type, discount_value,
        min_purchase, max_discount, usage_limit, valid_until, created_by
      )
      VALUES (
        ${couponCode}, ${user_id || null}, ${user_email || null},
        ${discount_type}, ${discount_value}, ${min_purchase || null},
        ${max_discount || null}, ${usage_limit || 1},
        ${valid_until || null}, 'admin'
      )
      RETURNING *
    `;

    return NextResponse.json({ ok: true, coupon });
  } catch (error: any) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create coupon' },
      { status: 500 }
    );
  }
}

