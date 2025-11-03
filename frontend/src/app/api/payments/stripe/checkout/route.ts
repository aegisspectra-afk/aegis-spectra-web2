import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { items, totalAmount, customerEmail } = await req.json() as { 
      items: Array<{ name: string; price: number; quantity: number }>; 
      totalAmount: number;
      customerEmail?: string;
    };
    
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    // In production, use Stripe SDK
    // For now, return a checkout session URL
    const stripe = await import('stripe').catch(() => null);
    
    if (!stripe) {
      // Fallback: return mock checkout URL for development
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Stripe checkout would be created:', { items, totalAmount });
        return NextResponse.json({ 
          checkoutUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?session_id=mock_${Date.now()}`,
          sessionId: `mock_${Date.now()}`
        });
      }
      return NextResponse.json({ error: 'Stripe SDK not available' }, { status: 500 });
    }

    const stripeClient = new stripe.default(stripeSecretKey);

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'ils',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Convert to agorot
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout`,
      customer_email: customerEmail,
    });

    return NextResponse.json({ 
      checkoutUrl: session.url,
      sessionId: session.id
    });
  } catch (e: any) {
    console.error('Stripe checkout error:', e);
    return NextResponse.json({ error: 'Checkout creation failed' }, { status: 500 });
  }
}

