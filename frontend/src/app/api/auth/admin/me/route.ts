/**
 * Admin Me API - Get current admin user info
 */
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || 
                  request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Decode token (simple base64 token for now)
    // In production, use JWT verification
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [email] = decoded.split(':');
      
      // For now, just return user info based on token
      // In production, verify token and get user from database
      return NextResponse.json({
        ok: true,
        user: {
          id: 1,
          name: 'Admin',
          email: email || 'admin@aegis-spectra.com',
          role: 'admin',
        },
      });
    } catch (decodeError) {
      return NextResponse.json(
        { ok: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('Admin me error:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

