import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aegis2024';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const providedPassword = authHeader?.replace('Bearer ', '');
  return providedPassword === ADMIN_PASSWORD;
}

// GET - Get reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    const sku = searchParams.get('sku');
    const status = searchParams.get('status') || 'approved'; // Only show approved by default
    const rating = searchParams.get('rating'); // Filter by rating (1-5)
    const verifiedOnly = searchParams.get('verified_only') === 'true';
    const sort = searchParams.get('sort') || 'newest'; // newest, oldest, helpful, rating_high, rating_low
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!productId && !sku) {
      return NextResponse.json(
        { ok: false, error: 'product_id or sku is required' },
        { status: 400 }
      );
    }

    // Get product ID if SKU provided
    let productIdNum: number | null = null;
    if (sku) {
      const [product] = await sql`
        SELECT id FROM products WHERE sku = ${sku} LIMIT 1
      `;
      if (!product) {
        return NextResponse.json(
          { ok: false, error: 'Product not found' },
          { status: 404 }
        );
      }
      productIdNum = product.id;
    } else {
      productIdNum = parseInt(productId!);
    }

    // Build query
    let query = sql`
      SELECT r.*,
             (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
      FROM reviews r
      WHERE r.product_id = ${productIdNum}
        AND r.status = ${status}
    `;

    if (rating) {
      query = sql`
        SELECT r.*,
               (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
        FROM reviews r
        WHERE r.product_id = ${productIdNum}
          AND r.status = ${status}
          AND r.rating = ${parseInt(rating)}
      `;
    }

    if (verifiedOnly) {
      query = sql`
        SELECT r.*,
               (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
        FROM reviews r
        WHERE r.product_id = ${productIdNum}
          AND r.status = ${status}
          AND r.verified_purchase = true
        ${rating ? sql`AND r.rating = ${parseInt(rating)}` : sql``}
      `;
    }

    // Sort
    let orderBy = 'r.created_at DESC';
    switch (sort) {
      case 'oldest':
        orderBy = 'r.created_at ASC';
        break;
      case 'helpful':
        orderBy = 'helpful_count DESC, r.created_at DESC';
        break;
      case 'rating_high':
        orderBy = 'r.rating DESC, r.created_at DESC';
        break;
      case 'rating_low':
        orderBy = 'r.rating ASC, r.created_at DESC';
        break;
      default:
        orderBy = 'r.created_at DESC';
    }

    const reviews = await sql`
      ${query}
      ORDER BY ${sql.raw(orderBy)}
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    // Get total count
    const totalQuery = sql`
      SELECT COUNT(*) as count
      FROM reviews r
      WHERE r.product_id = ${productIdNum}
        AND r.status = ${status}
      ${rating ? sql`AND r.rating = ${parseInt(rating)}` : sql``}
      ${verifiedOnly ? sql`AND r.verified_purchase = true` : sql``}
    `;
    const totalResult = await totalQuery;
    const total = parseInt(totalResult[0]?.count || '0');

    // Get rating distribution
    const distribution = await sql`
      SELECT 
        rating,
        COUNT(*) as count
      FROM reviews
      WHERE product_id = ${productIdNum}
        AND status = 'approved'
      GROUP BY rating
      ORDER BY rating DESC
    `;

    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };

    distribution.forEach((row: any) => {
      ratingDistribution[row.rating as keyof typeof ratingDistribution] = parseInt(row.count);
    });

    return NextResponse.json({
      ok: true,
      reviews,
      total,
      limit,
      offset,
      rating_distribution: ratingDistribution
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Create new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, sku, user_name, user_email, rating, title, review_text, images, user_id } = body;

    if (!product_id && !sku) {
      return NextResponse.json(
        { ok: false, error: 'product_id or sku is required' },
        { status: 400 }
      );
    }

    if (!user_name || !rating || !review_text) {
      return NextResponse.json(
        { ok: false, error: 'user_name, rating, and review_text are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { ok: false, error: 'rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Get product ID if SKU provided
    let productIdNum: number;
    let productSku: string;
    if (sku) {
      const [product] = await sql`
        SELECT id, sku FROM products WHERE sku = ${sku} LIMIT 1
      `;
      if (!product) {
        return NextResponse.json(
          { ok: false, error: 'Product not found' },
          { status: 404 }
        );
      }
      productIdNum = product.id;
      productSku = product.sku;
    } else {
      productIdNum = parseInt(product_id);
      const [product] = await sql`
        SELECT sku FROM products WHERE id = ${productIdNum} LIMIT 1
      `;
      if (!product) {
        return NextResponse.json(
          { ok: false, error: 'Product not found' },
          { status: 404 }
        );
      }
      productSku = product.sku;
    }

    // Check if user has purchased this product (for verified purchase)
    let verifiedPurchase = false;
    if (user_email || user_id) {
      // Check orders table for purchase verification
      // This is a placeholder - you'll need to implement based on your orders structure
      const hasOrder = await sql`
        SELECT COUNT(*) as count
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE oi.product_sku = ${productSku}
          AND (o.customer_email = ${user_email || ''} OR o.user_id = ${user_id || null})
          AND o.status IN ('completed', 'paid', 'shipped')
        LIMIT 1
      `.catch(() => [{ count: 0 }]);
      
      verifiedPurchase = parseInt(hasOrder[0]?.count || '0') > 0;
    }

    // Create review
    const [review] = await sql`
      INSERT INTO reviews (
        product_id, sku, user_id, user_name, user_email,
        rating, title, review_text, images, verified_purchase, status
      )
      VALUES (
        ${productIdNum}, ${productSku}, ${user_id || null},
        ${user_name}, ${user_email || null}, ${rating},
        ${title || null}, ${review_text}, ${images ? JSON.stringify(images) : null},
        ${verifiedPurchase}, 'pending'
      )
      RETURNING *
    `;

    return NextResponse.json({
      ok: true,
      review,
      message: 'Review submitted successfully. It will be reviewed before publication.'
    });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

