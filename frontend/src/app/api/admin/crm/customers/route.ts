/**
 * Admin CRM Customers API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get all customers with CRM data
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    // Get customers with order stats
    const customers = await sql`
      SELECT 
        u.id,
        u.email,
        u.name,
        u.phone,
        COALESCE(COUNT(DISTINCT o.order_id), 0) as total_orders,
        COALESCE(SUM(o.total), 0) as total_spent,
        COALESCE(lp.points, 0) as loyalty_points,
        COALESCE(lp.tier, 'Bronze') as loyalty_tier,
        MAX(o.created_at) as last_order_date,
        u.created_at
      FROM users u
      LEFT JOIN orders o ON u.email = o.customer_email
      LEFT JOIN loyalty_points lp ON u.id = lp.user_id OR u.email = lp.user_email
      GROUP BY u.id, u.email, u.name, u.phone, lp.points, lp.tier, u.created_at
      ORDER BY total_spent DESC
      LIMIT 100
    `.catch(() => []);

    // Calculate stats
    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((sum: number, c: any) => sum + (parseFloat(c.total_spent) || 0), 0);
    const averageOrderValue = totalCustomers > 0
      ? totalRevenue / customers.reduce((sum: number, c: any) => sum + (parseInt(c.total_orders) || 0), 0)
      : 0;

    const topCustomers = customers
      .sort((a: any, b: any) => parseFloat(b.total_spent) - parseFloat(a.total_spent))
      .slice(0, 10)
      .map((c: any) => ({
        id: c.id,
        email: c.email,
        name: c.name,
        total_orders: parseInt(c.total_orders) || 0,
        total_spent: parseFloat(c.total_spent) || 0,
        loyalty_points: parseInt(c.loyalty_points) || 0,
        loyalty_tier: c.loyalty_tier || 'Bronze',
      }));

    return NextResponse.json({
      ok: true,
      customers: customers.map((c: any) => ({
        id: c.id,
        email: c.email,
        name: c.name,
        phone: c.phone,
        total_orders: parseInt(c.total_orders) || 0,
        total_spent: parseFloat(c.total_spent) || 0,
        loyalty_points: parseInt(c.loyalty_points) || 0,
        loyalty_tier: c.loyalty_tier || 'Bronze',
        last_order_date: c.last_order_date,
        created_at: c.created_at,
      })),
      stats: {
        totalCustomers,
        totalRevenue,
        averageOrderValue: averageOrderValue || 0,
        topCustomers,
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching CRM data:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch CRM data' },
      { status: 500 }
    );
  }
}

