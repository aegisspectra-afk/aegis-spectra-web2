/**
 * Admin Shipping Method API - Get, Update, Delete specific method
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get method by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const [method] = await sql`
      SELECT * FROM shipping_methods WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!method) {
      return NextResponse.json(
        { ok: false, error: 'Shipping method not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      method,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching shipping method:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch shipping method' },
      { status: 500 }
    );
  }
}

// PATCH - Update method
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const [currentMethod] = await sql`
      SELECT * FROM shipping_methods WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!currentMethod) {
      return NextResponse.json(
        { ok: false, error: 'Shipping method not found' },
        { status: 404 }
      );
    }

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

    const [updatedMethod] = await sql`
      UPDATE shipping_methods
      SET 
        name = COALESCE(${name || null}, name),
        description = COALESCE(${description !== undefined ? description : null}, description),
        cost = COALESCE(${cost !== undefined ? cost : null}, cost),
        free_shipping_threshold = COALESCE(${free_shipping_threshold !== undefined ? free_shipping_threshold : null}, free_shipping_threshold),
        estimated_days = COALESCE(${estimated_days !== undefined ? estimated_days : null}, estimated_days),
        is_active = COALESCE(${is_active !== undefined ? is_active : null}, is_active),
        zones = COALESCE(${zones ? JSON.stringify(zones) : null}, zones),
        weight_limit = COALESCE(${weight_limit !== undefined ? weight_limit : null}, weight_limit),
        updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `.catch(() => []);

    if (!updatedMethod) {
      return NextResponse.json(
        { ok: false, error: 'Failed to update shipping method' },
        { status: 500 }
      );
    }

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'shipping_method',
      id,
      { changes: Object.keys(body) },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      method: updatedMethod,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error updating shipping method:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update shipping method' },
      { status: 500 }
    );
  }
}

// DELETE - Delete method
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;

    await sql`
      DELETE FROM shipping_methods WHERE id = ${parseInt(id)}
    `.catch(() => {
      throw new Error('Failed to delete shipping method');
    });

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'shipping_method',
      id,
      { action: 'deleted' },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      message: 'Shipping method deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error deleting shipping method:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete shipping method' },
      { status: 500 }
    );
  }
}

