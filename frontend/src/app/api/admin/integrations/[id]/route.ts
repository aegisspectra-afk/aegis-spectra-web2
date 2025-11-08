/**
 * Admin Integration API - Get, Update, Delete specific integration
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get integration by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const [integration] = await sql`
      SELECT * FROM integrations WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!integration) {
      return NextResponse.json(
        { ok: false, error: 'Integration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      integration,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching integration:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch integration' },
      { status: 500 }
    );
  }
}

// PATCH - Update integration
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const [currentIntegration] = await sql`
      SELECT * FROM integrations WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!currentIntegration) {
      return NextResponse.json(
        { ok: false, error: 'Integration not found' },
        { status: 404 }
      );
    }

    const { name, type, api_key, api_secret, webhook_url, is_active } = body;

    const [updatedIntegration] = await sql`
      UPDATE integrations
      SET 
        name = COALESCE(${name || null}, name),
        type = COALESCE(${type || null}, type),
        api_key = COALESCE(${api_key !== undefined ? api_key : null}, api_key),
        api_secret = COALESCE(${api_secret !== undefined ? api_secret : null}, api_secret),
        webhook_url = COALESCE(${webhook_url !== undefined ? webhook_url : null}, webhook_url),
        is_active = COALESCE(${is_active !== undefined ? is_active : null}, is_active),
        updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING id, name, type, is_active, last_sync, created_at
    `.catch(() => []);

    if (!updatedIntegration) {
      return NextResponse.json(
        { ok: false, error: 'Failed to update integration' },
        { status: 500 }
      );
    }

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'integration',
      id,
      { changes: Object.keys(body) },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      integration: updatedIntegration,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error updating integration:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update integration' },
      { status: 500 }
    );
  }
}

// DELETE - Delete integration
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;

    await sql`
      DELETE FROM integrations WHERE id = ${parseInt(id)}
    `.catch(() => {
      throw new Error('Failed to delete integration');
    });

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'integration',
      id,
      { action: 'deleted' },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      message: 'Integration deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error deleting integration:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete integration' },
      { status: 500 }
    );
  }
}

