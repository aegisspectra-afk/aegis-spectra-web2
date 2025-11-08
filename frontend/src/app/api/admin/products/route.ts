/**
 * Admin Products API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get all products (admin only)
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);

    // Get products from database
    const products = await sql`
      SELECT id, sku, name, description, price, price_sale, currency, category, 
             tags, images, specs, brand, stock, active, created_at, updated_at
      FROM products
      ORDER BY created_at DESC
    `.catch(() => []);

    return NextResponse.json({
      ok: true,
      products,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching products:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();

    const {
      sku,
      name,
      description,
      price,
      price_sale,
      currency = 'ILS',
      category,
      tags = [],
      images = [],
      specs = {},
      brand,
      stock = 0,
      active = true,
    } = body;

    if (!sku || !name || !price) {
      return NextResponse.json(
        { ok: false, error: 'SKU, name, and price are required' },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    const [existing] = await sql`
      SELECT id FROM products WHERE sku = ${sku} LIMIT 1
    `.catch(() => []);

    if (existing) {
      return NextResponse.json(
        { ok: false, error: 'Product with this SKU already exists' },
        { status: 400 }
      );
    }

    // Insert product
    const [newProduct] = await sql`
      INSERT INTO products (
        sku, name, description, price, price_sale, currency, category,
        tags, images, specs, brand, stock, active, created_at, updated_at
      )
      VALUES (
        ${sku}, ${name}, ${description || null}, ${price}, ${price_sale || null},
        ${currency}, ${category || null}, ${JSON.stringify(tags)}, ${JSON.stringify(images)},
        ${JSON.stringify(specs)}, ${brand || null}, ${stock}, ${active}, NOW(), NOW()
      )
      RETURNING id, sku, name, description, price, price_sale, currency, category,
                tags, images, specs, brand, stock, active, created_at, updated_at
    `.catch(() => []);

    if (!newProduct) {
      return NextResponse.json(
        { ok: false, error: 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      product: newProduct,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error creating product:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

