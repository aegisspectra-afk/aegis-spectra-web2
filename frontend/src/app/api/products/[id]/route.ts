import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aegis2024';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const providedPassword = authHeader?.replace('Bearer ', '');
  return providedPassword === ADMIN_PASSWORD;
}

// GET - קבלת מוצר לפי ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid product ID' 
      }, { status: 400 });
    }

    const [product] = await sql`
      SELECT * FROM products WHERE id = ${productId}
    `;

    if (!product) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Product not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ ok: true, product });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to fetch product' 
    }, { status: 500 });
  }
}

// PATCH - עדכון מוצר
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Unauthorized - Invalid password',
        requiresAuth: true
      }, { status: 401 });
    }

    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid product ID' 
      }, { status: 400 });
    }

    const body = await request.json();
    const { sku, name, description, price_regular, price_sale, category, tags, images, specs } = body;

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (sku !== undefined) {
      updates.push(`sku = $${paramIndex++}`);
      values.push(sku);
    }
    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (price_regular !== undefined) {
      updates.push(`price_regular = $${paramIndex++}`);
      values.push(price_regular);
    }
    if (price_sale !== undefined) {
      updates.push(`price_sale = $${paramIndex++}`);
      values.push(price_sale);
    }
    if (category !== undefined) {
      updates.push(`category = $${paramIndex++}`);
      values.push(category);
    }
    if (tags !== undefined) {
      updates.push(`tags = $${paramIndex++}`);
      values.push(JSON.stringify(tags));
    }
    if (images !== undefined) {
      updates.push(`images = $${paramIndex++}`);
      values.push(JSON.stringify(images));
    }
    if (specs !== undefined) {
      updates.push(`specs = $${paramIndex++}`);
      values.push(JSON.stringify(specs));
    }

    if (updates.length === 0) {
      return NextResponse.json({ 
        ok: false, 
        error: 'No fields to update' 
      }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);
    values.push(productId);

    const query = `UPDATE products SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    
    const [updatedProduct] = await sql.unsafe(query, values);

    return NextResponse.json({ ok: true, product: updatedProduct });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to update product' 
    }, { status: 500 });
  }
}

// DELETE - מחיקת מוצר
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Unauthorized - Invalid password',
        requiresAuth: true
      }, { status: 401 });
    }

    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid product ID' 
      }, { status: 400 });
    }

    await sql`
      DELETE FROM products WHERE id = ${productId}
    `;

    return NextResponse.json({ ok: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to delete product' 
    }, { status: 500 });
  }
}

