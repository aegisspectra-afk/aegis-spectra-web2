import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json() as { orderId: string };
    if (!orderId) {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
    }

    const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const base = process.env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
    
    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'PayPal not configured' }, { status: 500 });
    }

    // Get access token
    const authRes = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({ grant_type: 'client_credentials' }),
    });

    const authJson = await authRes.json();
    const access = authJson.access_token;
    if (!access) {
      return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
    }

    // Capture
    const capRes = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${access}` 
      },
    });

    const data = await capRes.json();
    const status = data.status || 'UNKNOWN';
    
    return NextResponse.json({ 
      status, 
      orderId: data.id,
      amount: data.purchase_units?.[0]?.payments?.captures?.[0]?.amount,
      transactionId: data.purchase_units?.[0]?.payments?.captures?.[0]?.id
    });
  } catch (e: any) {
    console.error('PayPal capture error:', e);
    return NextResponse.json({ error: 'Capture failed' }, { status: 500 });
  }
}

