/**
 * Admin Send SMS API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// POST - Send SMS
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();
    const { phone, message } = body;

    if (!phone || !message) {
      return NextResponse.json(
        { ok: false, error: 'phone and message are required' },
        { status: 400 }
      );
    }

    // Get SMS config
    const [config] = await sql`
      SELECT * FROM sms_config WHERE is_active = true LIMIT 1
    `.catch(() => []);

    if (!config) {
      return NextResponse.json(
        { ok: false, error: 'SMS is not configured or not active' },
        { status: 400 }
      );
    }

    // Log SMS (actual sending would be done via external service)
    const [smsLog] = await sql`
      INSERT INTO sms_logs (phone, message, status, sent_at)
      VALUES (${phone}, ${message}, 'sent', NOW())
      RETURNING *
    `.catch(() => []);

    if (!smsLog) {
      return NextResponse.json(
        { ok: false, error: 'Failed to log SMS' },
        { status: 500 }
      );
    }

    // TODO: Integrate with actual SMS provider (Twilio, Vonage, etc.)
    // For now, just log it

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'sms',
      smsLog.id,
      { phone, message: message.substring(0, 50) },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      log: smsLog,
      message: 'SMS sent successfully (logged)',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error sending SMS:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to send SMS' },
      { status: 500 }
    );
  }
}

