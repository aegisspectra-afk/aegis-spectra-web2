import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

const sql = neon();

// GET - Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);

    const users = await sql`
      SELECT id, name, email, phone, role, email_verified, created_at, last_login
      FROM users
      ORDER BY created_at DESC
    `.catch(() => []);

    return NextResponse.json({
      ok: true,
      users,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching users:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

