import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { neon } from '@netlify/neon';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for redeem');
  sql = null;
}

export const dynamic = 'force-dynamic';

// GET - Get redeemable items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category') || 'all';

    // Fallback items
    const fallbackItems = [
      {
        id: '1',
        name: 'הנחה 10%',
        description: 'קופון הנחה של 10% על כל הרכישות',
        points_required: 100,
        category: 'discounts',
      },
      {
        id: '2',
        name: 'הנחה 20%',
        description: 'קופון הנחה של 20% על כל הרכישות',
        points_required: 200,
        category: 'discounts',
      },
      {
        id: '3',
        name: 'שירות תחזוקה חינם',
        description: 'שירות תחזוקה חינם למערכת',
        points_required: 500,
        category: 'services',
      },
    ];

    if (!sql) {
      return NextResponse.json({
        ok: true,
        items: category === 'all' 
          ? fallbackItems 
          : fallbackItems.filter(item => item.category === category),
      });
    }

    try {
      // Create redeemable items table if not exists
      await sql`
        CREATE TABLE IF NOT EXISTS loyalty_redeemable_items (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          points_required INTEGER NOT NULL,
          category VARCHAR(50),
          image_url VARCHAR(500),
          active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `.catch(() => {});

      let query = sql`
        SELECT id, name, description, points_required, category, image_url
        FROM loyalty_redeemable_items
        WHERE active = true
      `;

      if (category !== 'all') {
        query = sql`${query} AND category = ${category}`;
      }

      query = sql`${query} ORDER BY points_required ASC`;

      const items = await query.catch(() => []);

      return NextResponse.json({
        ok: true,
        items: items.length > 0 
          ? items.map((item: any) => ({
              id: item.id.toString(),
              name: item.name,
              description: item.description,
              points_required: item.points_required,
              category: item.category,
              image: item.image_url,
            }))
          : (category === 'all' 
              ? fallbackItems 
              : fallbackItems.filter(item => item.category === category)),
      });
    } catch (dbError: any) {
      console.error('Database error fetching redeemable items:', dbError);
      return NextResponse.json({
        ok: true,
        items: category === 'all' 
          ? fallbackItems 
          : fallbackItems.filter(item => item.category === category),
      });
    }
  } catch (error: any) {
    console.error('Error fetching redeemable items:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch redeemable items' },
      { status: 500 }
    );
  }
}

// POST - Redeem points for item
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { item_id, user_email } = body;

    if (!item_id) {
      return NextResponse.json(
        { ok: false, error: 'item_id is required' },
        { status: 400 }
      );
    }

    if (!sql) {
      return NextResponse.json({
        ok: true,
        message: 'Redeem successful (local dev mode)',
      });
    }

    // Get item
    const [item] = await sql`
      SELECT * FROM loyalty_redeemable_items
      WHERE id = ${parseInt(item_id)} AND active = true
      LIMIT 1
    `.catch(() => []);

    if (!item) {
      return NextResponse.json(
        { ok: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    // Get user points
    const [points] = await sql`
      SELECT points FROM loyalty_points
      WHERE user_id = ${user.id} OR user_email = ${user.email || user_email}
      LIMIT 1
    `.catch(() => []);

    if (!points || points.points < item.points_required) {
      return NextResponse.json(
        { ok: false, error: 'Insufficient points' },
        { status: 400 }
      );
    }

    // Deduct points and create redemption record
    await sql`
      UPDATE loyalty_points
      SET points = points - ${item.points_required}
      WHERE user_id = ${user.id} OR user_email = ${user.email || user_email}
    `.catch(() => {});

    await sql`
      INSERT INTO loyalty_transactions (user_id, user_email, points, transaction_type, description)
      VALUES (${user.id}, ${user.email || user_email}, ${-item.points_required}, 'redeem', ${`Redeemed: ${item.name}`})
    `.catch(() => {});

    return NextResponse.json({
      ok: true,
      message: 'Redeem successful',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Error redeeming points:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to redeem points' },
      { status: 500 }
    );
  }
}

