/**
 * Admin Notifications Read All API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// PATCH - Mark all notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);

    await sql`
      UPDATE notifications
      SET read = true, read_at = NOW()
      WHERE (user_id = ${admin.id} OR user_id IS NULL) AND read = false
    `.catch(() => []);

    return NextResponse.json({
      ok: true,
      message: 'All notifications marked as read',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to mark all notifications as read' },
      { status: 500 }
    );
  }
}

