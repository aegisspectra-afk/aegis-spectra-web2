import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const confirmationSchema = z.object({
  type: z.enum(['lead_confirmation', 'demo_confirmation']),
  customerData: z.object({
    fullName: z.string(),
    phone: z.string(),
    email: z.string().optional(),
    city: z.string(),
    service: z.string(),
    points: z.string(),
    message: z.string().optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = confirmationSchema.parse(body);
    const { type, customerData } = validatedData;

    let emailContent;
    let subject;

    if (type === 'lead_confirmation') {
      subject = 'תודה על פנייתך - Aegis Spectra Security';
      emailContent = generateLeadConfirmationEmail(customerData);
    } else if (type === 'demo_confirmation') {
      subject = 'אישור הזמנת ביקור מדידה - Aegis Spectra Security';
      emailContent = generateDemoConfirmationEmail(customerData);
    } else {
      throw new Error('Invalid email type');
    }

    // Send email to customer
    if (customerData.email) {
      await resend.emails.send({
        from: 'Aegis Spectra <noreply@aegis-spectra.com>',
        to: [customerData.email],
        subject,
        html: emailContent,
      });
    }

    // Send notification to admin
    await resend.emails.send({
      from: 'Aegis Spectra <noreply@aegis-spectra.com>',
      to: ['admin@aegis-spectra.com'],
      subject: `New ${type === 'lead_confirmation' ? 'Lead' : 'Demo Request'}: ${customerData.fullName}`,
      html: generateAdminNotificationEmail(customerData, type),
    });

    return NextResponse.json({
      success: true,
      message: 'Confirmation email sent successfully',
    });

  } catch (error: any) {
    console.error('Email confirmation error:', error);

    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    );
  }
}

function generateLeadConfirmationEmail(customerData: any): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>תודה על פנייתך</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #0ea5e9;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #0ea5e9;
                margin: 0;
                font-size: 28px;
            }
            .content {
                margin: 20px 0;
            }
            .highlight {
                background: #e0f2fe;
                padding: 15px;
                border-radius: 8px;
                border-right: 4px solid #0ea5e9;
                margin: 20px 0;
            }
            .details {
                background: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }
            .details h3 {
                color: #0ea5e9;
                margin-top: 0;
            }
            .bonus {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #666;
                font-size: 14px;
            }
            .contact-info {
                background: #f0f9ff;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🛡️ Aegis Spectra Security</h1>
                <p>תודה על פנייתך!</p>
            </div>
            
            <div class="content">
                <h2>שלום ${customerData.fullName},</h2>
                
                <p>תודה רבה על פנייתך אלינו! קיבלנו את הפרטים שלך ונחזור אליך בהקדם האפשרי.</p>
                
                <div class="highlight">
                    <strong>מה קורה עכשיו?</strong><br>
                    • נחזור אליך בטלפון <strong>${customerData.phone}</strong> תוך 24 שעות<br>
                    • נכין עבורך הצעת מחיר מפורטת<br>
                    • נקבע פגישה לביקור מדידה (אם נדרש)
                </div>
                
                <div class="details">
                    <h3>פרטי הפנייה שלך:</h3>
                    <p><strong>שם:</strong> ${customerData.fullName}</p>
                    <p><strong>טלפון:</strong> ${customerData.phone}</p>
                    <p><strong>עיר:</strong> ${customerData.city}</p>
                    <p><strong>שירות מבוקש:</strong> ${getServiceDisplayName(customerData.service)}</p>
                    <p><strong>מספר נקודות משוער:</strong> ${customerData.points}</p>
                    ${customerData.message ? `<p><strong>הערות:</strong> ${customerData.message}</p>` : ''}
                </div>
                
                <div class="bonus">
                    <h3>🎁 בונוס מיוחד עבורך!</h3>
                    <p><strong>קבל 10% הנחה על ההזמנה הראשונה שלך!</strong></p>
                    <p>ההנחה תקפה למשך 30 יום מיום הפנייה</p>
                </div>
                
                <div class="contact-info">
                    <h3>📞 צור קשר</h3>
                    <p><strong>טלפון:</strong> 050-123-4567</p>
                    <p><strong>WhatsApp:</strong> 050-123-4567</p>
                    <p><strong>אימייל:</strong> info@aegis-spectra.com</p>
                    <p><strong>שעות פעילות:</strong> א׳-ה׳ 8:00-18:00, ו׳ 8:00-14:00</p>
                </div>
            </div>
            
            <div class="footer">
                <p>© 2024 Aegis Spectra Security. כל הזכויות שמורות.</p>
                <p>אם לא שלחת פנייה זו, אנא התעלם מהמייל.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateDemoConfirmationEmail(customerData: any): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>אישור הזמנת ביקור מדידה</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #0ea5e9;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #0ea5e9;
                margin: 0;
                font-size: 28px;
            }
            .content {
                margin: 20px 0;
            }
            .highlight {
                background: #e0f2fe;
                padding: 15px;
                border-radius: 8px;
                border-right: 4px solid #0ea5e9;
                margin: 20px 0;
            }
            .details {
                background: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }
            .details h3 {
                color: #0ea5e9;
                margin-top: 0;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #666;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🛡️ Aegis Spectra Security</h1>
                <p>אישור הזמנת ביקור מדידה</p>
            </div>
            
            <div class="content">
                <h2>שלום ${customerData.fullName},</h2>
                
                <p>תודה רבה על הזמנת ביקור מדידה! קיבלנו את הפרטים שלך ונחזור אליך בהקדם לקביעת מועד הביקור.</p>
                
                <div class="highlight">
                    <strong>מה כולל ביקור המדידה?</strong><br>
                    • בדיקת מיקומים אופטימליים למצלמות<br>
                    • הערכת צרכי האבטחה שלך<br>
                    • הצעת מחיר מפורטת ומדויקת<br>
                    • ייעוץ מקצועי ללא התחייבות
                </div>
                
                <div class="details">
                    <h3>פרטי הבקשה שלך:</h3>
                    <p><strong>שם:</strong> ${customerData.fullName}</p>
                    <p><strong>טלפון:</strong> ${customerData.phone}</p>
                    <p><strong>עיר:</strong> ${customerData.city}</p>
                    <p><strong>שירות מבוקש:</strong> ${getServiceDisplayName(customerData.service)}</p>
                    <p><strong>מספר נקודות משוער:</strong> ${customerData.points}</p>
                    ${customerData.message ? `<p><strong>הערות:</strong> ${customerData.message}</p>` : ''}
                </div>
                
                <p><strong>נחזור אליך תוך 24 שעות לקביעת מועד הביקור!</strong></p>
            </div>
            
            <div class="footer">
                <p>© 2024 Aegis Spectra Security. כל הזכויות שמורות.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateAdminNotificationEmail(customerData: any, type: string): string {
  return `
    <h2>New ${type === 'lead_confirmation' ? 'Lead' : 'Demo Request'}</h2>
    <p><strong>Name:</strong> ${customerData.fullName}</p>
    <p><strong>Phone:</strong> ${customerData.phone}</p>
    <p><strong>Email:</strong> ${customerData.email || 'Not provided'}</p>
    <p><strong>City:</strong> ${customerData.city}</p>
    <p><strong>Service:</strong> ${getServiceDisplayName(customerData.service)}</p>
    <p><strong>Points:</strong> ${customerData.points}</p>
    ${customerData.message ? `<p><strong>Message:</strong> ${customerData.message}</p>` : ''}
    <p><strong>Submitted at:</strong> ${new Date().toLocaleString('he-IL')}</p>
  `;
}

function getServiceDisplayName(service: string): string {
  const serviceNames: { [key: string]: string } = {
    'cameras': 'מצלמות אבטחה',
    'keypad': 'מערכת קודנים',
    'alarm': 'מערכת אזעקה',
    'combo': 'חבילה משולבת',
    'consultation': 'ייעוץ והתאמה',
  };
  return serviceNames[service] || service;
}