/**
 * Admin Enhanced Logs Export API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Export logs as CSV
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const resource_type = searchParams.get('resource_type');
    const user_id = searchParams.get('user_id');
    const date_from = searchParams.get('date_from');
    const date_to = searchParams.get('date_to');

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

    query = sql`${query} ORDER BY created_at DESC LIMIT 10000`;

    const logs = await query.catch(() => []);

    // Generate CSV
    const headers = ['תאריך', 'משתמש', 'אימייל', 'פעולה', 'סוג משאב', 'ID משאב', 'פרטים', 'IP', 'User Agent'];
    const rows = logs.map((log: any) => [
      new Date(log.created_at).toLocaleString('he-IL'),
      log.user_id,
      log.user_email,
      log.action,
      log.resource_type,
      log.resource_id,
      JSON.stringify(log.details),
      log.ip_address || '',
      log.user_agent || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row: any[]) => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="logs-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error exporting logs:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to export logs' },
      { status: 500 }
    );
  }
}

