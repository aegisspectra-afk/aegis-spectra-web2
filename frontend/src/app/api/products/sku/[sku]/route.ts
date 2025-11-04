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

    // Decode SKU if it's URL encoded and trim whitespace
    let decodedSku = decodeURIComponent(sku).trim();
    
    // Try multiple SKU formats (with/without dashes, case insensitive)
    const skuVariations = [
      decodedSku,
      decodedSku.toUpperCase(),
      decodedSku.toLowerCase(),
      decodedSku.replace(/-/g, ''),
      decodedSku.replace(/-/g, '_'),
    ];

    // Try to get product from database - try exact match first, then case-insensitive
    let products: any[] = [];
    
    for (const skuVar of skuVariations) {
      products = await sql`
        SELECT * FROM products 
        WHERE UPPER(TRIM(sku)) = UPPER(TRIM(${skuVar}))
        AND (stock IS NULL OR stock > 0)
        LIMIT 1
      `.catch((error) => {
        console.error('Database error:', error);
        return [];
      });
      
      if (products.length > 0) {
        break;
      }
    }

    // If still not found, try case-insensitive search without stock check
    if (products.length === 0) {
      products = await sql`
        SELECT * FROM products 
        WHERE UPPER(TRIM(sku)) = UPPER(TRIM(${decodedSku}))
        LIMIT 1
      `.catch((error) => {
        console.error('Database error (fallback):', error);
        return [];
      });
    }

    if (products.length === 0 || !products[0]) {
      console.log(`Product not found for SKU: ${decodedSku} (original: ${sku})`);
      return NextResponse.json({ 
        ok: false, 
        error: `Product not found for SKU: ${decodedSku}`,
        searchedSku: decodedSku,
        variations: skuVariations
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

