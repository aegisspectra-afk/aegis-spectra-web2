import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateToken, isValidEmail, checkRateLimit } from '@/lib/auth';

const sql = neon();

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - prevent brute force attacks
    const clientId = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(`login:${clientId}`, 5, 15 * 60 * 1000)) { // 5 attempts per 15 minutes
      return NextResponse.json({ 
        ok: false, 
        error: 'יותר מדי ניסיונות התחברות. אנא נסה שוב בעוד 15 דקות' 
      }, { status: 429 });
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ 
        ok: false, 
        error: 'אימייל וסיסמה נדרשים' 
      }, { status: 400 });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'אימייל או סיסמה לא תקינים' 
      }, { status: 401 });
    }

    // Find user by email or phone
    const users = await sql`
      SELECT id, name, email, phone, password_hash, role, email_verified, api_key_hash
      FROM users 
      WHERE email = ${email} OR phone = ${email}
      LIMIT 1
    `.catch(() => []);

    if (users.length === 0) {
      // Don't reveal if user exists - same error message
      return NextResponse.json({ 
        ok: false, 
        error: 'אימייל או סיסמה לא תקינים' 
      }, { status: 401 });
    }

    const user = users[0];

    // Verify password securely using bcrypt
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    
    if (!isPasswordValid) {
      return NextResponse.json({ 
        ok: false, 
        error: 'אימייל או סיסמה לא תקינים' 
      }, { status: 401 });
    }

    // Check if email is verified (optional - can be required)
    if (!user.email_verified) {
      // Allow login but warn user
      console.warn(`User ${user.id} logged in with unverified email`);
    }

    // Update last login
    await sql`
      UPDATE users 
      SET last_login = NOW(), updated_at = NOW()
      WHERE id = ${user.id}
    `.catch(() => {
      // Ignore if update fails
    });

    // Update API key last used
    if (user.api_key_hash) {
      await sql`
        UPDATE api_keys 
        SET last_used = NOW()
        WHERE api_key_hash = ${user.api_key_hash}
      `.catch(() => {
        // Ignore if update fails
      });
    }

    // Generate secure JWT token
    const token = generateToken(user.id, user.email, user.role);

    return NextResponse.json({ 
      ok: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        emailVerified: user.email_verified || false,
      },
      token,
      message: user.email_verified ? undefined : 'אנא אמת את האימייל שלך'
    });
  } catch (error: any) {
    console.error('Login error:', error);
    // Don't leak error details
    return NextResponse.json({ 
      ok: false, 
      error: 'התחברות נכשלה. אנא נסה שוב מאוחר יותר' 
    }, { status: 500 });
  }
}

