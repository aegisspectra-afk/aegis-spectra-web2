import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { neon } from '@netlify/neon';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for invoices');
  sql = null;
}

export const dynamic = 'force-dynamic';

// GET - Get user invoices
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status') || 'all';

    // If no database, return empty invoices
    if (!sql) {
      console.log('Database not available, using fallback invoices');
      return NextResponse.json({
        ok: true,
        invoices: [],
      });
    }

    try {
      // Create invoices table if not exists
      await sql`
        CREATE TABLE IF NOT EXISTS invoices (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          user_email VARCHAR(255),
          order_id VARCHAR(255) NOT NULL,
          invoice_number VARCHAR(255) UNIQUE NOT NULL,
          total INTEGER NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT NOW(),
          due_date TIMESTAMP
        )
      `.catch(() => {});

      let query = sql`
        SELECT id, order_id, invoice_number, total, status, created_at, due_date
        FROM invoices
        WHERE user_id = ${user.id} OR user_email = ${user.email}
      `;

      if (status !== 'all') {
        query = sql`${query} AND status = ${status}`;
      }

      query = sql`${query} ORDER BY created_at DESC LIMIT 100`;

      const invoices = await query.catch(() => []);

      return NextResponse.json({
        ok: true,
        invoices: invoices.map((inv: any) => ({
          id: inv.id.toString(),
          order_id: inv.order_id,
          invoice_number: inv.invoice_number,
          total: inv.total,
          status: inv.status,
          created_at: inv.created_at,
          due_date: inv.due_date,
        })),
      });
    } catch (dbError: any) {
      console.error('Database error fetching invoices:', dbError);
      return NextResponse.json({
        ok: true,
        invoices: [],
      });
    }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

