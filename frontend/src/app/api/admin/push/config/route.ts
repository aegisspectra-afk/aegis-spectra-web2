/**
 * Admin Push Config API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get push config
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const [config] = await sql`
      SELECT * FROM push_config LIMIT 1
    `.catch(() => []);

    return NextResponse.json({
      ok: true,
      config: config || {
        provider: 'firebase',
        is_active: false,
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching push config:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch push config' },
      { status: 500 }
    );
  }
}

// POST - Update push config
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();
    const { provider, api_key, is_active } = body;

    // Check if config exists
    const [existing] = await sql`
      SELECT id FROM push_config LIMIT 1
    `.catch(() => []);

    let result;
    if (existing) {
      // Update
      [result] = await sql`
        UPDATE push_config
        SET 
          provider = ${provider},
          api_key = ${api_key || null},
          is_active = ${is_active !== false},
          updated_at = NOW()
        WHERE id = ${existing.id}
        RETURNING *
      `.catch(() => []);
    } else {
      // Create
      [result] = await sql`
        INSERT INTO push_config (provider, api_key, is_active)
        VALUES (${provider}, ${api_key || null}, ${is_active !== false})
        RETURNING *
      `.catch(() => []);
    }

    if (!result) {
      return NextResponse.json(
        { ok: false, error: 'Failed to save push config' },
        { status: 500 }
      );
    }

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'push_config',
      result.id,
      { provider },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      config: result,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error saving push config:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to save push config' },
      { status: 500 }
    );
  }
}

