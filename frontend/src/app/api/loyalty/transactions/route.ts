import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { neon } from '@netlify/neon';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for loyalty transactions');
  sql = null;
}

export const dynamic = 'force-dynamic';

// GET - Get loyalty points transactions
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = request.nextUrl;
    const filter = searchParams.get('filter') || 'all';

    // If no database, return empty transactions
    if (!sql) {
      console.log('Database not available, using fallback transactions');
      return NextResponse.json({
        ok: true,
        transactions: [],
      });
    }

    try {
      let query = sql`
        SELECT id, transaction_type as type, points, description, order_id, created_at
        FROM loyalty_transactions
        WHERE user_id = ${user.id} OR user_email = ${user.email}
      `;

      if (filter !== 'all') {
        query = sql`${query} AND transaction_type = ${filter}`;
      }

      query = sql`${query} ORDER BY created_at DESC LIMIT 100`;

      const transactions = await query.catch(() => []);

      return NextResponse.json({
        ok: true,
        transactions: transactions.map((t: any) => ({
          id: t.id.toString(),
          type: t.type === 'earn' ? 'earned' : t.type === 'redeem' ? 'redeemed' : t.type,
          points: t.points,
          description: t.description || 'פעולת נקודות',
          order_id: t.order_id,
          created_at: t.created_at,
        })),
      });
    } catch (dbError: any) {
      console.error('Database error fetching transactions:', dbError);
      return NextResponse.json({
        ok: true,
        transactions: [],
      });
    }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

