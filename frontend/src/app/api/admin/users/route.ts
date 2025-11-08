import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { hashPassword } from '@/lib/auth';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

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

// POST - Create new user (admin only)
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();

    const { name, email, phone, password, role } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const [existingUser] = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase()} OR phone = ${phone}
      LIMIT 1
    `.catch(() => []);

    if (existingUser) {
      return NextResponse.json(
        { ok: false, error: 'User with this email or phone already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const [newUser] = await sql`
      INSERT INTO users (name, email, phone, password_hash, role)
      VALUES (${name}, ${email.toLowerCase()}, ${phone}, ${passwordHash}, ${role || 'customer'})
      RETURNING id, name, email, phone, role, email_verified, created_at
    `.catch(() => []);

    if (!newUser) {
      return NextResponse.json(
        { ok: false, error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Create audit log
    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.USER_CREATED,
      'user',
      newUser.id,
      { email: newUser.email, role: newUser.role },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      user: newUser,
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error creating user:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

