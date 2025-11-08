import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aegis2024';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const providedPassword = authHeader?.replace('Bearer ', '');
  return providedPassword === ADMIN_PASSWORD;
}

// GET - Get FAQ items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = sql`
      SELECT * FROM faqs
      WHERE status = 'published'
    `;

    if (category) {
      query = sql`
        SELECT * FROM faqs
        WHERE status = 'published'
          AND category = ${category}
      `;
    }

    if (search) {
      query = sql`
        SELECT * FROM faqs
        WHERE status = 'published'
          AND (
            question ILIKE ${`%${search}%`}
            OR answer ILIKE ${`%${search}%`}
            OR tags::text ILIKE ${`%${search}%`}
          )
        ${category ? sql`AND category = ${category}` : sql``}
      `;
    }

    const faqs = await sql`
      ${query}
      ORDER BY order_index ASC, views DESC, created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    // Increment views
    faqs.forEach(async (faq: any) => {
      await sql`
        UPDATE faqs
        SET views = views + 1
        WHERE id = ${faq.id}
      `;
    });

    // Get total count
    const totalQuery = sql`
      SELECT COUNT(*) as count
      FROM faqs
      WHERE status = 'published'
      ${category ? sql`AND category = ${category}` : sql``}
      ${search ? sql`AND (
        question ILIKE ${`%${search}%`}
        OR answer ILIKE ${`%${search}%`}
        OR tags::text ILIKE ${`%${search}%`}
      )` : sql``}
    `;
    const totalResult = await totalQuery;
    const total = parseInt(totalResult[0]?.count || '0');

    return NextResponse.json({
      ok: true,
      faqs,
      total,
      limit,
      offset
    });
  } catch (error: any) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

// POST - Create FAQ (admin only)
export async function POST(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { question, answer, category, tags, order_index, status } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { ok: false, error: 'question and answer are required' },
        { status: 400 }
      );
    }

    const [faq] = await sql`
      INSERT INTO faqs (question, answer, category, tags, order_index, status)
      VALUES (
        ${question}, ${answer}, ${category || 'general'},
        ${tags ? JSON.stringify(tags) : null}, ${order_index || 0},
        ${status || 'published'}
      )
      RETURNING *
    `;

    return NextResponse.json({ ok: true, faq });
  } catch (error: any) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}

