/**
 * Admin Login API
 */
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // TODO: Implement proper authentication
    // For now, use environment variables or hardcoded admin credentials
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@aegis-spectra.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Generate token (in production, use JWT)
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
      
      // Set cookie
      const response = NextResponse.json({
        success: true,
        token,
        message: 'התחברות הצליחה',
      });

      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'אימייל או סיסמה שגויים',
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'שגיאה בהתחברות',
      },
      { status: 500 }
    );
  }
}

