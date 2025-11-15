import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { neon } from '@netlify/neon';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for payment methods');
  sql = null;
}

export const dynamic = 'force-dynamic';

// GET - Get user payment methods
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    // If no database, return empty methods
    if (!sql) {
      console.log('Database not available, using fallback payment methods');
      return NextResponse.json({
        ok: true,
        methods: [],
      });
    }

    try {
      // Create payment methods table if not exists
      await sql`
        CREATE TABLE IF NOT EXISTS user_payment_methods (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          user_email VARCHAR(255),
          type VARCHAR(50) NOT NULL,
          last4 VARCHAR(4),
          brand VARCHAR(50),
          expiry_month INTEGER,
          expiry_year INTEGER,
          paypal_email VARCHAR(255),
          is_default BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `.catch(() => {});

      const methods = await sql`
        SELECT id, type, last4, brand, expiry_month, expiry_year, paypal_email, is_default
        FROM user_payment_methods
        WHERE user_id = ${user.id} OR user_email = ${user.email}
        ORDER BY is_default DESC, created_at DESC
      `.catch(() => []);

      return NextResponse.json({
        ok: true,
        methods: methods.map((m: any) => ({
          id: m.id.toString(),
          type: m.type,
          last4: m.last4,
          brand: m.brand,
          expiry_month: m.expiry_month,
          expiry_year: m.expiry_year,
          paypal_email: m.paypal_email,
          is_default: m.is_default,
        })),
      });
    } catch (dbError: any) {
      console.error('Database error fetching payment methods:', dbError);
      return NextResponse.json({
        ok: true,
        methods: [],
      });
    }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Error fetching payment methods:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch payment methods' },
      { status: 500 }
    );
  }
}

