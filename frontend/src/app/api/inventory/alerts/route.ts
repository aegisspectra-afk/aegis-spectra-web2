import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

const sql = neon();

// GET - Get all inventory alerts
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status') || 'active';
    const alertType = searchParams.get('type');

    let alerts: any[] = [];

    try {
      // Try to fetch from database
      if (alertType) {
        alerts = await sql`
          SELECT * FROM inventory_alerts
          WHERE alert_type = ${alertType}
          ${status ? sql`AND status = ${status}` : sql``}
          ORDER BY created_at DESC
        `;
      } else if (status) {
        alerts = await sql`
          SELECT * FROM inventory_alerts
          WHERE status = ${status}
          ORDER BY created_at DESC
        `;
      } else {
        alerts = await sql`
          SELECT * FROM inventory_alerts
          ORDER BY created_at DESC
        `;
      }
    } catch (dbError: any) {
      // If table doesn't exist, check products for low stock
      console.warn('inventory_alerts table not found, checking products:', dbError);
      
      try {
        const lowStockProducts = await sql`
          SELECT 
            id as product_id,
            sku,
            name as product_name,
            stock as current_stock,
            10 as min_stock,
            'low_stock' as alert_type,
            'active' as status,
            NOW() as created_at
          FROM products
          WHERE (stock IS NULL OR stock <= 10) AND active = true
          ORDER BY stock ASC NULLS LAST
          LIMIT 50
        `;

        alerts = lowStockProducts.map((p: any) => ({
          id: p.product_id,
          product_id: p.product_id,
          sku: p.sku,
          product_name: p.product_name,
          current_stock: p.current_stock || 0,
          min_stock: p.min_stock,
          alert_type: p.alert_type,
          status: p.status,
          created_at: p.created_at,
        }));
      } catch (productsError: any) {
        console.error('Error fetching products for alerts:', productsError);
        // Return empty array if both fail
        alerts = [];
      }
    }

    return NextResponse.json({
      ok: true,
      alerts,
      count: alerts.length
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching inventory alerts:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

// POST - Create manual alert
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const { product_id, sku, product_name, current_stock, min_stock, alert_type, notes } = body;

    if (!product_id || !current_stock || !min_stock) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [alert] = await sql`
      INSERT INTO inventory_alerts (
        product_id, sku, product_name, current_stock,
        min_stock, alert_type, notes, status
      )
      VALUES (
        ${product_id}, ${sku || null}, ${product_name || null},
        ${current_stock}, ${min_stock}, ${alert_type || 'low_stock'},
        ${notes || null}, 'active'
      )
      RETURNING *
    `;

    return NextResponse.json({ ok: true, alert });
  } catch (error: any) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}

// PATCH - Update alert status
export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields: id, status' },
        { status: 400 }
      );
    }

    const updateData: any = { status };
    if (status === 'resolved') {
      updateData.resolved_at = new Date();
    }
    if (notes) {
      updateData.notes = notes;
    }

    const [alert] = await sql`
      UPDATE inventory_alerts
      SET status = ${status},
          resolved_at = ${status === 'resolved' ? new Date() : null},
          notes = ${notes || null}
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json({ ok: true, alert });
  } catch (error: any) {
    console.error('Error updating alert:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}

