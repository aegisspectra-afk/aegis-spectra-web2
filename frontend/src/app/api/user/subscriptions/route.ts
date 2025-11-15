import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { neon } from '@netlify/neon';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for subscriptions');
  sql = null;
}

export const dynamic = 'force-dynamic';

// GET - Get user subscriptions
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    // If no database, return empty subscriptions
    if (!sql) {
      console.log('Database not available, using fallback subscriptions');
      return NextResponse.json({
        ok: true,
        subscriptions: [],
      });
    }

    try {
      // Create subscriptions table if not exists
      await sql`
        CREATE TABLE IF NOT EXISTS user_subscriptions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          user_email VARCHAR(255),
          plan_name VARCHAR(255) NOT NULL,
          plan_type VARCHAR(50) NOT NULL,
          status VARCHAR(50) DEFAULT 'active',
          price INTEGER NOT NULL,
          billing_cycle VARCHAR(50) NOT NULL,
          start_date TIMESTAMP DEFAULT NOW(),
          end_date TIMESTAMP,
          next_billing_date TIMESTAMP,
          features JSONB,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `.catch(() => {});

      const subscriptions = await sql`
        SELECT id, plan_name, plan_type, status, price, billing_cycle, 
               start_date, end_date, next_billing_date, features
        FROM user_subscriptions
        WHERE user_id = ${user.id} OR user_email = ${user.email}
        ORDER BY created_at DESC
      `.catch(() => []);

      return NextResponse.json({
        ok: true,
        subscriptions: subscriptions.map((s: any) => ({
          id: s.id.toString(),
          plan_name: s.plan_name,
          plan_type: s.plan_type,
          status: s.status,
          price: s.price,
          billing_cycle: s.billing_cycle,
          start_date: s.start_date,
          end_date: s.end_date,
          next_billing_date: s.next_billing_date,
          features: s.features || [],
        })),
      });
    } catch (dbError: any) {
      console.error('Database error fetching subscriptions:', dbError);
      return NextResponse.json({
        ok: true,
        subscriptions: [],
      });
    }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

