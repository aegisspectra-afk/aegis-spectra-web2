import { NextRequest, NextResponse } from 'next/server';
import { loadCatalog, getProductBySKU } from '@/lib/catalog';

export async function GET(
  request: NextRequest,
  { params }: { params: { sku: string } }
) {
  try {
    const catalog = await loadCatalog();
    const product = getProductBySKU(catalog, params.sku);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error loading product:', error);
    return NextResponse.json(
      { error: 'Failed to load product' },
      { status: 500 }
    );
  }
}
