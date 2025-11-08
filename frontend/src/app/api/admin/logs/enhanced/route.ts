/**
 * Admin Enhanced Logs API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get enhanced logs with filters
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = request.nextUrl;
    const action = searchParams.get('action');
    const resource_type = searchParams.get('resource_type');
    const user_id = searchParams.get('user_id');
    const date_from = searchParams.get('date_from');
    const date_to = searchParams.get('date_to');
    const search = searchParams.get('search');

    let query = sql`
      SELECT * FROM audit_logs WHERE 1=1
    `;

    if (action && action !== 'all') {
      query = sql`${query} AND action = ${action}`;
    }

    if (resource_type && resource_type !== 'all') {
      query = sql`${query} AND resource_type = ${resource_type}`;
    }

    if (user_id) {
      query = sql`${query} AND user_id = ${parseInt(user_id)}`;
    }

    if (date_from) {
      query = sql`${query} AND created_at >= ${new Date(date_from).toISOString()}`;
    }

    if (date_to) {
      query = sql`${query} AND created_at <= ${new Date(date_to + 'T23:59:59').toISOString()}`;
    }

    if (search) {
      query = sql`${query} AND (action ILIKE ${'%' + search + '%'} OR resource_type ILIKE ${'%' + search + '%'} OR user_email ILIKE ${'%' + search + '%'})`;
    }

    query = sql`${query} ORDER BY created_at DESC LIMIT 500`;

    const logs = await query.catch(() => []);

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

    console.error('Error fetching enhanced logs:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch enhanced logs' },
      { status: 500 }
    );
  }
}

