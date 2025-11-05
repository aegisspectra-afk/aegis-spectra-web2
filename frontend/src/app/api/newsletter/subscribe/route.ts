import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@netlify/neon';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { emailService } from '@/lib/email';

const sql = neon();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, recaptcha_token } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ 
        ok: false, 
        error: 'כתובת אימייל נדרשת' 
      }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'כתובת אימייל לא תקינה' 
      }, { status: 400 });
    }

    // Verify reCAPTCHA token
    const recaptchaResult = await verifyRecaptcha(recaptcha_token, 'newsletter', 0.5);
    if (!recaptchaResult.valid) {
      console.warn('reCAPTCHA verification failed:', recaptchaResult.error);
      // In production, you might want to reject here
      // For now, we'll log but allow (for development)
    }

    // Check if email already exists
    const existing = await sql`
      SELECT id FROM newsletter_subscribers 
      WHERE email = ${email.toLowerCase().trim()}
      LIMIT 1
    `.catch(() => []);

    if (existing && existing.length > 0) {
      return NextResponse.json({ 
        ok: true, 
        message: 'כתובת האימייל כבר רשומה במערכת' 
      });
    }

    // Create newsletter_subscribers table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT NOW(),
        unsubscribed_at TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        source VARCHAR(50) DEFAULT 'website',
        recaptcha_score DECIMAL(3,2)
      )
    `.catch(() => {
      // Table might already exist
    });

    // Insert subscriber
    await sql`
      INSERT INTO newsletter_subscribers (email, subscribed_at, is_active, source, recaptcha_score)
      VALUES (${email.toLowerCase().trim()}, NOW(), true, 'website', ${recaptchaResult.score || null})
      ON CONFLICT (email) DO UPDATE SET
        is_active = true,
        unsubscribed_at = NULL,
        subscribed_at = NOW()
    `.catch((error) => {
      console.error('Error inserting newsletter subscriber:', error);
      throw error;
    });

    // Send welcome email with guide
    try {
      await emailService.sendEmail({
        to: email,
        subject: 'ברוכים הבאים לניוזלטר Aegis Spectra! 🎁',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0b1020; color: #e5e7eb;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #fbbf24; font-size: 28px; margin: 0;">🎁 מדריך אבטחה חינם!</h1>
            </div>
            
            <div style="background: #0b1c33; border: 1px solid #1f3460; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
              <h2 style="color: #93c5fd; font-size: 20px; margin-top: 0;">שלום ${email.split('@')[0]},</h2>
              <p style="line-height: 1.6;">
                תודה שהצטרפת לניוזלטר של Aegis Spectra! 
                אנחנו שמחים לשלוח לך מדריך אבטחה מקצועי שיעזור לך להגן על הבית והעסק שלך.
              </p>
            </div>

            <div style="background: #0b1c33; border: 1px solid #1f3460; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
              <h3 style="color: #fbbf24; font-size: 18px; margin-top: 0;">מה תקבל במייל?</h3>
              <ul style="line-height: 1.8; padding-right: 20px;">
                <li>✅ טיפים מקצועיים לאבטחה חכמה</li>
                <li>✅ עדכונים על מוצרים חדשים</li>
                <li>✅ מבצעים והנחות בלעדיים</li>
                <li>✅ מדריכים והדרכות מקצועיות</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://aegis-spectra.netlify.app" 
                 style="display: inline-block; background: #fbbf24; color: #04111a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                בואו לבקר באתר שלנו
              </a>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #1f3460; text-align: center; color: #9ca3af; font-size: 12px;">
              <p>© ${new Date().getFullYear()} Aegis Spectra Security. כל הזכויות שמורות.</p>
              <p style="margin-top: 10px;">
                <a href="https://aegis-spectra.netlify.app/newsletter/unsubscribe?email=${encodeURIComponent(email)}" 
                   style="color: #9ca3af; text-decoration: underline;">
                  ביטול הרשמה
                </a>
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue anyway - subscription was successful
    }

    return NextResponse.json({ 
      ok: true, 
      message: 'הצטרפת בהצלחה לניוזלטר!' 
    });
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    
    return NextResponse.json({ 
      ok: false, 
      error: 'אירעה שגיאה. אנא נסה שוב מאוחר יותר.' 
    }, { status: 500 });
  }
}

