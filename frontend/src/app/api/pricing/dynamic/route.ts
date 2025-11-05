import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const sql = neon();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aegis2024';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const providedPassword = authHeader?.replace('Bearer ', '');
  return providedPassword === ADMIN_PASSWORD;
}

// GET - Calculate dynamic pricing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    const sku = searchParams.get('sku');
    const quantity = parseInt(searchParams.get('quantity') || '1');
    const userType = searchParams.get('user_type') || 'B2C'; // B2C or B2B
    const userId = searchParams.get('user_id');

    if (!productId && !sku) {
      return NextResponse.json(
        { ok: false, error: 'product_id or sku is required' },
        { status: 400 }
      );
    }

    // Get product
    let product: any;
    if (sku) {
      [product] = await sql`
        SELECT * FROM products WHERE sku = ${sku} LIMIT 1
      `;
    } else {
      [product] = await sql`
        SELECT * FROM products WHERE id = ${parseInt(productId!)} LIMIT 1
      `;
    }

    if (!product) {
      return NextResponse.json(
        { ok: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Base price
    let finalPrice = parseFloat(product.price_sale || product.price_regular);

    // Quantity discounts
    let quantityDiscount = 0;
    if (quantity >= 10) {
      quantityDiscount = 0.15; // 15% off for 10+
    } else if (quantity >= 5) {
      quantityDiscount = 0.10; // 10% off for 5+
    } else if (quantity >= 3) {
      quantityDiscount = 0.05; // 5% off for 3+
    }

    // B2B pricing
    if (userType === 'B2B' && userId) {
      // Check if user has B2B account
      const b2bDiscount = 0.10; // 10% B2B discount
      quantityDiscount = Math.max(quantityDiscount, b2bDiscount);
    }

    // Apply discounts
    const discountAmount = finalPrice * quantityDiscount;
    finalPrice = finalPrice - discountAmount;

    // Calculate totals
    const subtotal = finalPrice * quantity;
    const totalDiscount = discountAmount * quantity;

    return NextResponse.json({
      ok: true,
      pricing: {
        base_price: parseFloat(product.price_sale || product.price_regular),
        final_price: Math.round(finalPrice * 100) / 100,
        quantity,
        quantity_discount: Math.round(quantityDiscount * 100),
        discount_amount: Math.round(discountAmount * 100) / 100,
        subtotal: Math.round(subtotal * 100) / 100,
        total_discount: Math.round(totalDiscount * 100) / 100,
        user_type: userType
      }
    });
  } catch (error: any) {
    console.error('Error calculating dynamic pricing:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to calculate pricing' },
      { status: 500 }
    );
  }
}

