import { NextRequest, NextResponse } from 'next/server';
import { products } from '../route';

// Create a lookup object for quick access
const productsLookup: { [key: string]: typeof products[0] } = {};
products.forEach((product) => {
  productsLookup[product.id] = product;
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = productsLookup[id];

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: product
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

