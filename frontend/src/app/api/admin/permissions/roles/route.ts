/**
 * Admin Roles API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get all roles
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const roles = await sql`
      SELECT 
        r.*,
        (SELECT COUNT(*) FROM users WHERE role = r.name) as users_count
      FROM roles r
      ORDER BY r.created_at DESC
    `.catch(() => []);

    return NextResponse.json({
      ok: true,
      roles,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}

// POST - Create new role
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();
    const { name, description, permissions } = body;

    if (!name || !permissions || permissions.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'name and permissions are required' },
        { status: 400 }
      );
    }

    const [newRole] = await sql`
      INSERT INTO roles (name, description, permissions)
      VALUES (${name}, ${description || null}, ${JSON.stringify(permissions)})
      RETURNING *
    `.catch(() => []);

    if (!newRole) {
      return NextResponse.json(
        { ok: false, error: 'Failed to create role' },
        { status: 500 }
      );
    }

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.USER_ROLE_CHANGED,
      'role',
      newRole.id,
      { name, permissions },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      role: newRole,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error creating role:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create role' },
      { status: 500 }
    );
  }
}

