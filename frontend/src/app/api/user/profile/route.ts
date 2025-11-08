/**
 * User Profile API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get user profile
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const [userData] = await sql`
      SELECT id, name, email, phone FROM users WHERE id = ${user.id} LIMIT 1
    `.catch(() => []);

    if (!userData) {
      return NextResponse.json(
        { ok: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      user: userData,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

