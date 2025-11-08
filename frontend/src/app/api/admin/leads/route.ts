/**
 * Admin Leads API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get all leads
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const minScore = searchParams.get('min_score');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = sql`
      SELECT * FROM leads
      WHERE 1=1
    `;

    if (status && status !== 'all') {
      query = sql`${query} AND status = ${status}`;
    }

    if (minScore && minScore !== 'all') {
      query = sql`${query} AND score >= ${parseInt(minScore)}`;
    }

    query = sql`${query} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const leads = await query.catch(() => []);

    return NextResponse.json({
      ok: true,
      leads,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

