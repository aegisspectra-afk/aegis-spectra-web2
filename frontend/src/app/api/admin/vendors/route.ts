/**
 * Admin Vendors API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get all vendors
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const vendors = await sql`
      SELECT 
        v.*,
        (SELECT COUNT(*) FROM products WHERE vendor_id = v.id) as products_count,
        (SELECT COUNT(*) FROM orders o 
         JOIN order_items oi ON o.order_id = oi.order_id 
         JOIN products p ON oi.sku = p.sku 
         WHERE p.vendor_id = v.id) as total_orders
      FROM vendors v
      ORDER BY v.created_at DESC
    `.catch(() => []);

    return NextResponse.json({
      ok: true,
      vendors,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching vendors:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}

// POST - Create new vendor
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();
    const { name, contact_name, email, phone, address, is_active } = body;

    if (!name || !contact_name || !email || !phone) {
      return NextResponse.json(
        { ok: false, error: 'name, contact_name, email, and phone are required' },
        { status: 400 }
      );
    }

    const [newVendor] = await sql`
      INSERT INTO vendors (name, contact_name, email, phone, address, is_active)
      VALUES (${name}, ${contact_name}, ${email}, ${phone}, ${address || null}, ${is_active !== false})
      RETURNING *
    `.catch(() => []);

    if (!newVendor) {
      return NextResponse.json(
        { ok: false, error: 'Failed to create vendor' },
        { status: 500 }
      );
    }

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'vendor',
      newVendor.id,
      { name, email },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      vendor: newVendor,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error creating vendor:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create vendor' },
      { status: 500 }
    );
  }
}

