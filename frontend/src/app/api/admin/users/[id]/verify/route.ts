/**
 * Admin User Verification API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// PATCH - Verify user email
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const { verified } = body;

    const [user] = await sql`
      SELECT id, email, email_verified FROM users WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'User not found' },
        { status: 404 }
      );
    }

    await sql`
      UPDATE users
      SET email_verified = ${verified === true || verified === 'true'},
          updated_at = NOW()
      WHERE id = ${parseInt(id)}
    `.catch(() => {
      throw new Error('Failed to update user');
    });

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.USER_UPDATED,
      'user',
      id,
      { action: verified ? 'verified' : 'unverified' },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      message: verified ? 'User verified successfully' : 'User unverified successfully',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error verifying user:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to verify user' },
      { status: 500 }
    );
  }
}

