/**
 * Admin Subscriptions API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get all subscriptions
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const plan = searchParams.get('plan');

    let query = sql`
      SELECT 
        s.*,
        u.name as user_name,
        u.email as user_email
      FROM subscriptions s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE 1=1
    `;

    if (status && status !== 'all') {
      query = sql`${query} AND s.status = ${status}`;
    }

    if (plan && plan !== 'all') {
      query = sql`${query} AND s.plan_name = ${plan}`;
    }

    query = sql`${query} ORDER BY s.next_billing_date ASC LIMIT 100`;

    const subscriptions = await query.catch(() => []);

    return NextResponse.json({
      ok: true,
      subscriptions,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

