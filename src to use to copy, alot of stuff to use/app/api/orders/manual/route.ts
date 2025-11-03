import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { method, pkgCode, pkgName, price } = (await req.json()) as { method: 'BIT' | 'PAYBOX'; pkgCode: string; pkgName: string; price?: string };
    if (!method || !pkgCode || !pkgName) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { sendMail } = await import('@/lib/mailer');

    const html = `
      <div dir="rtl" style="font-family:Segoe UI,Heebo,Arial,sans-serif">
        <h2>בקשת רכישה ידנית</h2>
        <p>מתודה: <b>${method}</b></p>
        <p>חבילה: <b>${pkgName}</b> (${pkgCode})</p>
        <p>מחיר: ${price || ''}</p>
      </div>
    `;

    await sendMail({ to: 'Aegisspectra@gmail.com', subject: `רכישה ידנית (${method}) – ${pkgCode}`, html });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}


