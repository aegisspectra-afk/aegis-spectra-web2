/**
 * Admin Role API - Get, Update, Delete specific role
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get role by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const [role] = await sql`
      SELECT * FROM roles WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!role) {
      return NextResponse.json(
        { ok: false, error: 'Role not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      role,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching role:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch role' },
      { status: 500 }
    );
  }
}

// PATCH - Update role
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const [currentRole] = await sql`
      SELECT * FROM roles WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!currentRole) {
      return NextResponse.json(
        { ok: false, error: 'Role not found' },
        { status: 404 }
      );
    }

    const { name, description, permissions } = body;

    const [updatedRole] = await sql`
      UPDATE roles
      SET 
        name = COALESCE(${name || null}, name),
        description = COALESCE(${description !== undefined ? description : null}, description),
        permissions = COALESCE(${permissions ? JSON.stringify(permissions) : null}, permissions),
        updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `.catch(() => []);

    if (!updatedRole) {
      return NextResponse.json(
        { ok: false, error: 'Failed to update role' },
        { status: 500 }
      );
    }

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.USER_ROLE_CHANGED,
      'role',
      id,
      { changes: Object.keys(body) },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      role: updatedRole,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error updating role:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update role' },
      { status: 500 }
    );
  }
}

// DELETE - Delete role
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;

    await sql`
      DELETE FROM roles WHERE id = ${parseInt(id)}
    `.catch(() => {
      throw new Error('Failed to delete role');
    });

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.USER_ROLE_CHANGED,
      'role',
      id,
      { action: 'deleted' },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      message: 'Role deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error deleting role:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete role' },
      { status: 500 }
    );
  }
}

