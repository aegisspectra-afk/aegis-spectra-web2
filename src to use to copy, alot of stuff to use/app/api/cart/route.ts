import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const cartItemSchema = z.object({
  kind: z.enum(['saas', 'hardware', 'bundle']),
  refId: z.string(),
  quantity: z.number().min(1).max(100),
});

// Mock cart storage - in production this would be in database
interface CartItem {
  id: string;
  kind: 'saas' | 'hardware' | 'bundle';
  refId: string;
  title: string;
  unitPrice: number;
  quantity: number;
  oneTime: boolean;
  meta?: {
    addedAt: string;
  };
}

const mockCart = {
  id: 'cart-1',
  items: [] as CartItem[],
  currency: 'USD',
  createdAt: new Date()
};

export async function GET() {
  try {
    return NextResponse.json(mockCart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kind, refId, quantity } = cartItemSchema.parse(body);

    // Mock product/plan lookup - in production this would query database
    const mockProducts = {
      'basic': { title: 'Basic Plan', unitPrice: 29, oneTime: false },
      'pro': { title: 'Pro Plan', unitPrice: 79, oneTime: false },
      'business': { title: 'Business Plan', unitPrice: 199, oneTime: false },
      'enterprise': { title: 'Enterprise Plan', unitPrice: 0, oneTime: false },
      'cam-basic': { title: 'IP Camera – Basic (1080p)', unitPrice: 250, oneTime: true },
      'cam-pro': { title: 'IP Camera – Pro (4K + AI)', unitPrice: 450, oneTime: true },
      'dvr-8ch': { title: 'DVR – 8CH (2TB)', unitPrice: 540, oneTime: true },
      'nvr-16ch': { title: 'NVR – 16CH (4TB + AI)', unitPrice: 1030, oneTime: true },
      'access-control': { title: 'Access Control System', unitPrice: 770, oneTime: true },
      'alarm-system': { title: 'Alarm System', unitPrice: 850, oneTime: true },
      'ups-1500va': { title: 'UPS – 1500VA', unitPrice: 400, oneTime: true },
      'switch-24poe': { title: '24-Port PoE Switch', unitPrice: 340, oneTime: true },
      'nvr-4ch-1tb': { title: 'NVR 4CH + 1TB (Home)', unitPrice: 330, oneTime: true },
      'nvr-32ch-8tb': { title: 'NVR 32CH + 8TB (Enterprise)', unitPrice: 1800, oneTime: true },
      'dome-camera-indoor': { title: 'IP Dome Camera – Indoor (2K)', unitPrice: 220, oneTime: true },
      'smoke-motion-sensors': { title: 'Smoke / Motion Sensors', unitPrice: 120, oneTime: true },
      'keypad-entry': { title: 'Keypad Entry System', unitPrice: 400, oneTime: true },
      'smart-doorbell': { title: 'Smart Doorbell (Video + Intercom)', unitPrice: 300, oneTime: true }
    };

    const product = mockProducts[refId as keyof typeof mockProducts];
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if item already exists in cart
    const existingItemIndex = mockCart.items.findIndex(
      item => item.refId === refId && item.kind === kind
    );

    if (existingItemIndex >= 0) {
      // Update quantity
      mockCart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const newItem = {
        id: `${kind}-${refId}-${Date.now()}`,
        kind,
        refId,
        title: product.title,
        unitPrice: product.unitPrice,
        quantity,
        oneTime: product.oneTime,
        meta: {
          addedAt: new Date().toISOString()
        }
      };
      mockCart.items.push(newItem);
    }

    return NextResponse.json(mockCart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}