import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { neon } from '@netlify/neon';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for activity');
  sql = null;
}

export const dynamic = 'force-dynamic';

// GET - Get user activity log
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = request.nextUrl;
    const filter = searchParams.get('filter') || 'all';

    // If no database, return empty activities
    if (!sql) {
      console.log('Database not available, using fallback activity');
      return NextResponse.json({
        ok: true,
        activities: [],
      });
    }

    try {
      // Create activity log table if not exists
      await sql`
        CREATE TABLE IF NOT EXISTS user_activity_log (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          user_email VARCHAR(255),
          action VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL,
          details TEXT,
          ip_address VARCHAR(45),
          created_at TIMESTAMP DEFAULT NOW()
        )
      `.catch(() => {});

      let query = sql`
        SELECT id, action, type, details, ip_address, created_at
        FROM user_activity_log
        WHERE user_id = ${user.id} OR user_email = ${user.email}
      `;

      if (filter !== 'all') {
        query = sql`${query} AND type = ${filter}`;
      }

      query = sql`${query} ORDER BY created_at DESC LIMIT 100`;

      const activities = await query.catch(() => []);

      return NextResponse.json({
        ok: true,
        activities: activities.map((a: any) => ({
          id: a.id.toString(),
          action: a.action,
          type: a.type,
          details: a.details,
          ip_address: a.ip_address,
          created_at: a.created_at,
        })),
      });
    } catch (dbError: any) {
      console.error('Database error fetching activity:', dbError);
      return NextResponse.json({
        ok: true,
        activities: [],
      });
    }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch activity' },
      { status: 500 }
    );
  }
}

