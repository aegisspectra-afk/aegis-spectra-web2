/**
 * User Addresses API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get user addresses
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const addresses = await sql`
      SELECT * FROM user_addresses WHERE user_id = ${user.id} ORDER BY is_default DESC, created_at DESC
    `.catch(() => []);

    return NextResponse.json({
      ok: true,
      addresses,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

