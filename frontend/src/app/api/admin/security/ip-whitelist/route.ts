/**
 * Admin IP Whitelist API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get all whitelisted IPs
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const ips = await sql`
      SELECT * FROM ip_whitelist
      ORDER BY created_at DESC
    `.catch(() => []);

    return NextResponse.json({
      ok: true,
      ips,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching IP whitelist:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch IP whitelist' },
      { status: 500 }
    );
  }
}

// POST - Add IP to whitelist
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();
    const { ip_address, description } = body;

    if (!ip_address) {
      return NextResponse.json(
        { ok: false, error: 'ip_address is required' },
        { status: 400 }
      );
    }

    // Check if IP already exists
    const [existing] = await sql`
      SELECT id FROM ip_whitelist WHERE ip_address = ${ip_address} LIMIT 1
    `.catch(() => []);

    if (existing) {
      return NextResponse.json(
        { ok: false, error: 'IP address already whitelisted' },
        { status: 400 }
      );
    }

    const [newIP] = await sql`
      INSERT INTO ip_whitelist (ip_address, description)
      VALUES (${ip_address}, ${description || null})
      RETURNING *
    `.catch(() => []);

    if (!newIP) {
      return NextResponse.json(
        { ok: false, error: 'Failed to add IP to whitelist' },
        { status: 500 }
      );
    }

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'ip_whitelist',
      newIP.id,
      { ip_address },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      ip: newIP,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error adding IP to whitelist:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to add IP to whitelist' },
      { status: 500 }
    );
  }
}

