import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

type OrderItem = { name: string; price: number; quantity: number };
type Customer = { firstName?: string; lastName?: string; email?: string; phone?: string; address?: string; city?: string; postalCode?: string };
type OrderShape = {
  id?: string;
  createdAt?: string | number | Date;
  items?: OrderItem[];
  subtotal?: number;
  shipping?: number;
  discount?: number;
  total?: number;
  shippingMethod?: string;
  trackingUrl?: string;
  customer?: Customer;
};

function ils(n: number | undefined | null) {
  return `₪${Number(n || 0).toLocaleString('he-IL')}`;
}

export async function POST(req: NextRequest) {
  try {
    const { orderId, order, method } = (await req.json()) as { orderId: string; order: OrderShape; method?: string };
    if (!orderId || !order) {
      return new Response(JSON.stringify({ error: 'Missing order data' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Use Gmail SMTP via Nodemailer
    const { sendMail } = await import('@/lib/mailer');

    const to = 'Aegisspectra@gmail.com';
    const subject = `התקבלה הזמנה חדשה #${orderId}${method ? ` (${method})` : ''}`;

    const lines = (order.items || []).map((it) => `${it.name} × ${it.quantity} — ${ils(it.price)} | סך: ${ils((it.price || 0) * (it.quantity || 1))}`);
    const createdAt = order.createdAt ? new Date(order.createdAt).toLocaleString('he-IL') : new Date().toLocaleString('he-IL');

    const html = `
      <div dir="rtl" style="font-family:Segoe UI,Heebo,Arial,sans-serif">
        <h2>התקבלה הזמנה חדשה</h2>
        <p><b>מס׳ הזמנה:</b> ${orderId}</p>
        <p><b>תאריך:</b> ${createdAt}</p>
        <p><b>שיטת משלוח:</b> ${order.shippingMethod || ''}</p>
        <h3>פריטים</h3>
        <ul>
          ${lines.map((l) => `<li>${l}</li>`).join('')}
        </ul>
        <h3>סיכום</h3>
        <p>סכום ביניים: ${ils(order.subtotal)}<br/>משלוח: ${ils(order.shipping)}<br/>הנחה: ${ils(order.discount)}<br/><b>סה"כ: ${ils(order.total)}</b></p>
        <h3>פרטי לקוח</h3>
        <p>
          שם: ${(order.customer?.firstName || '') + ' ' + (order.customer?.lastName || '')}<br/>
          אימייל: ${order.customer?.email || ''}<br/>
          טלפון: ${order.customer?.phone || ''}<br/>
          כתובת: ${(order.customer?.address || '')}, ${(order.customer?.city || '')} ${(order.customer?.postalCode || '')}
        </p>
      </div>
    `;

    await sendMail({ to, subject, html });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to send' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}


