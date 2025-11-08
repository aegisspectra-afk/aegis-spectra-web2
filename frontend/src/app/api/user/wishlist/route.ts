/**
 * User Wishlist API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get user wishlist
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const items = await sql`
      SELECT 
        w.*,
        p.name,
        p.price,
        p.image,
        p.sku
      FROM wishlist w
      LEFT JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ${user.id}
      ORDER BY w.created_at DESC
    `.catch(() => []);

    return NextResponse.json({
      ok: true,
      items,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

