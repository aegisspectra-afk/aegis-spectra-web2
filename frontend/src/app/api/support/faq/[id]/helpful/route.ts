import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon();

// POST - Mark FAQ as helpful
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const faqId = parseInt(id);
    const body = await request.json();
    const { is_helpful = true } = body;

    // Get client IP for tracking
    const clientId = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Check if user already voted
    const [existing] = await sql`
      SELECT id FROM faq_helpful_votes
      WHERE faq_id = ${faqId}
        AND (user_ip = ${clientId})
      LIMIT 1
    `;

    if (existing) {
      return NextResponse.json(
        { ok: false, error: 'Already voted' },
        { status: 400 }
      );
    }

    // Add vote
    await sql`
      INSERT INTO faq_helpful_votes (faq_id, user_ip, is_helpful)
      VALUES (${faqId}, ${clientId}, ${is_helpful})
    `;

    // Update helpful count
    if (is_helpful) {
      await sql`
        UPDATE faqs
        SET helpful_count = helpful_count + 1
        WHERE id = ${faqId}
      `;
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Error marking FAQ as helpful:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to mark FAQ as helpful' },
      { status: 500 }
    );
  }
}

