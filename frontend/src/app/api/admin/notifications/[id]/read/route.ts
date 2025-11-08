/**
 * Admin Notification Read API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// PATCH - Mark notification as read
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;

    await sql`
      UPDATE notifications
      SET read = true, read_at = NOW()
      WHERE id = ${parseInt(id)} AND (user_id = ${admin.id} OR user_id IS NULL)
    `.catch(() => []);

    return NextResponse.json({
      ok: true,
      message: 'Notification marked as read',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to mark notification as read' },
      { status: 500 }
    );
  }
}

