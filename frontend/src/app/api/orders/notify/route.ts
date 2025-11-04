import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

function ils(n: number | undefined | null) {
  return `₪${Number(n || 0).toLocaleString('he-IL')}`;
}

export async function POST(request: NextRequest) {
  try {
    const { orderId, order, method } = await request.json();

    if (!orderId || !order) {
      return NextResponse.json(
        { ok: false, error: 'Missing order data' },
        { status: 400 }
      );
    }

    const to = process.env.ADMIN_EMAIL || 'aegisspectra@gmail.com';
    const subject = `התקבלה הזמנה חדשה #${orderId}${method ? ` (${method})` : ''}`;

    const lines = (order.items || []).map(
      (it: any) =>
        `${it.name} × ${it.quantity} — ${ils(it.price)} | סך: ${ils((it.price || 0) * (it.quantity || 1))}`
    );
    const createdAt = order.createdAt
      ? new Date(order.createdAt).toLocaleString('he-IL')
      : new Date().toLocaleString('he-IL');

    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
        <head>
          <meta charset="utf-8">
          <title>הזמנה חדשה #${orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0f766e, #134e4a); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .field { margin: 10px 0; }
            .label { font-weight: bold; color: #0f766e; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; text-align: right; border: 1px solid #ddd; }
            th { background: #0f766e; color: white; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛡️ התקבלה הזמנה חדשה</h1>
              <p>Aegis Spectra Security Solutions</p>
            </div>
            <div class="content">
              <div class="order-info">
                <h2>פרטי הזמנה</h2>
                <div class="field"><span class="label">מס׳ הזמנה:</span> ${orderId}</div>
                <div class="field"><span class="label">תאריך:</span> ${createdAt}</div>
                <div class="field"><span class="label">שיטת משלוח:</span> ${order.shippingMethod || ''}</div>
              </div>

              <div class="order-info">
                <h3>פריטים</h3>
                <table>
                  <thead>
                    <tr>
                      <th>פריט</th>
                      <th>כמות</th>
                      <th>מחיר יח׳</th>
                      <th>סך</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${(order.items || []).map(
                      (it: any) => `
                      <tr>
                        <td>${it.name}</td>
                        <td>${it.quantity}</td>
                        <td>${ils(it.price)}</td>
                        <td>${ils((it.price || 0) * (it.quantity || 1))}</td>
                      </tr>
                    `
                    ).join('')}
                  </tbody>
                </table>
              </div>

              <div class="order-info">
                <h3>סיכום</h3>
                <div class="field"><span class="label">סכום ביניים:</span> ${ils(order.subtotal)}</div>
                <div class="field"><span class="label">משלוח:</span> ${ils(order.shipping)}</div>
                <div class="field"><span class="label">הנחה:</span> ${ils(order.discount)}</div>
                <div class="field"><span class="label" style="font-size: 18px;">סה״כ:</span> <strong style="font-size: 18px;">${ils(order.total)}</strong></div>
              </div>

              <div class="order-info">
                <h3>פרטי לקוח</h3>
                <div class="field"><span class="label">שם:</span> ${(order.customer?.firstName || '') + ' ' + (order.customer?.lastName || '')}</div>
                <div class="field"><span class="label">אימייל:</span> ${order.customer?.email || ''}</div>
                <div class="field"><span class="label">טלפון:</span> ${order.customer?.phone || ''}</div>
                <div class="field"><span class="label">כתובת:</span> ${(order.customer?.address || '')}, ${(order.customer?.city || '')} ${(order.customer?.postalCode || '')}</div>
              </div>
            </div>
            <div class="footer">
              <p>Received: ${new Date().toLocaleString('he-IL')}</p>
              <p>© 2024 Aegis Spectra Security Solutions</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await emailService.sendEmail({
      to,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error sending order notification:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

