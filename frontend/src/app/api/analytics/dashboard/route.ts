import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireManager } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get analytics dashboard data
export async function GET(request: NextRequest) {
  try {
    // Require manager/admin role
    await requireManager(request);

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Sales metrics - with error handling
    let salesMetrics: any[] = [];
    try {
      salesMetrics = await sql`
        SELECT 
          COUNT(*) as total_orders,
          COALESCE(SUM(total_amount), 0) as total_revenue,
          COALESCE(AVG(total_amount), 0) as average_order_value,
          COUNT(DISTINCT customer_email) as unique_customers
        FROM orders
        WHERE status IN ('completed', 'paid', 'shipped')
        ${startDate ? sql`AND created_at >= ${startDate}` : sql``}
        ${endDate ? sql`AND created_at <= ${endDate}` : sql``}
      `;
    } catch (err: any) {
      console.error('Error fetching sales metrics:', err);
      // If table doesn't exist, return empty metrics
      salesMetrics = [{
        total_orders: 0,
        total_revenue: 0,
        average_order_value: 0,
        unique_customers: 0
      }];
    }

    // Product metrics - with error handling
    let productMetrics: any[] = [];
    try {
      productMetrics = await sql`
        SELECT 
          COUNT(*) as total_products,
          COUNT(*) FILTER (WHERE stock > 0 OR stock IS NULL) as in_stock_products,
          COUNT(*) FILTER (WHERE stock <= 0) as out_of_stock_products,
          COUNT(*) FILTER (WHERE low_stock_alert = true) as low_stock_products,
          COALESCE(SUM(stock), 0) as total_stock_value
        FROM products
        WHERE active = true OR active IS NULL
      `;
    } catch (err: any) {
      console.error('Error fetching product metrics:', err);
      productMetrics = [{
        total_products: 0,
        in_stock_products: 0,
        out_of_stock_products: 0,
        low_stock_products: 0,
        total_stock_value: 0
      }];
    }

    // Top products - with error handling
    let topProducts: any[] = [];
    try {
      topProducts = await sql`
        SELECT 
          p.id,
          p.sku,
          p.name,
          COALESCE(SUM(oi.quantity), 0) as total_sold,
          COALESCE(SUM(oi.price * oi.quantity), 0) as total_revenue
        FROM products p
        LEFT JOIN order_items oi ON p.sku = oi.product_sku
        LEFT JOIN orders o ON oi.order_id = o.id
        WHERE o.status IN ('completed', 'paid', 'shipped') OR o.status IS NULL
          ${startDate ? sql`AND o.created_at >= ${startDate}` : sql``}
          ${endDate ? sql`AND o.created_at <= ${endDate}` : sql``}
        GROUP BY p.id, p.sku, p.name
        ORDER BY total_sold DESC
        LIMIT 10
      `;
    } catch (err: any) {
      console.error('Error fetching top products:', err);
      topProducts = [];
    }

    // Sales by day - with error handling
    let salesByDay: any[] = [];
    try {
      salesByDay = await sql`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as order_count,
          COALESCE(SUM(total_amount), 0) as revenue
        FROM orders
        WHERE status IN ('completed', 'paid', 'shipped')
          ${startDate ? sql`AND created_at >= ${startDate}` : sql``}
          ${endDate ? sql`AND created_at <= ${endDate}` : sql``}
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
      `;
    } catch (err: any) {
      console.error('Error fetching sales by day:', err);
      salesByDay = [];
    }

    // Customer metrics - with error handling
    let customerMetrics: any[] = [];
    try {
      // Get total users count
      const userCount = await sql`
        SELECT COUNT(*) as total_users FROM users
      `.catch(() => [{ total_users: 0 }]);
      
      customerMetrics = [{
        total_customers: parseInt(userCount[0]?.total_users || '0'),
        new_customers_30d: 0,
        new_customers_7d: 0
      }];
    } catch (err: any) {
      console.error('Error fetching customer metrics:', err);
      customerMetrics = [{
        total_customers: 0,
        new_customers_30d: 0,
        new_customers_7d: 0
      }];
    }

    // Support tickets - with error handling
    let supportMetrics: any[] = [];
    try {
      supportMetrics = await sql`
        SELECT 
          COUNT(*) as total_tickets,
          COUNT(*) FILTER (WHERE status = 'open') as open_tickets,
          COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_tickets,
          COUNT(*) FILTER (WHERE status = 'resolved') as resolved_tickets,
          COALESCE(AVG(EXTRACT(EPOCH FROM (COALESCE(resolved_at, NOW()) - created_at))/3600), 0) as avg_resolution_hours
        FROM support_tickets
        ${startDate ? sql`WHERE created_at >= ${startDate}` : sql``}
        ${endDate ? sql`AND created_at <= ${endDate}` : sql``}
      `;
    } catch (err: any) {
      console.error('Error fetching support metrics:', err);
      supportMetrics = [{
        total_tickets: 0,
        open_tickets: 0,
        in_progress_tickets: 0,
        resolved_tickets: 0,
        avg_resolution_hours: 0
      }];
    }

    const dashboard = salesMetrics[0] || {};
    const products = productMetrics[0] || {};
    const customers = customerMetrics[0] || {};
    const support = supportMetrics[0] || {};

    return NextResponse.json({
      ok: true,
      stats: {
        totalSales: parseInt(dashboard.total_orders || '0'),
        totalRevenue: parseFloat(dashboard.total_revenue || '0'),
        totalOrders: parseInt(dashboard.total_orders || '0'),
        totalCustomers: parseInt(customers.total_customers || '0'),
        activeTickets: parseInt(support.open_tickets || '0'),
        lowStockAlerts: parseInt(products.low_stock_products || '0'),
        topProducts: (topProducts || []).map((p: any) => ({
          name: p.name,
          sales: parseInt(p.total_sold || '0'),
          revenue: parseFloat(p.total_revenue || '0'),
        })),
        salesByDay: (salesByDay || []).map((d: any) => ({
          date: d.date,
          sales: parseInt(d.order_count || '0'),
          revenue: parseFloat(d.revenue || '0'),
        })),
      },
      dashboard: {
        sales: dashboard,
        products: products,
        customers: customers,
        support: support,
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

