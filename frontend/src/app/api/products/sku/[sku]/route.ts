import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon();

// GET - קבלת מוצר לפי SKU
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const { sku } = await params;

    if (!sku) {
      return NextResponse.json({ 
        ok: false, 
        error: 'SKU is required' 
      }, { status: 400 });
    }

    // Decode SKU if it's URL encoded
    const decodedSku = decodeURIComponent(sku);

    // Try to get product from database
    const products = await sql`
      SELECT * FROM products 
      WHERE sku = ${decodedSku} 
      AND (stock IS NULL OR stock > 0)
      LIMIT 1
    `.catch((error) => {
      console.error('Database error:', error);
      return [];
    });

    if (products.length === 0 || !products[0]) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Product not found' 
      }, { status: 404 });
    }

    const product = products[0];
    return NextResponse.json({ ok: true, product });
  } catch (error: any) {
    console.error('Error fetching product by SKU:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to fetch product',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

