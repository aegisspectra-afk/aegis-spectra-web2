import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const sql = neon();

export async function GET(request: NextRequest) {
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

    // Get client IP for verification
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Verify session exists and is active in database
    const sessions = await sql`
      SELECT id, user_id, ip_address, expires_at, is_active
      FROM sessions 
      WHERE session_id = ${decoded.sessionId} 
      AND is_active = true
      AND expires_at > NOW()
      LIMIT 1
    `.catch(() => []);

    if (sessions.length === 0) {
      // Session expired or invalid
      return NextResponse.json({ 
        ok: false, 
        error: 'Session פג תוקף או לא תקין' 
      }, { status: 401 });
    }

    const session = sessions[0];

    // Verify session belongs to user
    if (session.user_id !== decoded.userId) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Session לא תואם למשתמש' 
      }, { status: 401 });
    }

    // Update last used timestamp
    await sql`
      UPDATE sessions 
      SET last_used = NOW()
      WHERE session_id = ${decoded.sessionId}
    `.catch(() => {
      // Ignore update errors
    });

    // Get user from database
    const users = await sql`
      SELECT id, name, email, phone, role, email_verified, created_at, updated_at
      FROM users 
      WHERE id = ${decoded.userId} AND email = ${decoded.email}
      LIMIT 1
    `.catch(() => []);

    if (users.length === 0) {
      return NextResponse.json({ 
        ok: false, 
        error: 'משתמש לא נמצא' 
      }, { status: 404 });
    }

    const user = users[0];

    // Verify token matches user
    if (user.email !== decoded.email || user.id !== decoded.userId) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Token לא תואם למשתמש' 
      }, { status: 401 });
    }

    return NextResponse.json({ 
      ok: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        emailVerified: user.email_verified || false,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      }
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'שגיאה בטעינת פרטי משתמש' 
    }, { status: 500 });
  }
}

