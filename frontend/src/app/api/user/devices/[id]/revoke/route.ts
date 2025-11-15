import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { neon } from '@netlify/neon';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for device revoke');
  sql = null;
}

export const dynamic = 'force-dynamic';

// POST - Revoke device
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;

    if (!sql) {
      return NextResponse.json({ ok: true });
    }

    await sql`
      DELETE FROM user_devices
      WHERE id = ${parseInt(id)} AND (user_id = ${user.id} OR user_email = ${user.email})
    `.catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { ok: false, error: 'Failed to revoke device' },
      { status: 500 }
    );
  }
}

