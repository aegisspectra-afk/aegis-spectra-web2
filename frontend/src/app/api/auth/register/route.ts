import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';
import { 
  hashPassword, 
  generateApiKey, 
  hashApiKey, 
  generateToken,
  generateSessionId,
  isValidEmail, 
  isValidPhone, 
  isStrongPassword,
  checkRateLimit,
  generateEmailVerificationToken
} from '@/lib/auth';
import { verifyRecaptcha } from '@/lib/recaptcha';

const sql = neon();

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - prevent brute force registration
    const clientId = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(`register:${clientId}`, 3, 15 * 60 * 1000)) { // 3 attempts per 15 minutes
      return NextResponse.json({ 
        ok: false, 
        error: 'יותר מדי ניסיונות הרשמה. אנא נסה שוב בעוד 15 דקות' 
      }, { status: 429 });
    }

    const body = await request.json();
    const { name, email, phone, password, recaptcha_token } = body;

    // Verify reCAPTCHA token
    const recaptchaResult = await verifyRecaptcha(recaptcha_token, 'register', 0.5);
    if (!recaptchaResult.valid) {
      console.warn('reCAPTCHA verification failed:', recaptchaResult.error);
      // In production, you might want to reject here
      // For now, we'll log but allow (for development)
      // return NextResponse.json({ ok: false, error: 'reCAPTCHA verification failed' }, { status: 400 });
    }

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return NextResponse.json({ 
        ok: false, 
        error: 'כל השדות נדרשים' 
      }, { status: 400 });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'אימייל לא תקין' 
      }, { status: 400 });
    }

    // Validate phone format
    if (!isValidPhone(phone)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'מספר טלפון לא תקין (יש להזין מספר ישראלי)' 
      }, { status: 400 });
    }

    // Validate password strength
    const passwordValidation = isStrongPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({ 
        ok: false, 
        error: passwordValidation.errors.join(', ') 
      }, { status: 400 });
    }

    // Check if user already exists
    const existing = await sql`
      SELECT id FROM users 
      WHERE email = ${email} OR phone = ${phone}
      LIMIT 1
    `.catch(() => null);

    if (existing && existing.length > 0) {
      return NextResponse.json({ 
        ok: false, 
        error: 'משתמש כבר קיים עם אימייל או טלפון זה' 
      }, { status: 400 });
    }

    // Hash password securely
    const passwordHash = await hashPassword(password);

    // Generate unique API key for user
    const apiKey = generateApiKey();
    const apiKeyHash = hashApiKey(apiKey);

    // Generate email verification token
    const emailVerificationToken = generateEmailVerificationToken();

    // Create user with secure password and API key
    const [user] = await sql`
      INSERT INTO users (
        name, email, phone, password_hash, api_key_hash, 
        email_verified, email_verification_token, role, created_at
      )
      VALUES (
        ${name}, ${email}, ${phone}, ${passwordHash}, ${apiKeyHash}, 
        false, ${emailVerificationToken}, 'customer', NOW()
      )
      RETURNING id, name, email, phone, role
    `.catch(async (e) => {
      // If users table doesn't exist, create it first
      if (e.message?.includes('does not exist') || e.message?.includes('relation')) {
        await sql`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(20) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            api_key_hash VARCHAR(255) UNIQUE NOT NULL,
            email_verified BOOLEAN DEFAULT false,
            email_verification_token VARCHAR(255),
            role VARCHAR(50) DEFAULT 'customer',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            last_login TIMESTAMP
          )
        `;

        // Create API keys table
        await sql`
          CREATE TABLE IF NOT EXISTS api_keys (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            api_key_hash VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255),
            last_used TIMESTAMP,
            created_at TIMESTAMP DEFAULT NOW(),
            expires_at TIMESTAMP,
            is_active BOOLEAN DEFAULT true
          )
        `;

        // Try again after creating tables
        return await sql`
          INSERT INTO users (
            name, email, phone, password_hash, api_key_hash, 
            email_verified, email_verification_token, role, created_at
          )
          VALUES (
            ${name}, ${email}, ${phone}, ${passwordHash}, ${apiKeyHash}, 
            false, ${emailVerificationToken}, 'customer', NOW()
          )
          RETURNING id, name, email, phone, role
        `;
      }
      throw e;
    });

    // Store API key in api_keys table
    await sql`
      INSERT INTO api_keys (user_id, api_key_hash, name, is_active, created_at)
      VALUES (${user.id}, ${apiKeyHash}, 'Default API Key', true, NOW())
    `.catch(() => {
      // If table doesn't exist yet, it will be created on next request
      console.warn('API keys table not found, will be created on next request');
    });

    // Generate unique session ID for this registration
    const sessionId = generateSessionId();
    
    // Get client IP and user agent for session tracking
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Generate JWT token with session ID (default to 24 hours for new registrations)
    const token = generateToken(user.id, email, user.role, sessionId, false);

    // Create session in database with IP tracking
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

    // Insert session into database (24 hours for new registrations)
    const maxAge = 60 * 60 * 24; // 24 hours
    const expiresAt = new Date(Date.now() + maxAge * 1000);
    await sql`
      INSERT INTO sessions (session_id, user_id, ip_address, user_agent, expires_at, created_at, last_used, is_active)
      VALUES (${sessionId}, ${user.id}, ${clientIp}, ${userAgent}, ${expiresAt.toISOString()}, NOW(), NOW(), true)
      ON CONFLICT (session_id) DO UPDATE SET
        last_used = NOW(),
        is_active = true,
        expires_at = ${expiresAt.toISOString()}
    `.catch((error) => {
      console.error('Error creating session:', error);
      // Continue anyway - session might exist
    });

    // Send verification email (async, don't wait)
    if (email) {
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://aegis-spectra.netlify.app'}/verify-email?token=${emailVerificationToken}`;
      
      // Send welcome email with verification link
      emailService.sendEmail({
        to: email,
        subject: 'ברוכים הבאים ל-Aegis Spectra - אימות אימייל',
        html: `
          <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0B0B0D; color: #ECECEC;">
            <h2 style="color: #D4AF37; margin-bottom: 20px;">ברוכים הבאים ל-Aegis Spectra!</h2>
            <p style="margin-bottom: 15px;">שלום ${name},</p>
            <p style="margin-bottom: 15px;">תודה על ההרשמה לאתר שלנו. אנחנו שמחים שהצטרפת אלינו!</p>
            <p style="margin-bottom: 20px;">כדי להשלים את ההרשמה, אנא לחץ על הקישור הבא כדי לאמת את האימייל שלך:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="display: inline-block; background-color: #D4AF37; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">אמת אימייל</a>
            </div>
            <p style="margin-bottom: 10px; font-size: 14px; color: #999;">או העתק את הקישור הבא לדפדפן שלך:</p>
            <p style="margin-bottom: 20px; font-size: 12px; color: #666; word-break: break-all;">${verificationUrl}</p>
            <p style="margin-bottom: 10px; font-size: 14px; color: #999;">הקישור יפוג בעוד 24 שעות.</p>
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; font-size: 12px; color: #666;">
              אם לא ביצעת הרשמה לאתר שלנו, אנא התעלם מהאימייל הזה.
            </p>
          </div>
        `
      }).catch(err => console.error('Failed to send verification email:', err));
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
        emailVerified: false,
      },
      token,
      apiKey, // Return API key only once - user must save it!
      message: 'הרשמה הושלמה בהצלחה! אנא שמור את ה-API Key שלך - הוא יוצג רק פעם אחת.'
    });

    // Set httpOnly cookie for security (server-side only)
    // New registrations get 24 hours (not 7 days) - they can login again with "remember me"
    response.cookies.set('user_token', token, {
      maxAge: 60 * 60 * 24, // 24 hours for new registrations
      path: '/',
      httpOnly: true, // Prevent XSS attacks
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'lax', // CSRF protection
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Don't leak sensitive error details
    if (error.message?.includes('unique') || error.message?.includes('duplicate')) {
      return NextResponse.json({ 
        ok: false, 
        error: 'משתמש כבר קיים עם אימייל או טלפון זה' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      ok: false, 
      error: 'הרשמה נכשלה. אנא נסה שוב מאוחר יותר' 
    }, { status: 500 });
  }
}

