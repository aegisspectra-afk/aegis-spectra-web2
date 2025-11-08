/**
 * Admin 2FA Management API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get all users with 2FA status
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const users = await sql`
      SELECT 
        id, email, name, two_factor_enabled, last_login
      FROM users
      WHERE role IN ('admin', 'manager', 'super_admin')
      ORDER BY two_factor_enabled DESC, email ASC
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

    console.error('Error fetching 2FA users:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch 2FA users' },
      { status: 500 }
    );
  }
}

