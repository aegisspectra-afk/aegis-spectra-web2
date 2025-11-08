/**
 * Admin Send Push API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// POST - Send push notification
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();
    const { user_id, title, message } = body;

    if (!title || !message) {
      return NextResponse.json(
        { ok: false, error: 'title and message are required' },
        { status: 400 }
      );
    }

    // Get push config
    const [config] = await sql`
      SELECT * FROM push_config WHERE is_active = true LIMIT 1
    `.catch(() => []);

    if (!config) {
      return NextResponse.json(
        { ok: false, error: 'Push notifications are not configured or not active' },
        { status: 400 }
      );
    }

    // Log push (actual sending would be done via external service)
    const [pushLog] = await sql`
      INSERT INTO push_notifications (user_id, title, message, status, sent_at)
      VALUES (${user_id || null}, ${title}, ${message}, 'sent', NOW())
      RETURNING *
    `.catch(() => []);

    if (!pushLog) {
      return NextResponse.json(
        { ok: false, error: 'Failed to log push notification' },
        { status: 500 }
      );
    }

    // TODO: Integrate with actual push provider (FCM, OneSignal, etc.)
    // For now, just log it

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'push_notification',
      pushLog.id,
      { title, user_id },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      log: pushLog,
      message: 'Push notification sent successfully (logged)',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error sending push:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to send push notification' },
      { status: 500 }
    );
  }
}

