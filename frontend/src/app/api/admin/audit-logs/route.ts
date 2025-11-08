/**
 * Admin Audit Logs API
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { getAuditLogs } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

// GET - Get audit logs
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const action = searchParams.get('action');
    const resourceType = searchParams.get('resource_type');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const logs = await getAuditLogs({
      userId: userId ? parseInt(userId) : undefined,
      action: action || undefined,
      resourceType: resourceType || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      limit,
      offset,
    });

    return NextResponse.json({
      ok: true,
      logs,
      count: logs.length,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

