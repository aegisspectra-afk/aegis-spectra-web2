import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { neon } from '@netlify/neon';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for notifications');
  sql = null;
}

export const dynamic = 'force-dynamic';

// GET - Get user notifications
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    // If no database, return empty notifications
    if (!sql) {
      console.log('Database not available, using fallback notifications');
      return NextResponse.json({
        ok: true,
        notifications: [],
      });
    }

    try {
      // Create notifications table if not exists
      await sql`
        CREATE TABLE IF NOT EXISTS user_notifications (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          user_email VARCHAR(255),
          type VARCHAR(50) NOT NULL,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          read BOOLEAN DEFAULT false,
          action_url VARCHAR(500),
          created_at TIMESTAMP DEFAULT NOW()
        )
      `.catch(() => {});

      const notifications = await sql`
        SELECT id, type, title, message, read, action_url, created_at
        FROM user_notifications
        WHERE user_id = ${user.id} OR user_email = ${user.email}
        ORDER BY created_at DESC
        LIMIT 50
      `.catch(() => []);

      return NextResponse.json({
        ok: true,
        notifications: notifications.map((n: any) => ({
          id: n.id.toString(),
          type: n.type,
          title: n.title,
          message: n.message,
          read: n.read,
          action_url: n.action_url,
          created_at: n.created_at,
        })),
      });
    } catch (dbError: any) {
      console.error('Database error fetching notifications:', dbError);
      return NextResponse.json({
        ok: true,
        notifications: [],
      });
    }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

