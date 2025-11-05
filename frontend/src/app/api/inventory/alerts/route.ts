import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aegis2024';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const providedPassword = authHeader?.replace('Bearer ', '');
  return providedPassword === ADMIN_PASSWORD;
}

// GET - Get all inventory alerts
export async function GET(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    const alertType = searchParams.get('type');

    let query = sql`
      SELECT * FROM inventory_alerts
      WHERE 1=1
    `;

    if (status) {
      query = sql`
        SELECT * FROM inventory_alerts
        WHERE status = ${status}
      `;
    }

    if (alertType) {
      query = sql`
        SELECT * FROM inventory_alerts
        WHERE alert_type = ${alertType}
        ${status ? sql`AND status = ${status}` : sql``}
      `;
    }

    const alerts = await query;

    return NextResponse.json({
      ok: true,
      alerts,
      count: alerts.length
    });
  } catch (error: any) {
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
    if (!checkAuth(request)) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

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
    if (!checkAuth(request)) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

