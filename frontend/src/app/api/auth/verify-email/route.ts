import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Token לא תקין' 
      }, { status: 400 });
    }

    // Find user by verification token
    const users = await sql`
      SELECT id, email, email_verified
      FROM users 
      WHERE email_verification_token = ${token}
      LIMIT 1
    `.catch(() => []);

    if (users.length === 0) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Token לא תקין או פג תוקף' 
      }, { status: 400 });
    }

    const user = users[0];

    if (user.email_verified) {
      return NextResponse.json({ 
        ok: true, 
        message: 'האימייל כבר מאומת' 
      });
    }

    // Verify email
    await sql`
      UPDATE users 
      SET email_verified = true, 
          email_verification_token = NULL,
          updated_at = NOW()
      WHERE id = ${user.id}
    `;

    return NextResponse.json({ 
      ok: true, 
      message: 'האימייל אומת בהצלחה!' 
    });
  } catch (error: any) {
    console.error('Email verification error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'אימות אימייל נכשל' 
    }, { status: 500 });
  }
}

