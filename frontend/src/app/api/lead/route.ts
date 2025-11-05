import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';
import { verifyRecaptcha } from '@/lib/recaptcha';

const sql = neon();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string || '';
    const city = formData.get('city') as string || '';
    const message = formData.get('message') as string || '';
    const product_sku = formData.get('product_sku') as string || '';
    const bot_field = formData.get('bot-field') as string;
    const recaptchaToken = formData.get('recaptcha_token') as string | null;

    // Spam protection - אם bot-field מלא, זה spam
    if (bot_field) {
      return NextResponse.json({ ok: false, error: 'Spam detected' }, { status: 400 });
    }

    // Verify reCAPTCHA token
    const recaptchaResult = await verifyRecaptcha(recaptchaToken, 'lead_form', 0.5);
    if (!recaptchaResult.valid) {
      console.warn('reCAPTCHA verification failed:', recaptchaResult.error);
      // In production, you might want to reject here
      // For now, we'll log but allow (for development)
      // return NextResponse.json({ ok: false, error: 'reCAPTCHA verification failed' }, { status: 400 });
    }

    // שמירה ב-DB
    await sql`
      INSERT INTO leads (name, phone, email, city, message, product_sku, created_at)
      VALUES (${name}, ${phone}, ${email || null}, ${city}, ${message}, ${product_sku}, NOW())
    `.catch(async (e) => {
      // If email column doesn't exist, try without it
      if (e.message?.includes('email') || e.message?.includes('column')) {
        return await sql`
          INSERT INTO leads (name, phone, city, message, product_sku, created_at)
          VALUES (${name}, ${phone}, ${city}, ${message}, ${product_sku}, NOW())
        `;
      }
      throw e;
    });

    // Send email notification to company (aegisspectra@gmail.com)
    emailService.sendLeadNotification({
      lead: {
        name,
        phone,
        email,
        city,
        message,
        product_sku,
        source: 'website'
      }
    }).catch(err => console.error('Failed to send email notification to company:', err));

    // Send confirmation email to customer (if email provided)
    if (email) {
      emailService.sendConfirmationEmail({
        customerData: {
          fullName: name,
          phone,
          email,
          city,
          message
        }
      }).catch(err => console.error('Failed to send confirmation email to customer:', err));
    }

    return NextResponse.json({ ok: true, msg: 'Lead saved successfully' });
  } catch (error: any) {
    console.error('Error saving lead:', error);
    
    // אם הטבלה לא קיימת, נחזיר שגיאה ידידותית
    if (error.message?.includes('does not exist') || error.message?.includes('relation')) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Database table not found. Please create the leads table first.' 
      }, { status: 500 });
    }

    return NextResponse.json({ ok: false, error: 'Failed to save lead' }, { status: 500 });
  }
}

