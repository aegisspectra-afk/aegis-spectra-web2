/**
 * Admin API Key API - Get, Update, Delete specific key
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get key by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const [key] = await sql`
      SELECT id, name, key, permissions, last_used, expires_at, is_active, created_at
      FROM api_keys WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!key) {
      return NextResponse.json(
        { ok: false, error: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      key,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching API key:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch API key' },
      { status: 500 }
    );
  }
}

// PATCH - Update key
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const [currentKey] = await sql`
      SELECT * FROM api_keys WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!currentKey) {
      return NextResponse.json(
        { ok: false, error: 'API key not found' },
        { status: 404 }
      );
    }

    const { name, permissions, expires_at, is_active } = body;

    const [updatedKey] = await sql`
      UPDATE api_keys
      SET 
        name = COALESCE(${name || null}, name),
        permissions = COALESCE(${permissions ? JSON.stringify(permissions) : null}, permissions),
        expires_at = COALESCE(${expires_at ? new Date(expires_at).toISOString() : null}, expires_at),
        is_active = COALESCE(${is_active !== undefined ? is_active : null}, is_active),
        updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING id, name, key, permissions, last_used, expires_at, is_active, created_at
    `.catch(() => []);

    if (!updatedKey) {
      return NextResponse.json(
        { ok: false, error: 'Failed to update API key' },
        { status: 500 }
      );
    }

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'api_key',
      id,
      { changes: Object.keys(body) },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      key: updatedKey,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error updating API key:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update API key' },
      { status: 500 }
    );
  }
}

// DELETE - Delete key
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;

    await sql`
      DELETE FROM api_keys WHERE id = ${parseInt(id)}
    `.catch(() => {
      throw new Error('Failed to delete API key');
    });

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'api_key',
      id,
      { action: 'deleted' },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      message: 'API key deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}

