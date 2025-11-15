import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for review helpful votes');
  sql = null;
}

// POST - Mark review as helpful
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviewId = parseInt(id);
    const body = await request.json();
    const { is_helpful = true, user_id, user_ip } = body;

    if (!sql) {
      return NextResponse.json({
        ok: true,
        helpful_count: 0,
        message: 'Database not available (local dev mode)'
      });
    }

    // Get client IP if not provided
    const clientIp = user_ip || request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 'unknown';

    // Check if vote already exists
    const existingVote = await sql`
      SELECT id FROM review_helpful_votes
      WHERE review_id = ${reviewId}
        AND (user_id = ${user_id || null} OR user_ip = ${clientIp})
      LIMIT 1
    `.catch(() => []);

    if (existingVote.length > 0) {
      // Update existing vote
      await sql`
        UPDATE review_helpful_votes
        SET is_helpful = ${is_helpful},
            created_at = NOW()
        WHERE id = ${existingVote[0].id}
      `.catch(() => {});
    } else {
      // Create new vote
      await sql`
        INSERT INTO review_helpful_votes (review_id, user_id, user_ip, is_helpful)
        VALUES (${reviewId}, ${user_id || null}, ${clientIp}, ${is_helpful})
      `.catch(() => {});
    }

    // Get updated helpful count
    const helpfulCount = await sql`
      SELECT COUNT(*) as count
      FROM review_helpful_votes
      WHERE review_id = ${reviewId} AND is_helpful = true
    `.catch(() => [{ count: 0 }]);

    return NextResponse.json({
      ok: true,
      helpful_count: parseInt(helpfulCount[0]?.count || '0')
    });
  } catch (error: any) {
    console.error('Error marking review as helpful:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to mark review as helpful' },
      { status: 500 }
    );
  }
}

