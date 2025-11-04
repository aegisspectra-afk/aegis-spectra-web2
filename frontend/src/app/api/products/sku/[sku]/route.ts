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

    const [product] = await sql`
      SELECT * FROM products WHERE sku = ${sku} AND (stock IS NULL OR stock > 0)
    `;

    if (!product) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Product not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ ok: true, product });
  } catch (error: any) {
    console.error('Error fetching product by SKU:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to fetch product' 
    }, { status: 500 });
  }
}

