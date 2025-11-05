/**
 * Admin Product API - Get, Update, Delete specific product
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const productId = parseInt(id);

    const [product] = await sql`
      SELECT id, sku, name, description, price, price_sale, currency, category,
             tags, images, specs, brand, stock, active, created_at, updated_at
      FROM products
      WHERE id = ${productId}
      LIMIT 1
    `.catch(() => []);

    if (!product) {
      return NextResponse.json(
        { ok: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      product,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching product:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PATCH - Update product
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const productId = parseInt(id);
    const body = await request.json();

    const {
      name,
      description,
      price,
      price_sale,
      category,
      tags,
      images,
      specs,
      brand,
      stock,
      active,
    } = body;

    // Build update query - use simple approach with all fields
    const [updatedProduct] = await sql`
      UPDATE products
      SET 
        name = ${name !== undefined ? name : sql`name`},
        description = ${description !== undefined ? description : sql`description`},
        price = ${price !== undefined ? price : sql`price`},
        price_sale = ${price_sale !== undefined ? price_sale : sql`price_sale`},
        category = ${category !== undefined ? category : sql`category`},
        tags = ${tags !== undefined ? JSON.stringify(tags) : sql`tags`},
        images = ${images !== undefined ? JSON.stringify(images) : sql`images`},
        specs = ${specs !== undefined ? JSON.stringify(specs) : sql`specs`},
        brand = ${brand !== undefined ? brand : sql`brand`},
        stock = ${stock !== undefined ? stock : sql`stock`},
        active = ${active !== undefined ? active : sql`active`},
        updated_at = NOW()
      WHERE id = ${productId}
      RETURNING id, sku, name, description, price, price_sale, currency, category,
                tags, images, specs, brand, stock, active, created_at, updated_at
    `.catch(() => []);

    if (!updatedProduct) {
      return NextResponse.json(
        { ok: false, error: 'Product not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      product: updatedProduct,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error updating product:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const productId = parseInt(id);

    await sql`
      DELETE FROM products
      WHERE id = ${productId}
    `;

    return NextResponse.json({
      ok: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error deleting product:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

