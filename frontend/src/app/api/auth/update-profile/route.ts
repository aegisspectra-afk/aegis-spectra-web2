import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, isValidEmail, isValidPhone } from '@/lib/auth';

const sql = neon();

export async function PUT(request: NextRequest) {
  try {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || 
                  request.cookies.get('user_token')?.value;

    if (!token) {
      return NextResponse.json({ 
        ok: false, 
        error: 'לא מאומת' 
      }, { status: 401 });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded || !decoded.sessionId) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Token לא תקין או פג תוקף' 
      }, { status: 401 });
    }

    // Verify session exists and is active
    const sessions = await sql`
      SELECT id, user_id, is_active, expires_at
      FROM sessions 
      WHERE session_id = ${decoded.sessionId} 
      AND is_active = true
      AND expires_at > NOW()
      LIMIT 1
    `.catch(() => []);

    if (sessions.length === 0 || sessions[0].user_id !== decoded.userId) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Session לא תקין' 
      }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone } = body;

    // Validate input
    if (!name || !name.trim()) {
      return NextResponse.json({ 
        ok: false, 
        error: 'שם מלא נדרש' 
      }, { status: 400 });
    }

    if (email && !isValidEmail(email)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'אימייל לא תקין' 
      }, { status: 400 });
    }

    if (phone && !isValidPhone(phone)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'מספר טלפון לא תקין' 
      }, { status: 400 });
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUsers = await sql`
        SELECT id FROM users 
        WHERE email = ${email} AND id != ${decoded.userId}
        LIMIT 1
      `.catch(() => []);

      if (existingUsers.length > 0) {
        return NextResponse.json({ 
          ok: false, 
          error: 'אימייל זה כבר בשימוש' 
        }, { status: 400 });
      }
    }

    // Check if phone is already taken by another user
    if (phone) {
      const existingUsers = await sql`
        SELECT id FROM users 
        WHERE phone = ${phone} AND id != ${decoded.userId}
        LIMIT 1
      `.catch(() => []);

      if (existingUsers.length > 0) {
        return NextResponse.json({ 
          ok: false, 
          error: 'מספר טלפון זה כבר בשימוש' 
        }, { status: 400 });
      }
    }

    // Update user profile
    await sql`
      UPDATE users 
      SET name = ${name.trim()},
          email = ${email || null},
          phone = ${phone || null},
          updated_at = NOW()
      WHERE id = ${decoded.userId}
    `;

    // Get updated user
    const users = await sql`
      SELECT id, name, email, phone, role, email_verified, created_at, updated_at
      FROM users 
      WHERE id = ${decoded.userId}
      LIMIT 1
    `.catch(() => []);

    if (users.length === 0) {
      return NextResponse.json({ 
        ok: false, 
        error: 'משתמש לא נמצא' 
      }, { status: 404 });
    }

    const updatedUser = users[0];

    return NextResponse.json({ 
      ok: true, 
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        emailVerified: updatedUser.email_verified || false,
        createdAt: updatedUser.created_at,
        updatedAt: updatedUser.updated_at,
      }
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'שגיאה בעדכון פרופיל' 
    }, { status: 500 });
  }
}

