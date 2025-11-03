import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';
import { 
  hashPassword, 
  generateApiKey, 
  hashApiKey, 
  generateToken,
  isValidEmail, 
  isValidPhone, 
  isStrongPassword,
  checkRateLimit,
  generateEmailVerificationToken
} from '@/lib/auth';

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
    const { name, email, phone, password } = body;

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

    // Generate JWT token
    const token = generateToken(user.id, email, user.role);

    // Send verification email (async, don't wait)
    if (email) {
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${emailVerificationToken}`;
      
      emailService.sendWelcomeEmail({
        user: { name, email }
      }).catch(err => console.error('Failed to send welcome email:', err));

      // Send verification email
      emailService.sendEmail({
        to: email,
        subject: 'אימות אימייל - Aegis Spectra',
        html: `
          <h2>ברוכים הבאים ל-Aegis Spectra!</h2>
          <p>שלום ${name},</p>
          <p>תודה על ההרשמה. אנא לחץ על הקישור הבא כדי לאמת את האימייל שלך:</p>
          <a href="${verificationUrl}">${verificationUrl}</a>
          <p>הקישור יפוג בעוד 24 שעות.</p>
          <p>האימייל שלך לא יאומת עד שתלחץ על הקישור.</p>
        `
      }).catch(err => console.error('Failed to send verification email:', err));
    }

    // Return user data and API key (API key shown only once!)
    return NextResponse.json({ 
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

