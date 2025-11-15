import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for reviews');
  sql = null;
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aegis2024';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const providedPassword = authHeader?.replace('Bearer ', '');
  return providedPassword === ADMIN_PASSWORD;
}

// GET - Get reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
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

    // If no database, return empty reviews
    if (!sql) {
      console.log('Database not available, using fallback reviews');
      return NextResponse.json({
        ok: true,
        reviews: [],
        total: 0,
        limit,
        offset,
        rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      });
    }

    // Get product ID if SKU provided
    let productIdNum: number | null = null;
    if (sku) {
      const [product] = await sql`
        SELECT id FROM products WHERE sku = ${sku} LIMIT 1
      `.catch(() => []);
      if (!product) {
        return NextResponse.json({
          ok: true,
          reviews: [],
          total: 0,
          limit,
          offset,
          rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        });
      }
      productIdNum = product.id;
    } else {
      productIdNum = parseInt(productId!);
    }

    // Build the query based on filters and sorting
    let reviews: any[] = [];
    
    try {
      // Execute query based on filters and sort
    if (verifiedOnly && rating) {
      // Sort by helpful count first, then by sort parameter
      if (sort === 'helpful') {
        reviews = await sql`
          SELECT r.*,
                 (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
          FROM reviews r
          WHERE r.product_id = ${productIdNum}
            AND r.status = ${status}
            AND r.verified_purchase = true
            AND r.rating = ${parseInt(rating)}
          ORDER BY helpful_count DESC, r.created_at DESC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
      } else if (sort === 'oldest') {
        reviews = await sql`
          SELECT r.*,
                 (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
          FROM reviews r
          WHERE r.product_id = ${productIdNum}
            AND r.status = ${status}
            AND r.verified_purchase = true
            AND r.rating = ${parseInt(rating)}
          ORDER BY r.created_at ASC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
      } else if (sort === 'rating_high') {
        reviews = await sql`
          SELECT r.*,
                 (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
          FROM reviews r
          WHERE r.product_id = ${productIdNum}
            AND r.status = ${status}
            AND r.verified_purchase = true
            AND r.rating = ${parseInt(rating)}
          ORDER BY r.rating DESC, r.created_at DESC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
      } else if (sort === 'rating_low') {
        reviews = await sql`
          SELECT r.*,
                 (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
          FROM reviews r
          WHERE r.product_id = ${productIdNum}
            AND r.status = ${status}
            AND r.verified_purchase = true
            AND r.rating = ${parseInt(rating)}
          ORDER BY r.rating ASC, r.created_at DESC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
      } else {
        // Default: newest
        reviews = await sql`
          SELECT r.*,
                 (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
          FROM reviews r
          WHERE r.product_id = ${productIdNum}
            AND r.status = ${status}
            AND r.verified_purchase = true
            AND r.rating = ${parseInt(rating)}
          ORDER BY r.created_at DESC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
      }
    } else if (verifiedOnly) {
      if (sort === 'helpful') {
        reviews = await sql`
          SELECT r.*,
                 (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
          FROM reviews r
          WHERE r.product_id = ${productIdNum}
            AND r.status = ${status}
            AND r.verified_purchase = true
          ORDER BY helpful_count DESC, r.created_at DESC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
      } else if (sort === 'oldest') {
        reviews = await sql`
          SELECT r.*,
                 (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
          FROM reviews r
          WHERE r.product_id = ${productIdNum}
            AND r.status = ${status}
            AND r.verified_purchase = true
          ORDER BY r.created_at ASC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
      } else if (sort === 'rating_high') {
        reviews = await sql`
          SELECT r.*,
                 (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
          FROM reviews r
          WHERE r.product_id = ${productIdNum}
            AND r.status = ${status}
            AND r.verified_purchase = true
          ORDER BY r.rating DESC, r.created_at DESC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
      } else if (sort === 'rating_low') {
        reviews = await sql`
          SELECT r.*,
                 (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
          FROM reviews r
          WHERE r.product_id = ${productIdNum}
            AND r.status = ${status}
            AND r.verified_purchase = true
          ORDER BY r.rating ASC, r.created_at DESC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
      } else {
        reviews = await sql`
          SELECT r.*,
                 (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
          FROM reviews r
          WHERE r.product_id = ${productIdNum}
            AND r.status = ${status}
            AND r.verified_purchase = true
          ORDER BY r.created_at DESC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
      }
    } else if (rating) {
      if (sort === 'helpful') {
        reviews = await sql`
          SELECT r.*,
                 (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
          FROM reviews r
          WHERE r.product_id = ${productIdNum}
            AND r.status = ${status}
            AND r.rating = ${parseInt(rating)}
          ORDER BY helpful_count DESC, r.created_at DESC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
      } else if (sort === 'oldest') {
        reviews = await sql`
          SELECT r.*,
                 (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
          FROM reviews r
          WHERE r.product_id = ${productIdNum}
            AND r.status = ${status}
            AND r.rating = ${parseInt(rating)}
          ORDER BY r.created_at ASC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
      } else if (sort === 'rating_high') {
        reviews = await sql`
          SELECT r.*,
                 (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
          FROM reviews r
          WHERE r.product_id = ${productIdNum}
            AND r.status = ${status}
            AND r.rating = ${parseInt(rating)}
          ORDER BY r.rating DESC, r.created_at DESC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
      } else if (sort === 'rating_low') {
        reviews = await sql`
          SELECT r.*,
                 (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
          FROM reviews r
          WHERE r.product_id = ${productIdNum}
            AND r.status = ${status}
            AND r.rating = ${parseInt(rating)}
          ORDER BY r.rating ASC, r.created_at DESC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
      } else {
        reviews = await sql`
          SELECT r.*,
                 (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
          FROM reviews r
          WHERE r.product_id = ${productIdNum}
            AND r.status = ${status}
            AND r.rating = ${parseInt(rating)}
          ORDER BY r.created_at DESC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
      }
    } else {
      if (sort === 'helpful') {
        reviews = await sql`
          SELECT r.*,
                 (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
          FROM reviews r
          WHERE r.product_id = ${productIdNum}
            AND r.status = ${status}
          ORDER BY helpful_count DESC, r.created_at DESC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
      } else if (sort === 'oldest') {
        reviews = await sql`
          SELECT r.*,
                 (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
          FROM reviews r
          WHERE r.product_id = ${productIdNum}
            AND r.status = ${status}
          ORDER BY r.created_at ASC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
      } else if (sort === 'rating_high') {
        reviews = await sql`
          SELECT r.*,
                 (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
          FROM reviews r
          WHERE r.product_id = ${productIdNum}
            AND r.status = ${status}
          ORDER BY r.rating DESC, r.created_at DESC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
      } else if (sort === 'rating_low') {
        reviews = await sql`
          SELECT r.*,
                 (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
          FROM reviews r
          WHERE r.product_id = ${productIdNum}
            AND r.status = ${status}
          ORDER BY r.rating ASC, r.created_at DESC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
      } else {
        // Default: newest
        reviews = await sql`
          SELECT r.*,
                 (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
          FROM reviews r
          WHERE r.product_id = ${productIdNum}
            AND r.status = ${status}
          ORDER BY r.created_at DESC
          LIMIT ${limit}
          OFFSET ${offset}
        `;
      }
    }

      // Get total count
      const totalQuery = sql`
        SELECT COUNT(*) as count
        FROM reviews r
        WHERE r.product_id = ${productIdNum}
          AND r.status = ${status}
        ${rating ? sql`AND r.rating = ${parseInt(rating)}` : sql``}
        ${verifiedOnly ? sql`AND r.verified_purchase = true` : sql``}
      `;
      const totalResult = await totalQuery.catch(() => [{ count: 0 }]);
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
      `.catch(() => []);

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
    } catch (dbError: any) {
      console.error('Database error fetching reviews:', dbError);
      return NextResponse.json({
        ok: true,
        reviews: [],
        total: 0,
        limit,
        offset,
        rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      });
    }
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

    // If no database, return success for local dev
    if (!sql) {
      console.log('Database not available, skipping review creation for local dev');
      return NextResponse.json({
        ok: true,
        review: {
          id: Date.now(),
          product_id: product_id || 1,
          sku: sku || 'N/A',
          user_name,
          rating,
          title,
          review_text,
          status: 'pending'
        },
        message: 'Review submitted successfully (local dev mode)'
      });
    }

    // Get product ID if SKU provided
    let productIdNum: number;
    let productSku: string;
    if (sku) {
      const [product] = await sql`
        SELECT id, sku FROM products WHERE sku = ${sku} LIMIT 1
      `.catch(() => []);
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
      `.catch(() => []);
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
    `.catch(() => []);

    if (!review) {
      throw new Error('Failed to create review');
    }

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

