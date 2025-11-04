import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { isValidEmail, checkRateLimit, generateEmailVerificationToken } from '@/lib/auth';
import { emailService } from '@/lib/email';

const sql = neon();

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(`forgot-password:${clientId}`, 3, 60 * 60 * 1000)) { // 3 attempts per hour
      return NextResponse.json({ 
        ok: false, 
        error: 'יותר מדי ניסיונות. אנא נסה שוב בעוד שעה' 
      }, { status: 429 });
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ 
        ok: false, 
        error: 'אימייל נדרש' 
      }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'אימייל לא תקין' 
      }, { status: 400 });
    }

    // Find user by email
    const users = await sql`
      SELECT id, name, email FROM users WHERE email = ${email} LIMIT 1
    `.catch(() => []);

    // Always return success (don't reveal if user exists)
    if (users.length > 0) {
      const user = users[0];
      const resetToken = generateEmailVerificationToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store reset token
      await sql`
        UPDATE users 
        SET password_reset_token = ${resetToken},
            password_reset_expires = ${expiresAt.toISOString()},
            updated_at = NOW()
        WHERE id = ${user.id}
      `.catch(() => {
        // If column doesn't exist, create it
        sql`
          ALTER TABLE users 
          ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255),
          ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP
        `.catch(() => {});
      });

      // Send reset email
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      await emailService.sendEmail({
        to: email,
        subject: 'איפוס סיסמה - Aegis Spectra',
        html: `
          <h2>איפוס סיסמה</h2>
          <p>שלום ${user.name},</p>
          <p>קיבלנו בקשה לאיפוס הסיסמה שלך. לחץ על הקישור הבא כדי לאפס את הסיסמה:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #D4AF37; color: #000; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">
            אפס סיסמה
          </a>
          <p>או העתק והדבק את הקישור הבא בדפדפן שלך:</p>
          <p>${resetUrl}</p>
          <p>הקישור יפוג בעוד שעה.</p>
          <p>אם לא ביקשת לאפס את הסיסמה, תוכל להתעלם מהאימייל הזה.</p>
        `
      }).catch((err) => {
        console.error('Failed to send reset email:', err);
      });
    }

    // Always return success (security best practice)
    return NextResponse.json({ 
      ok: true, 
      message: 'אם האימייל קיים במערכת, קישור לאיפוס סיסמה נשלח' 
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'שגיאה בשליחת אימייל איפוס סיסמה' 
    }, { status: 500 });
  }
}

