import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

const sql = neon();

// PATCH - Update user role (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const userId = parseInt(id);

    const body = await request.json();
    const { role } = body;

    if (!role || !['customer', 'support', 'manager', 'admin', 'super_admin'].includes(role)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Don't allow changing super_admin unless current user is super_admin
    if (role === 'super_admin' && admin.role !== 'super_admin') {
      return NextResponse.json(
        { ok: false, error: 'Only super_admin can assign super_admin role' },
        { status: 403 }
      );
    }

    // Don't allow demoting super_admin
    const [currentUser] = await sql`
      SELECT role FROM users WHERE id = ${userId} LIMIT 1
    `.catch(() => []);

    if (currentUser && currentUser.role === 'super_admin' && role !== 'super_admin' && admin.role !== 'super_admin') {
      return NextResponse.json(
        { ok: false, error: 'Cannot demote super_admin' },
        { status: 403 }
      );
    }

    await sql`
      UPDATE users
      SET role = ${role}, updated_at = NOW()
      WHERE id = ${userId}
    `;

    return NextResponse.json({
      ok: true,
      message: 'Role updated successfully',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error updating user role:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}

