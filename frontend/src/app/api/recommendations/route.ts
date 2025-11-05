import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get product recommendations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    const sku = searchParams.get('sku');
    const userId = searchParams.get('user_id');
    const type = searchParams.get('type') || 'similar'; // similar, related, popular, personalized
    const limit = parseInt(searchParams.get('limit') || '8');

    if (!productId && !sku && type !== 'personalized' && type !== 'popular') {
      return NextResponse.json(
        { ok: false, error: 'product_id or sku is required for similar/related recommendations' },
        { status: 400 }
      );
    }

    let recommendations: any[] = [];

    switch (type) {
      case 'similar':
        // Similar products based on category, tags, specs
        if (productId) {
          recommendations = await getSimilarProducts(productId, limit);
        } else if (sku) {
          recommendations = await getSimilarProducts(sku, limit);
        }
        break;

      case 'related':
        // Related products (bought together)
        if (productId) {
          recommendations = await getRelatedProducts(productId, limit);
        } else if (sku) {
          recommendations = await getRelatedProducts(sku, limit);
        }
        break;

      case 'popular':
        // Popular products
        recommendations = await getPopularProducts(limit);
        break;

      case 'personalized':
        // Personalized recommendations based on user history
        if (!userId) {
          return NextResponse.json(
            { ok: false, error: 'user_id is required for personalized recommendations' },
            { status: 400 }
          );
        }
        recommendations = await getPersonalizedRecommendations(userId, limit);
        break;

      default:
        if (productId) {
          recommendations = await getSimilarProducts(productId, limit);
        } else if (sku) {
          recommendations = await getSimilarProducts(sku, limit);
        } else {
          recommendations = await getPopularProducts(limit);
        }
    }

    return NextResponse.json({
      ok: true,
      recommendations,
      type,
      count: recommendations.length
    });
  } catch (error: any) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

// Get similar products based on category, tags, specs
async function getSimilarProducts(productIdOrSku: string, limit: number) {
  const sql = neon();
  
  // Try to get product by ID or SKU
  let product: any;
  if (isNaN(parseInt(productIdOrSku))) {
    [product] = await sql`
      SELECT * FROM products WHERE sku = ${productIdOrSku} LIMIT 1
    `;
  } else {
    [product] = await sql`
      SELECT * FROM products WHERE id = ${parseInt(productIdOrSku)} LIMIT 1
    `;
  }

  if (!product) {
    return [];
  }

  // Get similar products by category
  const similar = await sql`
    SELECT p.*,
           CASE 
             WHEN p.category = ${product.category} THEN 3
             WHEN p.brand = ${product.brand} THEN 2
             ELSE 1
           END as similarity_score
    FROM products p
    WHERE p.id != ${product.id}
      AND p.active = true
      AND (p.stock IS NULL OR p.stock > 0)
    ORDER BY similarity_score DESC, p.created_at DESC
    LIMIT ${limit}
  `;

  return similar;
}

// Get related products (bought together)
async function getRelatedProducts(productIdOrSku: string, limit: number) {
  const sql = neon();
  
  // Try to get product by ID or SKU
  let product: any;
  if (isNaN(parseInt(productIdOrSku))) {
    [product] = await sql`
      SELECT * FROM products WHERE sku = ${productIdOrSku} LIMIT 1
    `;
  } else {
    [product] = await sql`
      SELECT * FROM products WHERE id = ${parseInt(productIdOrSku)} LIMIT 1
    `;
  }

  if (!product) {
    return [];
  }

  // Get products that are often bought together
  // This is a simplified version - in production, you'd analyze order history
  const related = await sql`
    SELECT DISTINCT p.*
    FROM products p
    WHERE p.id != ${product.id}
      AND p.active = true
      AND (p.stock IS NULL OR p.stock > 0)
      AND (
        p.category = ${product.category}
        OR p.brand = ${product.brand}
      )
    ORDER BY p.created_at DESC
    LIMIT ${limit}
  `;

  return related;
}

// Get popular products
async function getPopularProducts(limit: number) {
  const sql = neon();
  
  // Get products sorted by rating, reviews, and sales
  const popular = await sql`
    SELECT p.*,
           COALESCE(p.rating_avg, 0) as rating,
           COALESCE(p.review_count, 0) as reviews
    FROM products p
    WHERE p.active = true
      AND (p.stock IS NULL OR p.stock > 0)
    ORDER BY 
      COALESCE(p.rating_avg, 0) DESC,
      COALESCE(p.review_count, 0) DESC,
      p.created_at DESC
    LIMIT ${limit}
  `;

  return popular;
}

// Get personalized recommendations based on user history
async function getPersonalizedRecommendations(userId: string, limit: number) {
  const sql = neon();
  
  // Get user's order history
  const userOrders = await sql`
    SELECT oi.product_sku, oi.product_category, oi.product_brand
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ${parseInt(userId)}
      OR o.customer_email = (SELECT email FROM users WHERE id = ${parseInt(userId)} LIMIT 1)
    LIMIT 50
  `.catch(() => []);

  if (userOrders.length === 0) {
    // If no order history, return popular products
    return getPopularProducts(limit);
  }

  // Get most common categories and brands
  const categories = userOrders.map((o: any) => o.product_category).filter(Boolean);
  const brands = userOrders.map((o: any) => o.product_brand).filter(Boolean);

  // Get recommendations based on user preferences
  const personalized = await sql`
    SELECT p.*,
           CASE 
             WHEN p.category = ANY(${categories}) THEN 3
             WHEN p.brand = ANY(${brands}) THEN 2
             ELSE 1
           END as preference_score
    FROM products p
    WHERE p.active = true
      AND (p.stock IS NULL OR p.stock > 0)
      AND p.id NOT IN (
        SELECT DISTINCT product_id 
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE o.user_id = ${parseInt(userId)}
          OR o.customer_email = (SELECT email FROM users WHERE id = ${parseInt(userId)} LIMIT 1)
      )
    ORDER BY preference_score DESC, p.created_at DESC
    LIMIT ${limit}
  `.catch(() => getPopularProducts(limit));

  return personalized;
}

