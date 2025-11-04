import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const sql = neon();

export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || 
                  request.cookies.get('user_token')?.value;

    // Verify token and invalidate session
    if (token) {
      const decoded = verifyToken(token);
      if (decoded && decoded.sessionId) {
        // Invalidate session in database
        await sql`
          UPDATE sessions 
          SET is_active = false, last_used = NOW()
          WHERE session_id = ${decoded.sessionId}
        `.catch(() => {
          // Ignore errors
        });

        console.log(`User ${decoded.userId} logged out - session ${decoded.sessionId} invalidated`);
      }
    }

    // Clear token cookie
    const response = NextResponse.json({ 
      ok: true, 
      message: 'התנתקות בוצעה בהצלחה' 
    });

    // Clear cookie
    response.cookies.delete('user_token');
    response.cookies.set('user_token', '', {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    // Even if there's an error, clear the cookie
    const response = NextResponse.json({ 
      ok: true, 
      message: 'התנתקות בוצעה' 
    });
    response.cookies.delete('user_token');
    return response;
  }
}

