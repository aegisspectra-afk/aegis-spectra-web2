import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, isStrongPassword, checkRateLimit } from '@/lib/auth';

const sql = neon();

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(`reset-password:${clientId}`, 5, 60 * 60 * 1000)) { // 5 attempts per hour
      return NextResponse.json({ 
        ok: false, 
        error: 'יותר מדי ניסיונות. אנא נסה שוב בעוד שעה' 
      }, { status: 429 });
    }

    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Token וסיסמה נדרשים' 
      }, { status: 400 });
    }

    // Validate password strength
    const passwordValidation = isStrongPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({ 
        ok: false, 
        error: passwordValidation.errors[0] || 'סיסמה לא חזקה מספיק' 
      }, { status: 400 });
    }

    // Find user by reset token
    const users = await sql`
      SELECT id, email, password_reset_expires
      FROM users 
      WHERE password_reset_token = ${token}
      AND password_reset_expires > NOW()
      LIMIT 1
    `.catch(() => []);

    if (users.length === 0) {
      return NextResponse.json({ 
        ok: false, 
        error: 'קישור לא תקין או פג תוקף' 
      }, { status: 400 });
    }

    const user = users[0];

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update password and clear reset token
    await sql`
      UPDATE users 
      SET password_hash = ${hashedPassword},
          password_reset_token = NULL,
          password_reset_expires = NULL,
          updated_at = NOW()
      WHERE id = ${user.id}
    `;

    return NextResponse.json({ 
      ok: true, 
      message: 'סיסמה עודכנה בהצלחה' 
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'שגיאה באיפוס סיסמה' 
    }, { status: 500 });
  }
}

