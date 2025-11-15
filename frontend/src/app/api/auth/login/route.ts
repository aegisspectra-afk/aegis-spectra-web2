import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateToken, generateSessionId, isValidEmail, checkRateLimit, hashPassword } from '@/lib/auth';

// Initialize Neon with fallback
let sql: any;
try {
  sql = neon();
} catch (error) {
  console.warn('Neon client not available, using fallback for login');
  sql = null;
}

// Fallback test user for local development
const FALLBACK_USER = {
  id: 1,
  name: 'משתמש בדיקה',
  email: 'test@example.com',
  phone: '0501234567',
  password_hash: '$2b$12$p5fA.WB.gZCNweMjQfN2R.RRSVPCkMgZI/Mfk7dlwmz6psAzBEamy', // Test123!@#
  role: 'customer',
  email_verified: true,
  api_key_hash: 'df481bbeeafdc87dedb391a15d29b8659d9e93c48875fe9f0ca5296cfe29d361'
};

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
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return NextResponse.json({ 
        ok: false, 
        error: 'אימייל וסיסמה נדרשים' 
      }, { status: 400 });
    }

    // Get client IP and user agent for session tracking
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'אימייל או סיסמה לא תקינים' 
      }, { status: 401 });
    }

    // Find user by email or phone
    let users: any[] = [];
    let user: any = null;

    if (sql) {
      try {
        users = await sql`
          SELECT id, name, email, phone, password_hash, role, email_verified, api_key_hash
          FROM users 
          WHERE email = ${email} OR phone = ${email}
          LIMIT 1
        `;
      } catch (error: any) {
        console.warn('Database query failed, using fallback user:', error.message);
      }
    }

    // Fallback to test user for local development
    if (users.length === 0 && !sql) {
      console.log('Using fallback user for local development');
      if (email === FALLBACK_USER.email || email === FALLBACK_USER.phone) {
        users = [FALLBACK_USER];
      }
    }

    if (users.length === 0) {
      // Don't reveal if user exists - same error message
      return NextResponse.json({ 
        ok: false, 
        error: 'אימייל או סיסמה לא תקינים' 
      }, { status: 401 });
    }

    user = users[0];

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

    // Update last login (only if database is available)
    if (sql) {
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
    }

    // Generate unique session ID for this login
    const sessionId = generateSessionId();
    
    // Calculate expiration time based on "remember me"
    const rememberMeBool = rememberMe === true || rememberMe === 'true';
    const maxAge = rememberMeBool ? 60 * 60 * 24 * 7 : 60 * 60 * 24; // 7 days or 24 hours

    // Generate secure JWT token with session ID
    const token = generateToken(user.id, user.email, user.role, sessionId, rememberMeBool);

    // Create session in database with IP tracking (only if database is available)
    if (sql) {
      await sql`
        CREATE TABLE IF NOT EXISTS sessions (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(255) UNIQUE NOT NULL,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          ip_address VARCHAR(45) NOT NULL,
          user_agent TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          expires_at TIMESTAMP NOT NULL,
          last_used TIMESTAMP DEFAULT NOW(),
          is_active BOOLEAN DEFAULT true
        )
      `.catch(() => {
        // Table might already exist
      });

      // Insert session into database
      const expiresAt = new Date(Date.now() + maxAge * 1000);
      await sql`
        INSERT INTO sessions (session_id, user_id, ip_address, user_agent, expires_at, created_at, last_used, is_active)
        VALUES (${sessionId}, ${user.id}, ${clientIp}, ${userAgent}, ${expiresAt.toISOString()}, NOW(), NOW(), true)
        ON CONFLICT (session_id) DO UPDATE SET
          last_used = NOW(),
          is_active = true,
          expires_at = ${expiresAt.toISOString()}
      `.catch((error: any) => {
        console.error('Error creating session:', error);
        // Continue anyway - session might exist
      });
    }

    // Create response with JSON data
    const response = NextResponse.json({ 
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

    // Set httpOnly cookie for security (server-side only)
    response.cookies.set('user_token', token, {
      maxAge: maxAge, // Based on "remember me" selection
      path: '/',
      httpOnly: true, // Prevent XSS attacks
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'lax', // CSRF protection
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    // Don't leak error details
    return NextResponse.json({ 
      ok: false, 
      error: 'התחברות נכשלה. אנא נסה שוב מאוחר יותר' 
    }, { status: 500 });
  }
}

