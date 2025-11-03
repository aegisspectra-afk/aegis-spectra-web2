import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { token } = (await req.json()) as { token: string };
    if (!token) return new Response(JSON.stringify({ error: 'Missing token' }), { status: 400 });

    const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const base = process.env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
    if (!clientId || !clientSecret) return new Response(JSON.stringify({ error: 'PayPal not configured' }), { status: 500 });

    // Get access token
    const authRes = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'client_credentials' }),
      // @ts-ignore
      auth: `${clientId}:${clientSecret}`,
    } as any);
    const authJson = await authRes.json();
    const access = authJson.access_token;
    if (!access) return new Response(JSON.stringify({ error: 'Auth failed' }), { status: 500 });

    // Capture
    const capRes = await fetch(`${base}/v2/checkout/orders/${token}/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${access}` },
    });
    const data = await capRes.json();
    const status = data.status || 'UNKNOWN';
    return new Response(JSON.stringify({ status, orderId: data.id }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Capture failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { paypalConfig } from '@/lib/paypal-config';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get PayPal access token
    const tokenResponse = await fetch(`${paypalConfig.apiBaseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${Buffer.from(`${paypalConfig.clientId}:${paypalConfig.clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get PayPal access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Capture the order
    const captureResponse = await fetch(`${paypalConfig.apiBaseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `capture-${Date.now()}`
      }
    });

    if (!captureResponse.ok) {
      const errorData = await captureResponse.json();
      console.error('PayPal capture failed:', errorData);
      throw new Error('Failed to capture PayPal order');
    }

    const captureData = await captureResponse.json();

    // Check if capture was successful
    if (captureData.status === 'COMPLETED') {
      return NextResponse.json({
        success: true,
        orderId: captureData.id,
        status: captureData.status,
        amount: captureData.purchase_units[0]?.payments?.captures[0]?.amount,
        transactionId: captureData.purchase_units[0]?.payments?.captures[0]?.id
      });
    } else {
      return NextResponse.json(
        { error: 'Payment was not completed successfully' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('PayPal capture error:', error);
    return NextResponse.json(
      { error: 'Failed to capture PayPal order' },
      { status: 500 }
    );
  }
}