/**
 * Admin Integrations API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get all integrations
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const integrations = await sql`
      SELECT id, name, type, is_active, last_sync, created_at
      FROM integrations
      ORDER BY created_at DESC
    `.catch(() => []);

    return NextResponse.json({
      ok: true,
      integrations,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching integrations:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch integrations' },
      { status: 500 }
    );
  }
}

// POST - Create new integration
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();
    const { name, type, api_key, api_secret, webhook_url, is_active } = body;

    if (!name || !type) {
      return NextResponse.json(
        { ok: false, error: 'name and type are required' },
        { status: 400 }
      );
    }

    const [newIntegration] = await sql`
      INSERT INTO integrations (name, type, api_key, api_secret, webhook_url, is_active)
      VALUES (
        ${name}, ${type}, ${api_key || null}, ${api_secret || null},
        ${webhook_url || null}, ${is_active !== false}
      )
      RETURNING id, name, type, is_active, last_sync, created_at
    `.catch(() => []);

    if (!newIntegration) {
      return NextResponse.json(
        { ok: false, error: 'Failed to create integration' },
        { status: 500 }
      );
    }

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'integration',
      newIntegration.id,
      { name, type },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      integration: newIntegration,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error creating integration:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create integration' },
      { status: 500 }
    );
  }
}

