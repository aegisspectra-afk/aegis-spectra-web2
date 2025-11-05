import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, isAdmin } from '@/lib/auth-server';

const sql = neon();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: 'אימייל וסיסמה נדרשים' },
        { status: 400 }
      );
    }

    // Authenticate user
    const authResult = await authenticateUser(email, password);

    if (!authResult.ok || !authResult.user) {
      return NextResponse.json(
        { ok: false, error: authResult.error || 'שגיאה בהתחברות' },
        { status: 401 }
      );
    }

    // Check if user has admin/manager role
    if (!isAdmin(authResult.user) && authResult.user.role !== 'manager') {
      return NextResponse.json(
        { ok: false, error: 'אין הרשאות גישה לדשבורד מנהל' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      ok: true,
      user: authResult.user,
      token: authResult.token,
    });
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { ok: false, error: 'שגיאה בהתחברות' },
      { status: 500 }
    );
  }
}

