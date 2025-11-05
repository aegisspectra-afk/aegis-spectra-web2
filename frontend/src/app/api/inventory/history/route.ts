import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aegis2024';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const providedPassword = authHeader?.replace('Bearer ', '');
  return providedPassword === ADMIN_PASSWORD;
}

// GET - Get stock history
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
    const changeType = searchParams.get('change_type');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = sql`
      SELECT sh.*, p.name as product_name
      FROM stock_history sh
      LEFT JOIN products p ON sh.product_id = p.id
      WHERE 1=1
    `;

    if (productId) {
      query = sql`
        SELECT sh.*, p.name as product_name
        FROM stock_history sh
        LEFT JOIN products p ON sh.product_id = p.id
        WHERE sh.product_id = ${parseInt(productId)}
      `;
    }

    if (sku) {
      query = sql`
        SELECT sh.*, p.name as product_name
        FROM stock_history sh
        LEFT JOIN products p ON sh.product_id = p.id
        WHERE sh.sku = ${sku}
      `;
    }

    if (changeType) {
      query = sql`
        SELECT sh.*, p.name as product_name
        FROM stock_history sh
        LEFT JOIN products p ON sh.product_id = p.id
        WHERE sh.change_type = ${changeType}
        ${productId ? sql`AND sh.product_id = ${parseInt(productId)}` : sql``}
        ${sku ? sql`AND sh.sku = ${sku}` : sql``}
      `;
    }

    const history = await sql`
      ${query}
      ORDER BY sh.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const total = await sql`
      SELECT COUNT(*) as count
      FROM stock_history sh
      WHERE 1=1
      ${productId ? sql`AND sh.product_id = ${parseInt(productId)}` : sql``}
      ${sku ? sql`AND sh.sku = ${sku}` : sql``}
      ${changeType ? sql`AND sh.change_type = ${changeType}` : sql``}
    `;

    return NextResponse.json({
      ok: true,
      history,
      total: parseInt(total[0]?.count || '0'),
      limit,
      offset
    });
  } catch (error: any) {
    console.error('Error fetching stock history:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

