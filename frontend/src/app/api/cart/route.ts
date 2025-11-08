import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const sql = neon();

interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}

// GET - Get user's cart
export async function GET(request: NextRequest) {
  try {
    // Get user token (optional - for authenticated carts)
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('user_token')?.value;
    let userId: number | null = null;

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const users = await sql`
          SELECT id FROM users WHERE email = ${decoded.email} LIMIT 1
        `.catch(() => []);
        if (users.length > 0) {
          userId = users[0].id;
        }
      }
    }

    // For now, return empty cart structure
    // In the future, we can store carts in database for authenticated users
    const cart: Cart = {
      items: [],
      subtotal: 0,
      shipping: 0,
      total: 0,
      itemCount: 0,
    };

    return NextResponse.json({
      ok: true,
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { ok: false, success: false, error: 'שגיאה בטעינת עגלה' },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sku, name, price, quantity = 1, image } = body;

    if (!sku || !name || !price) {
      return NextResponse.json(
        { ok: false, success: false, error: 'פרטי מוצר חסרים' },
        { status: 400 }
      );
    }

    // For now, return success
    // In the future, we can store carts in database
    const item: CartItem = {
      sku,
      name,
      price,
      quantity,
      image,
    };

    return NextResponse.json({
      ok: true,
      success: true,
      data: item,
      message: 'מוצר נוסף לעגלה בהצלחה',
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { ok: false, success: false, error: 'שגיאה בהוספת מוצר לעגלה' },
      { status: 500 }
    );
  }
}

// PUT - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sku, quantity } = body;

    if (!sku || quantity === undefined) {
      return NextResponse.json(
        { ok: false, success: false, error: 'SKU וכמות נדרשים' },
        { status: 400 }
      );
    }

    if (quantity < 0) {
      return NextResponse.json(
        { ok: false, success: false, error: 'כמות לא יכולה להיות שלילית' },
        { status: 400 }
      );
    }

    // For now, return success
    // In the future, we can update carts in database
    return NextResponse.json({
      ok: true,
      success: true,
      message: 'עגלה עודכנה בהצלחה',
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { ok: false, success: false, error: 'שגיאה בעדכון עגלה' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const sku = searchParams.get('sku');

    if (!sku) {
      return NextResponse.json(
        { ok: false, success: false, error: 'SKU נדרש' },
        { status: 400 }
      );
    }

    // For now, return success
    // In the future, we can remove items from database
    return NextResponse.json({
      ok: true,
      success: true,
      message: 'מוצר הוסר מהעגלה בהצלחה',
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { ok: false, success: false, error: 'שגיאה בהסרת מוצר מהעגלה' },
      { status: 500 }
    );
  }
}

