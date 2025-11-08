/**
 * Admin Notifications API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get notifications
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);

    const { searchParams } = request.nextUrl;
    const read = searchParams.get('read');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = sql`
      SELECT * FROM notifications
      WHERE user_id = ${admin.id} OR user_id IS NULL
    `;

    if (read === 'true') {
      query = sql`${query} AND read = true`;
    } else if (read === 'false') {
      query = sql`${query} AND read = false`;
    }

    query = sql`${query} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const notifications = await query.catch(() => []);

    return NextResponse.json({
      ok: true,
      notifications,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

