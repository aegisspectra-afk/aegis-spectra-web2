/**
 * Admin Product API - Get, Update, Delete specific product
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';
import { notifyLowStock } from '@/lib/notifications';

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

    // Build update query - use conditional updates
    // First get current product
    const [currentProduct] = await sql`
      SELECT * FROM products WHERE id = ${productId} LIMIT 1
    `.catch(() => []);

    if (!currentProduct) {
      return NextResponse.json(
        { ok: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update only provided fields
    const updateFields: any = {
      updated_at: new Date(),
    };

    if (name !== undefined) updateFields.name = name;
    else updateFields.name = currentProduct.name;
    
    if (description !== undefined) updateFields.description = description;
    else updateFields.description = currentProduct.description;
    
    if (price !== undefined) updateFields.price = price;
    else updateFields.price = currentProduct.price;
    
    if (price_sale !== undefined) updateFields.price_sale = price_sale;
    else updateFields.price_sale = currentProduct.price_sale;
    
    if (category !== undefined) updateFields.category = category;
    else updateFields.category = currentProduct.category;
    
    if (tags !== undefined) updateFields.tags = JSON.stringify(tags);
    else updateFields.tags = currentProduct.tags;
    
    if (images !== undefined) updateFields.images = JSON.stringify(images);
    else updateFields.images = currentProduct.images;
    
    if (specs !== undefined) updateFields.specs = JSON.stringify(specs);
    else updateFields.specs = currentProduct.specs;
    
    if (brand !== undefined) updateFields.brand = brand;
    else updateFields.brand = currentProduct.brand;
    
    if (stock !== undefined) updateFields.stock = stock;
    else updateFields.stock = currentProduct.stock;
    
    if (active !== undefined) updateFields.active = active;
    else updateFields.active = currentProduct.active;

    // Update product
    const [updatedProduct] = await sql`
      UPDATE products
      SET 
        name = ${updateFields.name},
        description = ${updateFields.description},
        price = ${updateFields.price},
        price_sale = ${updateFields.price_sale},
        category = ${updateFields.category},
        tags = ${updateFields.tags},
        images = ${updateFields.images},
        specs = ${updateFields.specs},
        brand = ${updateFields.brand},
        stock = ${updateFields.stock},
        active = ${updateFields.active},
        updated_at = ${updateFields.updated_at}
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

    // Check for low stock and create notification
    if (stock !== undefined && updatedProduct.stock !== undefined) {
      const minStock = updatedProduct.min_stock || 10;
      if (updatedProduct.stock <= minStock) {
        notifyLowStock(
          updatedProduct.id,
          updatedProduct.name,
          updatedProduct.stock,
          minStock
        ).catch(() => {});
      }
    }

            // Create audit log
            await createAuditLog(
              admin.id,
              admin.email,
              AuditActions.PRODUCT_UPDATED,
              'product',
              productId,
              { changes: Object.keys(body) },
              request.headers.get('x-forwarded-for') || undefined,
              request.headers.get('user-agent') || undefined
            );

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

    // Get product before deletion for audit log
    const [productToDelete] = await sql`
      SELECT sku, name FROM products WHERE id = ${productId} LIMIT 1
    `.catch(() => []);

    await sql`
      DELETE FROM products
      WHERE id = ${productId}
    `;

    // Create audit log
    if (productToDelete) {
      await createAuditLog(
        admin.id,
        admin.email,
        AuditActions.PRODUCT_DELETED,
        'product',
        productId,
        { sku: productToDelete.sku, name: productToDelete.name },
        request.headers.get('x-forwarded-for') || undefined,
        request.headers.get('user-agent') || undefined
      );
    }

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

