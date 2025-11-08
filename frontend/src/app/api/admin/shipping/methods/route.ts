/**
 * Admin Shipping Methods API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get all shipping methods
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const methods = await sql`
      SELECT * FROM shipping_methods
      ORDER BY created_at DESC
    `.catch(() => []);

    return NextResponse.json({
      ok: true,
      methods,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching shipping methods:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch shipping methods' },
      { status: 500 }
    );
  }
}

// POST - Create new shipping method
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();
    const {
      name,
      description,
      cost,
      free_shipping_threshold,
      estimated_days,
      is_active,
      zones,
      weight_limit,
    } = body;

    if (!name || cost === undefined || estimated_days === undefined) {
      return NextResponse.json(
        { ok: false, error: 'name, cost, and estimated_days are required' },
        { status: 400 }
      );
    }

    const [newMethod] = await sql`
      INSERT INTO shipping_methods (
        name, description, cost, free_shipping_threshold, estimated_days,
        is_active, zones, weight_limit
      )
      VALUES (
        ${name}, ${description || null}, ${cost}, ${free_shipping_threshold || null},
        ${estimated_days}, ${is_active !== false}, ${zones ? JSON.stringify(zones) : null},
        ${weight_limit || null}
      )
      RETURNING *
    `.catch(() => []);

    if (!newMethod) {
      return NextResponse.json(
        { ok: false, error: 'Failed to create shipping method' },
        { status: 500 }
      );
    }

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'shipping_method',
      newMethod.id,
      { name, cost },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      method: newMethod,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error creating shipping method:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create shipping method' },
      { status: 500 }
    );
  }
}

