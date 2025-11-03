import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

type Item = { name: string; unit_amount: number; quantity: number };

export async function POST(req: NextRequest) {
  try {
    const { items, totalAmount } = (await req.json()) as { items: Item[]; totalAmount: number };
    const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const base = process.env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

    if (!clientId || !clientSecret) {
      return new Response(JSON.stringify({ error: 'PayPal not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // Get access token
    const authRes = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'client_credentials' }),
      // @ts-ignore - node fetch supports this
      auth: `${clientId}:${clientSecret}`,
    } as any);

    const authJson = await authRes.json();
    const token = authJson.access_token;
    if (!token) {
      return new Response(JSON.stringify({ error: 'Failed auth' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // Create order
    const currency = process.env.NEXT_PUBLIC_CURRENCY || 'ILS';
    const createRes = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: { currency_code: currency, value: Number(totalAmount || 0).toFixed(2) },
          },
        ],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/store/paypal/return`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/store/checkout`,
          brand_name: 'Aegis Spectra',
          user_action: 'PAY_NOW',
        },
      }),
    });

    const order = await createRes.json();
    const approvalUrl = (order.links || []).find((l: any) => l.rel === 'approve')?.href;
    return new Response(JSON.stringify({ orderId: order.id, approvalUrl }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Create order failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { paypalConfig } from '@/lib/paypal-config';

export async function POST(request: NextRequest) {
  try {
    const { items, totalAmount } = await request.json();

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      );
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Valid total amount is required' },
        { status: 400 }
      );
    }

    // Create PayPal order
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: paypalConfig.currency,
            value: totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: paypalConfig.currency,
                value: totalAmount.toFixed(2)
              }
            }
          },
          items: items.map((item: any) => ({
            name: item.name,
            unit_amount: {
              currency_code: paypalConfig.currency,
              value: item.price.toFixed(2)
            },
            quantity: item.quantity.toString(),
            description: item.description || ''
          }))
        }
      ],
      application_context: {
        return_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/success`,
        cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/cancel`,
        brand_name: 'Aegis Spectra',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW'
      }
    };

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

    // Create order with PayPal
    const orderResponse = await fetch(`${paypalConfig.apiBaseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `order-${Date.now()}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(orderData)
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      console.error('PayPal order creation failed:', errorData);
      throw new Error('Failed to create PayPal order');
    }

    const order = await orderResponse.json();

    return NextResponse.json({
      orderId: order.id,
      approvalUrl: order.links.find((link: any) => link.rel === 'approve')?.href
    });

  } catch (error) {
    console.error('PayPal create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create PayPal order' },
      { status: 500 }
    );
  }
}