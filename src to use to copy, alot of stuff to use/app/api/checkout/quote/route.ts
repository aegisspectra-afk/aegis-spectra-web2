import { NextRequest, NextResponse } from 'next/server';

interface CartItem {
  id: string;
  kind: 'saas' | 'hardware' | 'bundle';
  refId: string;
  title: string;
  unitPrice: number;
  quantity: number;
  oneTime: boolean;
}

interface QuoteRequest {
  items: CartItem[];
  isYearly?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: QuoteRequest = await request.json();
    const { items, isYearly = false } = body;

    // Calculate totals
    const recurring = items
      .filter(item => !item.oneTime)
      .reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

    const oneTime = items
      .filter(item => item.oneTime)
      .reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

    // Yearly calculation (10% discount)
    const yearly = recurring * 12 * 0.9;

    // Create line items breakdown
    const lineItems = items.map((item: any) => ({
      id: item.id,
      title: item.title,
      kind: item.kind,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.unitPrice * item.quantity,
      oneTime: item.oneTime
    }));

    // Calculate savings
    const monthlyTotal = recurring;
    const yearlyTotal = yearly;
    const savings = monthlyTotal * 12 - yearlyTotal;

    const response = {
      monthly: Math.round(recurring * 100) / 100,
      yearly: Math.round(yearly * 100) / 100,
      oneTime: Math.round(oneTime * 100) / 100,
      lineItems,
      summary: {
        recurring: {
          monthly: Math.round(recurring * 100) / 100,
          yearly: Math.round(yearly * 100) / 100,
          savings: Math.round(savings * 100) / 100
        },
        oneTime: Math.round(oneTime * 100) / 100,
        total: Math.round((isYearly ? yearly : recurring) + oneTime * 100) / 100
      },
      notes: [
        'All prices in USD',
        'Installation fees include standard cabling up to 10 meters per device',
        'Beyond 10 meters, additional cabling billed separately',
        'Professional installation included with all hardware',
        'SaaS plans include 24/7 support and updates'
      ],
      currency: 'USD',
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating quote:', error);
    return NextResponse.json(
      { error: 'Failed to generate quote' },
      { status: 500 }
    );
  }
}