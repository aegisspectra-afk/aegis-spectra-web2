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

// GET - קבלת כל המוצרים (פתוח לכולם, לא רק אדמין)
export async function GET(request: NextRequest) {
  try {
    // Allow public access to products - no auth required
    const products = await sql`
      SELECT id, sku, name, price_regular, price_sale, currency, short_desc, category, tags, brand, stock, images, specs, created_at, updated_at 
      FROM products 
      WHERE stock IS NULL OR stock > 0
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json({ ok: true, products });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    
    if (error.message?.includes('does not exist') || error.message?.includes('relation')) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Database table not found. Please create the products table first.',
        products: []
      }, { status: 500 });
    }

    return NextResponse.json({ ok: false, error: 'Failed to fetch products', products: [] }, { status: 500 });
  }
}

// POST - יצירת מוצר חדש
export async function POST(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Unauthorized - Invalid password',
        requiresAuth: true
      }, { status: 401 });
    }

    const body = await request.json();
    const { sku, name, description, price_regular, price_sale, category, tags, images, specs } = body;

    if (!sku || !name || !price_regular) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Missing required fields: sku, name, price_regular' 
      }, { status: 400 });
    }

    const [product] = await sql`
      INSERT INTO products (sku, name, description, price_regular, price_sale, category, tags, images, specs, created_at)
      VALUES (${sku}, ${name}, ${description || null}, ${price_regular}, ${price_sale || null}, ${category || null}, ${tags ? JSON.stringify(tags) : null}, ${images ? JSON.stringify(images) : null}, ${specs ? JSON.stringify(specs) : null}, NOW())
      RETURNING *
    `;

    return NextResponse.json({ ok: true, product });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to create product' 
    }, { status: 500 });
  }
}

