/**
 * Admin Vendor API - Get, Update, Delete specific vendor
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get vendor by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const [vendor] = await sql`
      SELECT * FROM vendors WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!vendor) {
      return NextResponse.json(
        { ok: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      vendor,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching vendor:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch vendor' },
      { status: 500 }
    );
  }
}

// PATCH - Update vendor
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const [currentVendor] = await sql`
      SELECT * FROM vendors WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!currentVendor) {
      return NextResponse.json(
        { ok: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }

    const { name, contact_name, email, phone, address, is_active } = body;

    const [updatedVendor] = await sql`
      UPDATE vendors
      SET 
        name = COALESCE(${name || null}, name),
        contact_name = COALESCE(${contact_name || null}, contact_name),
        email = COALESCE(${email || null}, email),
        phone = COALESCE(${phone || null}, phone),
        address = COALESCE(${address !== undefined ? address : null}, address),
        is_active = COALESCE(${is_active !== undefined ? is_active : null}, is_active),
        updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `.catch(() => []);

    if (!updatedVendor) {
      return NextResponse.json(
        { ok: false, error: 'Failed to update vendor' },
        { status: 500 }
      );
    }

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'vendor',
      id,
      { changes: Object.keys(body) },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      vendor: updatedVendor,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error updating vendor:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update vendor' },
      { status: 500 }
    );
  }
}

// DELETE - Delete vendor
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;

    await sql`
      DELETE FROM vendors WHERE id = ${parseInt(id)}
    `.catch(() => {
      throw new Error('Failed to delete vendor');
    });

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'vendor',
      id,
      { action: 'deleted' },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      message: 'Vendor deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error deleting vendor:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete vendor' },
      { status: 500 }
    );
  }
}

