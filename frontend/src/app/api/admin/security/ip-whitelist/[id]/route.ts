/**
 * Admin IP Whitelist Item API - Delete specific IP
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// DELETE - Remove IP from whitelist
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;

    // Get IP before deleting
    const [ip] = await sql`
      SELECT ip_address FROM ip_whitelist WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!ip) {
      return NextResponse.json(
        { ok: false, error: 'IP not found' },
        { status: 404 }
      );
    }

    await sql`
      DELETE FROM ip_whitelist WHERE id = ${parseInt(id)}
    `.catch(() => {
      throw new Error('Failed to delete IP');
    });

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'ip_whitelist',
      id,
      { action: 'deleted', ip_address: ip.ip_address },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      message: 'IP removed from whitelist successfully',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error deleting IP:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete IP' },
      { status: 500 }
    );
  }
}

