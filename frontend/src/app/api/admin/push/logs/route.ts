/**
 * Admin Push Logs API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get push logs
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const logs = await sql`
      SELECT * FROM push_notifications
      ORDER BY sent_at DESC
      LIMIT ${limit}
    `.catch(() => []);

    return NextResponse.json({
      ok: true,
      logs,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching push logs:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch push logs' },
      { status: 500 }
    );
  }
}

