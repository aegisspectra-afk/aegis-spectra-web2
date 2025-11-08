/**
 * Admin API Keys API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get all API keys
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const keys = await sql`
      SELECT id, name, key, permissions, last_used, expires_at, is_active, created_at
      FROM api_keys
      ORDER BY created_at DESC
    `.catch(() => []);

    return NextResponse.json({
      ok: true,
      keys,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// POST - Create new API key
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();
    const { name, permissions, expires_at, is_active } = body;

    if (!name || !permissions || permissions.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'name and permissions are required' },
        { status: 400 }
      );
    }

    // Generate API key
    const apiKey = `aegis_${crypto.randomBytes(32).toString('hex')}`;

    const [newKey] = await sql`
      INSERT INTO api_keys (name, key, permissions, expires_at, is_active)
      VALUES (
        ${name}, ${apiKey}, ${JSON.stringify(permissions)},
        ${expires_at ? new Date(expires_at).toISOString() : null}, ${is_active !== false}
      )
      RETURNING *
    `.catch(() => []);

    if (!newKey) {
      return NextResponse.json(
        { ok: false, error: 'Failed to create API key' },
        { status: 500 }
      );
    }

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'api_key',
      newKey.id,
      { name },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      key: newKey,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error creating API key:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

