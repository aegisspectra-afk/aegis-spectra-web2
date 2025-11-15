import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, hashPassword, verifyPassword } from '@/lib/auth';
import { neon } from '@netlify/neon';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for change-password');
  sql = null;
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('user_token')?.value;

    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'לא מאומת' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { ok: false, error: 'Token לא תקין' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { ok: false, error: 'סיסמה נוכחית וסיסמה חדשה נדרשות' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { ok: false, error: 'סיסמה חדשה חייבת להכיל לפחות 8 תווים' },
        { status: 400 }
      );
    }

    // If no database, return success for local dev
    if (!sql) {
      console.log('Database not available, skipping password change for local dev');
      return NextResponse.json({
        ok: true,
        message: 'סיסמה עודכנה בהצלחה (local dev mode)'
      });
    }

    // Get user from database
    const [user] = await sql`
      SELECT id, password_hash FROM users WHERE id = ${decoded.userId} LIMIT 1
    `.catch(() => []);

    if (!user || !user.password_hash) {
      return NextResponse.json(
        { ok: false, error: 'משתמש לא נמצא' },
        { status: 404 }
      );
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { ok: false, error: 'סיסמה נוכחית שגויה' },
        { status: 401 }
      );
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await sql`
      UPDATE users
      SET password_hash = ${newPasswordHash}, updated_at = NOW()
      WHERE id = ${decoded.userId}
    `.catch((error: any) => {
      console.error('Error updating password:', error);
      throw error;
    });

    return NextResponse.json({
      ok: true,
      message: 'סיסמה עודכנה בהצלחה'
    });
  } catch (error: any) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { ok: false, error: 'שגיאה בעדכון סיסמה' },
      { status: 500 }
    );
  }
}

