import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}

// In a real application, this would be stored in a database
// For now, we'll use a simple in-memory store (this would be lost on server restart)
const cartStore = new Map<string, Cart>();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const cart = cartStore.get(userId) || {
      items: [],
      subtotal: 0,
      shipping: 0,
      total: 0,
      itemCount: 0
    };

    return NextResponse.json({
      success: true,
      data: cart
    });

  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get current cart
    const currentCart = cartStore.get(userId) || {
      items: [],
      subtotal: 0,
      shipping: 0,
      total: 0,
      itemCount: 0
    };

    // Check if item already exists in cart
    const existingItemIndex = currentCart.items.findIndex(
      item => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      currentCart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      // In a real app, you would fetch product details from database
      const newItem: CartItem = {
        id: `${productId}-${Date.now()}`,
        productId,
        name: `Product ${productId}`, // This would come from database
        description: 'Product description', // This would come from database
        price: 100, // This would come from database
        quantity,
        image: '/api/placeholder/100/100',
        category: 'cameras'
      };
      currentCart.items.push(newItem);
    }

    // Recalculate totals
    currentCart.subtotal = currentCart.items.reduce(
      (total, item) => total + (item.price * item.quantity), 0
    );
    currentCart.shipping = currentCart.subtotal > 1000 ? 0 : 150;
    currentCart.total = currentCart.subtotal + currentCart.shipping;
    currentCart.itemCount = currentCart.items.reduce(
      (total, item) => total + item.quantity, 0
    );

    // Save cart
    cartStore.set(userId, currentCart);

    return NextResponse.json({
      success: true,
      data: currentCart,
      message: 'Item added to cart successfully'
    });

  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { itemId, quantity } = body;

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: 'Item ID and quantity are required' },
        { status: 400 }
      );
    }

    const currentCart = cartStore.get(userId);
    if (!currentCart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }

    const itemIndex = currentCart.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      // Remove item from cart
      currentCart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      currentCart.items[itemIndex].quantity = quantity;
    }

    // Recalculate totals
    currentCart.subtotal = currentCart.items.reduce(
      (total, item) => total + (item.price * item.quantity), 0
    );
    currentCart.shipping = currentCart.subtotal > 1000 ? 0 : 150;
    currentCart.total = currentCart.subtotal + currentCart.shipping;
    currentCart.itemCount = currentCart.items.reduce(
      (total, item) => total + item.quantity, 0
    );

    // Save cart
    cartStore.set(userId, currentCart);

    return NextResponse.json({
      success: true,
      data: currentCart,
      message: 'Cart updated successfully'
    });

  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const currentCart = cartStore.get(userId);
    if (!currentCart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }

    const itemIndex = currentCart.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    // Remove item from cart
    currentCart.items.splice(itemIndex, 1);

    // Recalculate totals
    currentCart.subtotal = currentCart.items.reduce(
      (total, item) => total + (item.price * item.quantity), 0
    );
    currentCart.shipping = currentCart.subtotal > 1000 ? 0 : 150;
    currentCart.total = currentCart.subtotal + currentCart.shipping;
    currentCart.itemCount = currentCart.items.reduce(
      (total, item) => total + item.quantity, 0
    );

    // Save cart
    cartStore.set(userId, currentCart);

    return NextResponse.json({
      success: true,
      data: currentCart,
      message: 'Item removed from cart successfully'
    });

  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}
