import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aegis2024';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const providedPassword = authHeader?.replace('Bearer ', '');
  return providedPassword === ADMIN_PASSWORD;
}

// GET - Get stock status for all products or specific product
export async function GET(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    const sku = searchParams.get('sku');
    const lowStockOnly = searchParams.get('low_stock_only') === 'true';

    if (productId) {
      const [product] = await sql`
        SELECT id, sku, name, stock, min_stock, reserved_stock,
               (stock - reserved_stock) as available_stock,
               low_stock_alert, last_stock_update
        FROM products
        WHERE id = ${parseInt(productId)}
      `;

      if (!product) {
        return NextResponse.json(
          { ok: false, error: 'Product not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ ok: true, product });
    }

    if (sku) {
      const [product] = await sql`
        SELECT id, sku, name, stock, min_stock, reserved_stock,
               (stock - reserved_stock) as available_stock,
               low_stock_alert, last_stock_update
        FROM products
        WHERE sku = ${sku}
      `;

      if (!product) {
        return NextResponse.json(
          { ok: false, error: 'Product not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ ok: true, product });
    }

    // Get all products with stock info
    let products;
    if (lowStockOnly) {
      products = await sql`
        SELECT id, sku, name, stock, min_stock, reserved_stock,
               (stock - reserved_stock) as available_stock,
               low_stock_alert, last_stock_update
        FROM products
        WHERE stock <= min_stock OR low_stock_alert = true
        ORDER BY stock ASC, name ASC
      `;
    } else {
      products = await sql`
        SELECT id, sku, name, stock, min_stock, reserved_stock,
               (stock - reserved_stock) as available_stock,
               low_stock_alert, last_stock_update
        FROM products
        ORDER BY low_stock_alert DESC, stock ASC, name ASC
      `;
    }

    // Calculate summary
    const summary = {
      total_products: products.length,
      total_stock: products.reduce((sum: number, p: any) => sum + (p.stock || 0), 0),
      low_stock_count: products.filter((p: any) => p.low_stock_alert).length,
      out_of_stock_count: products.filter((p: any) => (p.stock || 0) === 0).length,
      reserved_stock: products.reduce((sum: number, p: any) => sum + (p.reserved_stock || 0), 0)
    };

    return NextResponse.json({
      ok: true,
      products,
      summary
    });
  } catch (error: any) {
    console.error('Error fetching stock:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch stock' },
      { status: 500 }
    );
  }
}

// POST - Update stock (restock, adjustment, etc.)
export async function POST(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { product_id, sku, quantity_change, change_type, notes, created_by } = body;

    if (!product_id && !sku) {
      return NextResponse.json(
        { ok: false, error: 'product_id or sku is required' },
        { status: 400 }
      );
    }

    if (!quantity_change || quantity_change === 0) {
      return NextResponse.json(
        { ok: false, error: 'quantity_change is required and must not be 0' },
        { status: 400 }
      );
    }

    // Get product
    let product;
    if (product_id) {
      [product] = await sql`
        SELECT id, sku, name, stock, min_stock
        FROM products
        WHERE id = ${parseInt(product_id)}
      `;
    } else {
      [product] = await sql`
        SELECT id, sku, name, stock, min_stock
        FROM products
        WHERE sku = ${sku}
      `;
    }

    if (!product) {
      return NextResponse.json(
        { ok: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Use the database function to update stock
    const result = await sql`
      SELECT update_product_stock(
        ${product.id},
        ${quantity_change},
        ${change_type || 'adjustment'},
        ${notes || null},
        ${created_by || 'admin'}
      ) as result
    `;

    const resultData = result[0]?.result;

    if (!resultData || !resultData.success) {
      return NextResponse.json(
        { ok: false, error: resultData?.error || 'Failed to update stock' },
        { status: 400 }
      );
    }

    // Get updated product
    const [updatedProduct] = await sql`
      SELECT id, sku, name, stock, min_stock, reserved_stock,
             (stock - reserved_stock) as available_stock,
             low_stock_alert, last_stock_update
      FROM products
      WHERE id = ${product.id}
    `;

    return NextResponse.json({
      ok: true,
      product: updatedProduct,
      change: {
        stock_before: resultData.stock_before,
        stock_after: resultData.stock_after,
        quantity_change: resultData.quantity_change
      }
    });
  } catch (error: any) {
    console.error('Error updating stock:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update stock' },
      { status: 500 }
    );
  }
}

