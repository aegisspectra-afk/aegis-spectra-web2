import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aegis2024';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const providedPassword = authHeader?.replace('Bearer ', '');
  return providedPassword === ADMIN_PASSWORD;
}

// GET - Get analytics dashboard data
export async function GET(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Sales metrics
    const salesMetrics = await sql`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order_value,
        COUNT(DISTINCT customer_email) as unique_customers
      FROM orders
      WHERE status IN ('completed', 'paid', 'shipped')
      ${startDate ? sql`AND created_at >= ${startDate}` : sql``}
      ${endDate ? sql`AND created_at <= ${endDate}` : sql``}
    `;

    // Product metrics
    const productMetrics = await sql`
      SELECT 
        COUNT(*) as total_products,
        COUNT(*) FILTER (WHERE stock > 0 OR stock IS NULL) as in_stock_products,
        COUNT(*) FILTER (WHERE stock <= 0) as out_of_stock_products,
        COUNT(*) FILTER (WHERE low_stock_alert = true) as low_stock_products,
        SUM(stock) as total_stock_value
      FROM products
      WHERE active = true
    `;

    // Top products
    const topProducts = await sql`
      SELECT 
        p.id,
        p.sku,
        p.name,
        SUM(oi.quantity) as total_sold,
        SUM(oi.price * oi.quantity) as total_revenue
      FROM products p
      LEFT JOIN order_items oi ON p.sku = oi.product_sku
      LEFT JOIN orders o ON oi.order_id = o.id
      WHERE o.status IN ('completed', 'paid', 'shipped')
        ${startDate ? sql`AND o.created_at >= ${startDate}` : sql``}
        ${endDate ? sql`AND o.created_at <= ${endDate}` : sql``}
      GROUP BY p.id, p.sku, p.name
      ORDER BY total_sold DESC
      LIMIT 10
    `;

    // Sales by day
    const salesByDay = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as order_count,
        SUM(total_amount) as revenue
      FROM orders
      WHERE status IN ('completed', 'paid', 'shipped')
        ${startDate ? sql`AND created_at >= ${startDate}` : sql``}
        ${endDate ? sql`AND created_at <= ${endDate}` : sql``}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `;

    // Customer metrics
    const customerMetrics = await sql`
      SELECT 
        COUNT(DISTINCT customer_email) as total_customers,
        COUNT(DISTINCT customer_email) FILTER (
          WHERE created_at >= NOW() - INTERVAL '30 days'
        ) as new_customers_30d,
        COUNT(DISTINCT customer_email) FILTER (
          WHERE created_at >= NOW() - INTERVAL '7 days'
        ) as new_customers_7d
      FROM orders
    `;

    // Support tickets
    const supportMetrics = await sql`
      SELECT 
        COUNT(*) as total_tickets,
        COUNT(*) FILTER (WHERE status = 'open') as open_tickets,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_tickets,
        COUNT(*) FILTER (WHERE status = 'resolved') as resolved_tickets,
        AVG(EXTRACT(EPOCH FROM (COALESCE(resolved_at, NOW()) - created_at))/3600) as avg_resolution_hours
      FROM support_tickets
      ${startDate ? sql`WHERE created_at >= ${startDate}` : sql``}
      ${endDate ? sql`AND created_at <= ${endDate}` : sql``}
    `;

    return NextResponse.json({
      ok: true,
      dashboard: {
        sales: salesMetrics[0] || {},
        products: productMetrics[0] || {},
        customers: customerMetrics[0] || {},
        support: supportMetrics[0] || {},
        top_products: topProducts,
        sales_by_day: salesByDay
      }
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

