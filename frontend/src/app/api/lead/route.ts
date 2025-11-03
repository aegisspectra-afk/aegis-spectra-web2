import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

const sql = neon();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const city = formData.get('city') as string || '';
    const message = formData.get('message') as string || '';
    const product_sku = formData.get('product_sku') as string || '';
    const bot_field = formData.get('bot-field') as string;

    // Spam protection - אם bot-field מלא, זה spam
    if (bot_field) {
      return NextResponse.json({ ok: false, error: 'Spam detected' }, { status: 400 });
    }

    // שמירה ב-DB
    await sql`
      INSERT INTO leads (name, phone, city, message, product_sku, created_at)
      VALUES (${name}, ${phone}, ${city}, ${message}, ${product_sku}, NOW())
    `;

    // Send email notification to admin (async, don't wait)
    emailService.sendLeadNotification({
      lead: {
        name,
        phone,
        city,
        message,
        product_sku,
        source: 'website'
      }
    }).catch(err => console.error('Failed to send email notification:', err));

    // Send confirmation email to customer (if email provided in future)
    // For now, we only have phone, so we skip customer email

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

