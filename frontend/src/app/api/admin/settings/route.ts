/**
 * Admin Settings API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get settings
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    // Try to get settings from database
    const [settings] = await sql`
      SELECT * FROM settings WHERE id = 1 LIMIT 1
    `.catch(() => []);

    if (settings) {
      return NextResponse.json({
        ok: true,
        settings: settings.data || {},
      });
    }

    // Return default settings if not found
    return NextResponse.json({
      ok: true,
      settings: {},
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();

    // Try to update or insert settings
    await sql`
      INSERT INTO settings (id, data, updated_at)
      VALUES (1, ${JSON.stringify(body)}, NOW())
      ON CONFLICT (id) 
      DO UPDATE SET data = ${JSON.stringify(body)}, updated_at = NOW()
    `.catch(() => {
      // If table doesn't exist, just log
      console.warn('Settings table not found');
    });

    // Create audit log
    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'settings',
      1,
      { changes: Object.keys(body) },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      message: 'Settings updated successfully',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error updating settings:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

