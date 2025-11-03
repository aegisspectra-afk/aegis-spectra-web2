import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { items, totalAmount } = await req.json() as { items: Array<{ name: string; price: number; quantity: number }>; totalAmount: number };
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
    const token = authJson.access_token;
    if (!token) {
      return NextResponse.json({ error: 'Failed auth' }, { status: 500 });
    }

    // Create order
    const currency = process.env.NEXT_PUBLIC_CURRENCY || 'ILS';
    const createRes = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: { 
              currency_code: currency, 
              value: Number(totalAmount || 0).toFixed(2) 
            },
            items: items?.map(item => ({
              name: item.name,
              unit_amount: {
                currency_code: currency,
                value: item.price.toFixed(2)
              },
              quantity: item.quantity.toString()
            }))
          },
        ],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout`,
          brand_name: 'Aegis Spectra',
          user_action: 'PAY_NOW',
        },
      }),
    });

    const order = await createRes.json();
    const approvalUrl = (order.links || []).find((l: any) => l.rel === 'approve')?.href;
    
    return NextResponse.json({ orderId: order.id, approvalUrl });
  } catch (e: any) {
    console.error('PayPal create order error:', e);
    return NextResponse.json({ error: 'Create order failed' }, { status: 500 });
  }
}

