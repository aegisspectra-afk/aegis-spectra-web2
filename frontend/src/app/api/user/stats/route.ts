import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { neon } from '@netlify/neon';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for stats');
  sql = null;
}

export const dynamic = 'force-dynamic';

// GET - Get user statistics
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    // If no database, return default stats
    if (!sql) {
      console.log('Database not available, using fallback stats');
      return NextResponse.json({
        ok: true,
        stats: {
          total_orders: 0,
          total_spent: 0,
          total_points: 0,
          average_order_value: 0,
          orders_this_month: 0,
          points_this_month: 0,
        },
      });
    }

    try {
      // Get order stats
      const orderStats = await sql`
        SELECT 
          COUNT(*) as total_orders,
          COALESCE(SUM(total), 0) as total_spent,
          COALESCE(AVG(total), 0) as average_order_value,
          COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', NOW())) as orders_this_month
        FROM orders
        WHERE user_id = ${user.id} OR customer_email = ${user.email}
      `.catch(() => [{ total_orders: 0, total_spent: 0, average_order_value: 0, orders_this_month: 0 }]);

      // Get loyalty points stats
      const pointsStats = await sql`
        SELECT 
          COALESCE(SUM(points), 0) as total_points,
          COALESCE(SUM(points) FILTER (WHERE created_at >= DATE_TRUNC('month', NOW())), 0) as points_this_month
        FROM loyalty_transactions
        WHERE (user_id = ${user.id} OR user_email = ${user.email}) AND transaction_type = 'earn'
      `.catch(() => [{ total_points: 0, points_this_month: 0 }]);

      const orderData = orderStats[0] || {};
      const pointsData = pointsStats[0] || {};

      return NextResponse.json({
        ok: true,
        stats: {
          total_orders: parseInt(orderData.total_orders || 0),
          total_spent: parseInt(orderData.total_spent || 0),
          total_points: parseInt(pointsData.total_points || 0),
          average_order_value: parseInt(orderData.average_order_value || 0),
          orders_this_month: parseInt(orderData.orders_this_month || 0),
          points_this_month: parseInt(pointsData.points_this_month || 0),
        },
      });
    } catch (dbError: any) {
      console.error('Database error fetching stats:', dbError);
      return NextResponse.json({
        ok: true,
        stats: {
          total_orders: 0,
          total_spent: 0,
          total_points: 0,
          average_order_value: 0,
          orders_this_month: 0,
          points_this_month: 0,
        },
      });
    }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

