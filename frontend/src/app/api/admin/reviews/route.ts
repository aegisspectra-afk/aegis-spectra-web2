/**
 * Admin Reviews API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get all reviews
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const rating = searchParams.get('rating');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = sql`
      SELECT 
        r.*,
        (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
      FROM reviews r
      WHERE 1=1
    `;

    if (status && status !== 'all') {
      query = sql`${query} AND r.status = ${status}`;
    }

    if (rating && rating !== 'all') {
      query = sql`${query} AND r.rating = ${parseInt(rating)}`;
    }

    query = sql`${query} ORDER BY r.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const reviews = await query.catch(() => []);

    return NextResponse.json({
      ok: true,
      reviews,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

