import { NextRequest, NextResponse } from 'next/server';

function ils(n: number | undefined | null) {
  return `₪${Number(n || 0).toLocaleString('he-IL')}`;
}

function buildInvoiceHtml(orderId: string, order: any) {
  const date = new Date().toLocaleString('he-IL');
  const shippingMethod = String(order?.shippingMethod || 'משלוח רגיל');
  const etaText =
    shippingMethod === 'אקספרס' || shippingMethod.toLowerCase() === 'express'
      ? '1–2 ימי עסקים'
      : '3–5 ימי עסקים';
  const rows = (order?.items || [])
    .map(
      (it: any) => `
        <tr>
          <td style="padding:10px;border:1px solid #1f2937;">${it.name}</td>
          <td style="padding:10px;border:1px solid #1f2937;">${it.quantity}</td>
          <td style="padding:10px;border:1px solid #1f2937;">₪${(it.price || 0).toLocaleString('he-IL')}</td>
          <td style="padding:10px;border:1px solid #1f2937;">₪${((it.price || 0) * (it.quantity || 1)).toLocaleString('he-IL')}</td>
        </tr>`
    )
    .join('');

  return `<!doctype html><html dir="rtl" lang="he"><head>
    <meta charset="utf-8"/>
    <title>חשבונית ${orderId}</title>
    <style>
      :root{color-scheme:dark light}
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Heebo,Arial,sans-serif;margin:0;padding:32px;background:#0b1020;color:#e5e7eb}
      .brand{display:flex;align-items:center;gap:12px}
      .chip{display:inline-block;padding:4px 10px;border-radius:999px;background:#0ea5a4; color:#04111a; font-weight:700; font-size:12px}
      h1{margin:0 0 4px;font-size:22px}
      h2{margin:22px 0 8px;font-size:16px;color:#93c5fd}
      table{border-collapse:collapse;width:100%;margin-top:12px;border-radius:12px;overflow:hidden}
      thead th{background:#0b1c33}
      .muted{color:#9ca3af}
      .totals{margin-top:16px;float:left;text-align:left}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:14px}
      .card{background:#0b1c33;border:1px solid #1f3460;border-radius:12px;padding:14px}
      @media print {
        body { background:#fff; color:#000; padding:16px; }
        .card{ background:#fff; border-color:#ddd; }
        thead th{ background:#f2f2f2; }
        a[href]:after { content: "" !important; }
        .no-print { display:none !important; }
      }
    </style>
  </head><body>
    <div class="brand">
      <div class="chip">Aegis Spectra</div>
      <h1>אישור הזמנה / קבלה זמנית</h1>
    </div>
    <div class="muted">מס' הזמנה: ${orderId} • תאריך: ${date}</div>

    <div class="grid">
      <div class="card">
        <h2>פרטי לקוח</h2>
        <div class="muted">שם: ${(order?.customer?.firstName || '') + ' ' + (order?.customer?.lastName || '')}</div>
        <div class="muted">אימייל: ${order?.customer?.email || ''}</div>
        <div class="muted">טלפון: ${order?.customer?.phone || ''}</div>
        <div class="muted">כתובת: ${(order?.customer?.address || '')}, ${(order?.customer?.city || '')} ${(order?.customer?.postalCode || '')}</div>
      </div>
      <div class="card">
        <h2>משלוח</h2>
        <div class="muted">שיטה: ${shippingMethod}</div>
        <div class="muted">ETA: ${etaText}</div>
      </div>
    </div>

    <h2>פריטים</h2>
    <table>
      <thead>
        <tr>
          <th style="padding:10px;border:1px solid #1f2937;text-align:right">פריט</th>
          <th style="padding:10px;border:1px solid #1f2937;text-align:right">כמות</th>
          <th style="padding:10px;border:1px solid #1f2937;text-align:right">מחיר</th>
          <th style="padding:10px;border:1px solid #1f2937;text-align:right">סך</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <div class="totals">
      <div>סכום ביניים: ${ils(order?.subtotal)}</div>
      <div>משלוח: ${ils(order?.shipping)}</div>
      <div>הנחה: ${ils(order?.discount)}</div>
      <h2>לתשלום: ${ils(order?.total)}</h2>
    </div>
    <script>window.onload=()=>{window.print();}</script>
  </body></html>`;
}

export async function POST(request: NextRequest) {
  try {
    const { orderId, order } = await request.json();
    const safeOrderId = String(orderId || 'order');
    const html = buildInvoiceHtml(safeOrderId, order || {});

    // Return HTML invoice (PDF generation requires additional dependencies)
    // Users can print to PDF from browser using Ctrl+P or browser print dialog
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename=invoice-${safeOrderId}.html`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

