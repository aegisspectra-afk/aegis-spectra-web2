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

    // Build update query - use conditional updates
    // For simplicity, update all provided fields
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    
    if (sku !== undefined) {
      updateFields.push('sku');
      updateValues.push(sku);
    }
    if (name !== undefined) {
      updateFields.push('name');
      updateValues.push(name);
    }
    if (description !== undefined) {
      updateFields.push('description');
      updateValues.push(description);
    }
    if (price_regular !== undefined) {
      updateFields.push('price_regular');
      updateValues.push(price_regular);
    }
    if (price_sale !== undefined) {
      updateFields.push('price_sale');
      updateValues.push(price_sale);
    }
    if (category !== undefined) {
      updateFields.push('category');
      updateValues.push(category);
    }
    if (tags !== undefined) {
      updateFields.push('tags');
      updateValues.push(JSON.stringify(tags));
    }
    if (images !== undefined) {
      updateFields.push('images');
      updateValues.push(JSON.stringify(images));
    }
    if (specs !== undefined) {
      updateFields.push('specs');
      updateValues.push(JSON.stringify(specs));
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ 
        ok: false, 
        error: 'No fields to update' 
      }, { status: 400 });
    }

    // Use a simple approach - update all fields at once
    // For now, we'll update fields one by one or use a simpler approach
    // This is a workaround for Neon's template literal limitations
    
    let queryResult;
    if (sku !== undefined && name !== undefined && price_regular !== undefined) {
      // Full update
      queryResult = await sql`
        UPDATE products 
        SET sku = ${sku}, name = ${name}, description = ${description || null}, 
            price_regular = ${price_regular}, price_sale = ${price_sale || null},
            category = ${category || null}, tags = ${tags ? JSON.stringify(tags) : null}::jsonb,
            images = ${images ? JSON.stringify(images) : null}::jsonb,
            specs = ${specs ? JSON.stringify(specs) : null}::jsonb,
            updated_at = NOW()
        WHERE id = ${productId}
        RETURNING *
      `;
    } else {
      // Partial update - get existing product first
      const [existing] = await sql`SELECT * FROM products WHERE id = ${productId}`;
      if (!existing) {
        return NextResponse.json({ 
          ok: false, 
          error: 'Product not found' 
        }, { status: 404 });
      }
      
      queryResult = await sql`
        UPDATE products 
        SET sku = ${sku !== undefined ? sku : existing.sku}, 
            name = ${name !== undefined ? name : existing.name},
            description = ${description !== undefined ? description : existing.description},
            price_regular = ${price_regular !== undefined ? price_regular : existing.price_regular},
            price_sale = ${price_sale !== undefined ? price_sale : existing.price_sale},
            category = ${category !== undefined ? category : existing.category},
            tags = ${tags !== undefined ? JSON.stringify(tags) : existing.tags}::jsonb,
            images = ${images !== undefined ? JSON.stringify(images) : existing.images}::jsonb,
            specs = ${specs !== undefined ? JSON.stringify(specs) : existing.specs}::jsonb,
            updated_at = NOW()
        WHERE id = ${productId}
        RETURNING *
      `;
    }
    
    const [updatedProduct] = queryResult;

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

