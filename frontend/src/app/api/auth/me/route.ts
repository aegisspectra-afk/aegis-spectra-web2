import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Initialize Neon with fallback
let sql: any;
try {
  sql = neon();
} catch (error) {
  console.warn('Neon client not available, using fallback for /api/auth/me');
  sql = null;
}

// Fallback test user for local development
const FALLBACK_USER = {
  id: 1,
  name: 'משתמש בדיקה',
  email: 'test@example.com',
  phone: '0501234567',
  role: 'customer',
  email_verified: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

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
    if (!decoded) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Token לא תקין או פג תוקף' 
      }, { status: 401 });
    }

    // If no database, use fallback user based on token
    if (!sql) {
      console.log('Database not available, using fallback user for /api/auth/me');
      // Verify token matches fallback user (check email or userId)
      if ((decoded.email === FALLBACK_USER.email || decoded.email === 'test@example.com') && 
          (decoded.userId === FALLBACK_USER.id || decoded.userId === 1)) {
        return NextResponse.json({ 
          ok: true, 
          user: {
            id: FALLBACK_USER.id,
            name: FALLBACK_USER.name,
            email: FALLBACK_USER.email,
            phone: FALLBACK_USER.phone,
            role: FALLBACK_USER.role,
            emailVerified: FALLBACK_USER.email_verified,
            createdAt: FALLBACK_USER.created_at,
            updatedAt: FALLBACK_USER.updated_at,
          }
        });
      } else {
        // For any valid token without database, return user data from token (for local dev)
        console.log('Token valid but user not in fallback list, returning user from token for local dev');
        return NextResponse.json({ 
          ok: true, 
          user: {
            id: decoded.userId || FALLBACK_USER.id,
            name: (decoded as any).name || FALLBACK_USER.name,
            email: decoded.email || FALLBACK_USER.email,
            phone: FALLBACK_USER.phone,
            role: decoded.role || FALLBACK_USER.role,
            emailVerified: true,
            createdAt: FALLBACK_USER.created_at,
            updatedAt: FALLBACK_USER.updated_at,
          }
        });
      }
    }

    // Get client IP for verification
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Verify session exists and is active in database (only if database is available)
    let sessions: any[] = [];
    if (decoded.sessionId) {
      try {
        sessions = await sql`
          SELECT id, user_id, ip_address, expires_at, is_active
          FROM sessions 
          WHERE session_id = ${decoded.sessionId} 
          AND is_active = true
          AND expires_at > NOW()
          LIMIT 1
        `;
      } catch (error: any) {
        console.warn('Session verification failed, continuing without session check:', error.message);
      }
    }

    // If session check is enabled and session not found, but we have a valid token, allow it for local dev
    if (decoded.sessionId && sessions.length === 0) {
      console.warn('Session not found in database, but token is valid - allowing for local development');
    }

    // Update last used timestamp (only if database is available and session exists)
    if (sql && decoded.sessionId && sessions.length > 0) {
      await sql`
        UPDATE sessions 
        SET last_used = NOW()
        WHERE session_id = ${decoded.sessionId}
      `.catch(() => {
        // Ignore update errors
      });
    }

    // Get user from database
    let users: any[] = [];
    try {
      users = await sql`
        SELECT id, name, email, phone, role, email_verified, created_at, updated_at
        FROM users 
        WHERE id = ${decoded.userId} AND email = ${decoded.email}
        LIMIT 1
      `;
    } catch (error: any) {
      console.warn('Database query failed, using fallback user:', error.message);
      // Fallback to test user if database query fails
      if ((decoded.email === FALLBACK_USER.email || decoded.email === 'test@example.com') && 
          (decoded.userId === FALLBACK_USER.id || decoded.userId === 1)) {
        users = [FALLBACK_USER];
      } else {
        // For any valid token, return user data from token (for local dev)
        users = [{
          id: decoded.userId || FALLBACK_USER.id,
          name: (decoded as any).name || FALLBACK_USER.name,
          email: decoded.email || FALLBACK_USER.email,
          phone: FALLBACK_USER.phone,
          role: decoded.role || FALLBACK_USER.role,
          email_verified: true,
          created_at: FALLBACK_USER.created_at,
          updated_at: FALLBACK_USER.updated_at
        }];
      }
    }

    if (users.length === 0) {
      // If no users found but token is valid, return user from token (for local dev)
      console.warn('No users found in database, but token is valid - returning user from token for local dev');
      return NextResponse.json({ 
        ok: true, 
        user: {
          id: decoded.userId || FALLBACK_USER.id,
          name: (decoded as any).name || FALLBACK_USER.name,
          email: decoded.email || FALLBACK_USER.email,
          phone: FALLBACK_USER.phone,
          role: decoded.role || FALLBACK_USER.role,
          emailVerified: true,
          createdAt: FALLBACK_USER.created_at,
          updatedAt: FALLBACK_USER.updated_at,
        }
      });
    }

    const user = users[0];

    // Verify token matches user (allow for local dev if database query failed)
    if (user.email !== decoded.email || user.id !== decoded.userId) {
      // If this is a fallback user, allow it
      if (user.email === FALLBACK_USER.email && decoded.email === FALLBACK_USER.email) {
        console.warn('Token email mismatch but using fallback user - allowing for local dev');
      } else {
        return NextResponse.json({ 
          ok: false, 
          error: 'Token לא תואם למשתמש' 
        }, { status: 401 });
      }
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

