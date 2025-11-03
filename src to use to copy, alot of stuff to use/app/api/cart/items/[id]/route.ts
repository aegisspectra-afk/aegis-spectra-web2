import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const updateQuantitySchema = z.object({
  quantity: z.number().min(0).max(100),
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { quantity } = updateQuantitySchema.parse(body);
    const itemId = params.id;

    const itemIndex = mockCart.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    if (quantity === 0) {
      // Remove item
      mockCart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      mockCart.items[itemIndex].quantity = quantity;
    }

    return NextResponse.json(mockCart);
  } catch (error) {
    console.error('Error updating cart item:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = params.id;

    const itemIndex = mockCart.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    mockCart.items.splice(itemIndex, 1);

    return NextResponse.json(mockCart);
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
}