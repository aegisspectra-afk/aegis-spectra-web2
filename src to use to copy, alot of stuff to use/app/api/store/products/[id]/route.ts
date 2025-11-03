import { NextRequest, NextResponse } from 'next/server';

// Import the products from the main products API
import { products } from '../route';

// Product data structure
interface Product {
  id: string;
  name: string;
  description: string;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
  category: string;
  features: string[];
  specifications?: Array<{ label: string; value: string }>;
  image: string;
  popular?: boolean;
  new?: boolean;
  inStock?: boolean;
  stockCount?: number;
}

// Create a lookup object for quick access
const productsLookup: { [key: string]: Product } = {};
products.forEach((product: Product) => {
  productsLookup[product.id] = product;
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const product = productsLookup[productId];

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
