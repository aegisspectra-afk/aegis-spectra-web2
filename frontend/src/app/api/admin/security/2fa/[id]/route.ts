/**
 * Admin 2FA User API - Update 2FA status
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// PATCH - Update 2FA status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const { enabled } = body;

    const [updatedUser] = await sql`
      UPDATE users
      SET 
        two_factor_enabled = ${enabled},
        updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING id, email, name, two_factor_enabled
    `.catch(() => []);

    if (!updatedUser) {
      return NextResponse.json(
        { ok: false, error: 'User not found' },
        { status: 404 }
      );
    }

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.USER_UPDATED,
      'user',
      id,
      { action: '2fa_toggle', enabled },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      user: updatedUser,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error updating 2FA:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update 2FA' },
      { status: 500 }
    );
  }
}

