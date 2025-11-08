/**
 * Product Recommendations API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get personalized product recommendations
export async function GET(request: NextRequest) {
  try {
    // Try to get user from token
    let userId: number | null = null;
    try {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        // In a real implementation, verify JWT and get user ID
        // For now, we'll use a simple approach
      }
    } catch (e) {
      // No user token, continue with general recommendations
    }

    // Get popular products or products based on user history
    // For now, return popular products
    const products = await sql`
      SELECT 
        p.id, p.name, p.price, p.image, p.sku, p.category
      FROM products p
      WHERE p.is_active = true
      ORDER BY 
        (SELECT COUNT(*) FROM order_items WHERE sku = p.sku) DESC,
        p.created_at DESC
      LIMIT 12
    `.catch(() => []);

    return NextResponse.json({
      ok: true,
      products,
    });
  } catch (error: any) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

