/**
 * PDF Generator for Invoices
 */
import { neon } from '@netlify/neon';

const sql = neon();

export interface InvoiceData {
  orderId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerAddress?: string;
  customerCity?: string;
  items: Array<{
    sku: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  created_at: string;
}

/**
 * Generate HTML invoice (can be converted to PDF using browser print or puppeteer)
 */
export function generateInvoiceHTML(data: InvoiceData): string {
  const date = new Date(data.created_at).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <title>חשבונית - ${data.orderId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 40px;
      background: #fff;
      color: #000;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 3px solid #d4af37;
      padding-bottom: 20px;
    }
    .header h1 {
      font-size: 2.5em;
      color: #d4af37;
      margin-bottom: 10px;
    }
    .header p {
      font-size: 1.2em;
      color: #666;
    }
    .invoice-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .info-box {
      flex: 1;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
      margin: 0 10px;
    }
    .info-box h3 {
      color: #d4af37;
      margin-bottom: 10px;
      font-size: 1.2em;
    }
    .info-box p {
      color: #333;
      margin: 5px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th {
      background: #d4af37;
      color: #000;
      padding: 15px;
      text-align: right;
      font-weight: bold;
    }
    td {
      padding: 12px 15px;
      border-bottom: 1px solid #ddd;
      text-align: right;
    }
    tr:hover {
      background: #f5f5f5;
    }
    .totals {
      margin-top: 30px;
      text-align: left;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 1.1em;
    }
    .total-row.final {
      font-size: 1.5em;
      font-weight: bold;
      color: #d4af37;
      border-top: 2px solid #d4af37;
      padding-top: 15px;
      margin-top: 10px;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      color: #666;
      font-size: 0.9em;
    }
    @media print {
      body { padding: 20px; }
      .header { page-break-after: avoid; }
      table { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Aegis Spectra</h1>
    <p>חשבונית מס</p>
  </div>

  <div class="invoice-info">
    <div class="info-box">
      <h3>פרטי הזמנה</h3>
      <p><strong>מספר הזמנה:</strong> ${data.orderId}</p>
      <p><strong>תאריך:</strong> ${date}</p>
      <p><strong>סטטוס:</strong> ${data.orderStatus === 'pending' ? 'ממתין' : 
                                   data.orderStatus === 'processing' ? 'בעיבוד' :
                                   data.orderStatus === 'shipped' ? 'נשלח' :
                                   data.orderStatus === 'delivered' ? 'נמסר' : 'בוטל'}</p>
      <p><strong>תשלום:</strong> ${data.paymentStatus === 'paid' ? 'שולם' : 'ממתין'}</p>
    </div>
    <div class="info-box">
      <h3>פרטי לקוח</h3>
      <p><strong>שם:</strong> ${data.customerName}</p>
      ${data.customerEmail ? `<p><strong>אימייל:</strong> ${data.customerEmail}</p>` : ''}
      <p><strong>טלפון:</strong> ${data.customerPhone}</p>
      ${data.customerAddress ? `<p><strong>כתובת:</strong> ${data.customerAddress}</p>` : ''}
      ${data.customerCity ? `<p><strong>עיר:</strong> ${data.customerCity}</p>` : ''}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>פריט</th>
        <th>SKU</th>
        <th>כמות</th>
        <th>מחיר יחידה</th>
        <th>סה"כ</th>
      </tr>
    </thead>
    <tbody>
      ${data.items.map(item => `
        <tr>
          <td>${item.name}</td>
          <td>${item.sku}</td>
          <td>${item.quantity}</td>
          <td>${item.price.toLocaleString()} ₪</td>
          <td><strong>${(item.quantity * item.price).toLocaleString()} ₪</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row">
      <span>סה"כ ביניים:</span>
      <span>${data.subtotal.toLocaleString()} ₪</span>
    </div>
    ${data.shipping > 0 ? `
      <div class="total-row">
        <span>משלוח:</span>
        <span>${data.shipping.toLocaleString()} ₪</span>
      </div>
    ` : ''}
    ${data.discount > 0 ? `
      <div class="total-row">
        <span>הנחה:</span>
        <span>-${data.discount.toLocaleString()} ₪</span>
      </div>
    ` : ''}
    <div class="total-row final">
      <span>סה"כ לתשלום:</span>
      <span>${data.total.toLocaleString()} ₪</span>
    </div>
  </div>

  <div class="footer">
    <p>תודה על הקנייה שלך!</p>
    <p>Aegis Spectra - מערכות אבטחה מתקדמות</p>
  </div>
</body>
</html>
  `;
}

/**
 * Get order data for invoice
 */
export async function getOrderDataForInvoice(orderId: string): Promise<InvoiceData | null> {
  try {
    const [order] = await sql`
      SELECT 
        o.order_id, o.customer_name, o.customer_email, o.customer_phone,
        o.customer_address, o.customer_city, o.items, o.subtotal, o.shipping,
        o.discount, o.total, o.order_status, o.payment_status, o.created_at,
        json_agg(
          json_build_object(
            'sku', oi.sku,
            'name', oi.name,
            'price', oi.price,
            'quantity', oi.quantity
          )
        ) FILTER (WHERE oi.id IS NOT NULL) as order_items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      WHERE o.order_id = ${orderId}
      GROUP BY o.id
      LIMIT 1
    `.catch(() => []);

    if (!order) {
      return null;
    }

    // Use order_items if available, otherwise parse items JSONB
    const items = order.order_items && order.order_items.length > 0
      ? order.order_items
      : (Array.isArray(order.items) ? order.items : []);

    return {
      orderId: order.order_id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      customerAddress: order.customer_address,
      customerCity: order.customer_city,
      items: items,
      subtotal: order.subtotal,
      shipping: order.shipping || 0,
      discount: order.discount || 0,
      total: order.total,
      orderStatus: order.order_status,
      paymentStatus: order.payment_status,
      created_at: order.created_at,
    };
  } catch (error) {
    console.error('Error fetching order data:', error);
    return null;
  }
}

