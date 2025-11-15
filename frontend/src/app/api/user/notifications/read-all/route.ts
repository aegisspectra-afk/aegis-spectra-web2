import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { neon } from '@netlify/neon';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for notifications');
  sql = null;
}

export const dynamic = 'force-dynamic';

// POST - Mark all notifications as read
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    if (!sql) {
      return NextResponse.json({ ok: true });
    }

    await sql`
      UPDATE user_notifications
      SET read = true
      WHERE (user_id = ${user.id} OR user_email = ${user.email}) AND read = false
    `.catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { ok: false, error: 'Failed to mark all notifications as read' },
      { status: 500 }
    );
  }
}

