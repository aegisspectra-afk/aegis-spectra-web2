import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for loyalty points');
  sql = null;
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aegis2024';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const providedPassword = authHeader?.replace('Bearer ', '');
  return providedPassword === ADMIN_PASSWORD;
}

// GET - Get loyalty points for user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get('user_id');
    const userEmail = searchParams.get('user_email');

    if (!userId && !userEmail) {
      return NextResponse.json(
        { ok: false, error: 'user_id or user_email is required' },
        { status: 400 }
      );
    }

    // If no database, return fallback data
    if (!sql) {
      console.log('Database not available, using fallback loyalty points');
      return NextResponse.json({
        ok: true,
        points: {
          user_id: userId ? parseInt(userId) : null,
          user_email: userEmail || null,
          points: 0,
          tier: 'Bronze',
          total_earned: 0,
          total_redeemed: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        recent_transactions: []
      });
    }

    let points;
    try {
      if (userId) {
        [points] = await sql`
          SELECT * FROM loyalty_points WHERE user_id = ${parseInt(userId)} LIMIT 1
        `;
      } else {
        [points] = await sql`
          SELECT * FROM loyalty_points WHERE user_email = ${userEmail} LIMIT 1
        `;
      }

      if (!points) {
        // Create new loyalty account
        if (userId) {
          [points] = await sql`
            INSERT INTO loyalty_points (user_id, points, tier)
            VALUES (${parseInt(userId)}, 0, 'Bronze')
            RETURNING *
          `;
        } else {
          [points] = await sql`
            INSERT INTO loyalty_points (user_email, points, tier)
            VALUES (${userEmail}, 0, 'Bronze')
            RETURNING *
          `;
        }
      }

      // Get recent transactions
      const transactions = await sql`
        SELECT * FROM loyalty_transactions
        WHERE ${userId ? sql`user_id = ${parseInt(userId)}` : sql`user_email = ${userEmail}`}
        ORDER BY created_at DESC
        LIMIT 10
      `;

      return NextResponse.json({
        ok: true,
        points,
        recent_transactions: transactions
      });
    } catch (dbError: any) {
      console.error('Database error fetching loyalty points:', dbError);
      // Return fallback data on database error
      return NextResponse.json({
        ok: true,
        points: {
          user_id: userId ? parseInt(userId) : null,
          user_email: userEmail || null,
          points: 0,
          tier: 'Bronze',
          total_earned: 0,
          total_redeemed: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        recent_transactions: []
      });
    }
  } catch (error: any) {
    console.error('Error fetching loyalty points:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch loyalty points' },
      { status: 500 }
    );
  }
}

// POST - Add loyalty points (admin or system)
export async function POST(request: NextRequest) {
  try {
    // Can be called by system after order completion
    const body = await request.json();
    const { user_id, user_email, points, transaction_type, description, order_id, expires_at } = body;

    if (!user_id && !user_email) {
      return NextResponse.json(
        { ok: false, error: 'user_id or user_email is required' },
        { status: 400 }
      );
    }

    if (!points || points <= 0) {
      return NextResponse.json(
        { ok: false, error: 'points must be positive' },
        { status: 400 }
      );
    }

    // Use database function to add points
    const result = await sql`
      SELECT add_loyalty_points(
        ${user_id || null},
        ${user_email || null},
        ${points},
        ${transaction_type || 'bonus'},
        ${description || null},
        ${order_id || null},
        ${expires_at || null}
      ) as result
    `;

    const resultData = result[0]?.result;

    if (!resultData || !resultData.success) {
      return NextResponse.json(
        { ok: false, error: 'Failed to add loyalty points' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      points: resultData.points,
      total_earned: resultData.total_earned,
      tier: resultData.tier
    });
  } catch (error: any) {
    console.error('Error adding loyalty points:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to add loyalty points' },
      { status: 500 }
    );
  }
}

