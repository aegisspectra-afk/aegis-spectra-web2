/**
 * Admin Global Search API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Global search
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const types = searchParams.get('types')?.split(',') || [];
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const status = searchParams.get('status');

    if (!query.trim()) {
      return NextResponse.json({
        ok: true,
        results: [],
      });
    }

    const results: any[] = [];
    const searchTerm = `%${query}%`;

    // Search Orders
    if (types.length === 0 || types.includes('order')) {
      let ordersQuery = sql`
        SELECT 
          order_id as id,
          customer_name as title,
          customer_email as description,
          'order' as type,
          '/admin/orders/' || order_id as url,
          json_build_object('status', status, 'total', total, 'date', created_at) as metadata
        FROM orders
        WHERE 
          order_id::text ILIKE ${searchTerm} OR
          customer_name ILIKE ${searchTerm} OR
          customer_email ILIKE ${searchTerm} OR
          customer_phone ILIKE ${searchTerm}
      `;
      if (dateFrom) {
        ordersQuery = sql`${ordersQuery} AND created_at >= ${dateFrom}`;
      }
      if (dateTo) {
        ordersQuery = sql`${ordersQuery} AND created_at <= ${dateTo}`;
      }
      if (status) {
        ordersQuery = sql`${ordersQuery} AND status = ${status}`;
      }
      ordersQuery = sql`${ordersQuery} LIMIT 10`;
      const orders = await ordersQuery.catch(() => []);
      results.push(...orders);
    }

    // Search Products
    if (types.length === 0 || types.includes('product')) {
      let productsQuery = sql`
        SELECT 
          id,
          name as title,
          description,
          'product' as type,
          '/admin/products/' || id as url,
          json_build_object('sku', sku, 'price', price, 'stock', stock) as metadata
        FROM products
        WHERE 
          sku ILIKE ${searchTerm} OR
          name ILIKE ${searchTerm} OR
          description ILIKE ${searchTerm}
      `;
      if (status) {
        productsQuery = sql`${productsQuery} AND active = ${status === 'active'}`;
      }
      productsQuery = sql`${productsQuery} LIMIT 10`;
      const products = await productsQuery.catch(() => []);
      results.push(...products);
    }

    // Search Users
    if (types.length === 0 || types.includes('user')) {
      let usersQuery = sql`
        SELECT 
          id,
          name as title,
          email as description,
          'user' as type,
          '/admin/users/' || id as url,
          json_build_object('email', email, 'phone', phone, 'role', role) as metadata
        FROM users
        WHERE 
          email ILIKE ${searchTerm} OR
          name ILIKE ${searchTerm} OR
          phone ILIKE ${searchTerm}
      `;
      if (dateFrom) {
        usersQuery = sql`${usersQuery} AND created_at >= ${dateFrom}`;
      }
      if (dateTo) {
        usersQuery = sql`${usersQuery} AND created_at <= ${dateTo}`;
      }
      if (status) {
        usersQuery = sql`${usersQuery} AND status = ${status}`;
      }
      usersQuery = sql`${usersQuery} LIMIT 10`;
      const users = await usersQuery.catch(() => []);
      results.push(...users);
    }

    // Search Leads
    if (types.length === 0 || types.includes('lead')) {
      let leadsQuery = sql`
        SELECT 
          id,
          name as title,
          phone as description,
          'lead' as type,
          '/admin/leads/' || id as url,
          json_build_object('email', email, 'city', city, 'product', product_sku) as metadata
        FROM leads
        WHERE 
          name ILIKE ${searchTerm} OR
          phone ILIKE ${searchTerm} OR
          email ILIKE ${searchTerm} OR
          city ILIKE ${searchTerm}
      `;
      if (dateFrom) {
        leadsQuery = sql`${leadsQuery} AND created_at >= ${dateFrom}`;
      }
      if (dateTo) {
        leadsQuery = sql`${leadsQuery} AND created_at <= ${dateTo}`;
      }
      leadsQuery = sql`${leadsQuery} LIMIT 10`;
      const leads = await leadsQuery.catch(() => []);
      results.push(...leads);
    }

    // Search Reviews
    if (types.length === 0 || types.includes('review')) {
      let reviewsQuery = sql`
        SELECT 
          id,
          COALESCE(title, 'ביקורת') as title,
          review_text as description,
          'review' as type,
          '/admin/reviews/' || id as url,
          json_build_object('rating', rating, 'status', status, 'sku', sku) as metadata
        FROM reviews
        WHERE 
          user_name ILIKE ${searchTerm} OR
          review_text ILIKE ${searchTerm} OR
          title ILIKE ${searchTerm}
      `;
      if (dateFrom) {
        reviewsQuery = sql`${reviewsQuery} AND created_at >= ${dateFrom}`;
      }
      if (dateTo) {
        reviewsQuery = sql`${reviewsQuery} AND created_at <= ${dateTo}`;
      }
      if (status) {
        reviewsQuery = sql`${reviewsQuery} AND status = ${status}`;
      }
      reviewsQuery = sql`${reviewsQuery} LIMIT 10`;
      const reviews = await reviewsQuery.catch(() => []);
      results.push(...reviews);
    }

    // Search Blog Posts
    if (types.length === 0 || types.includes('blog')) {
      let blogQuery = sql`
        SELECT 
          id,
          title,
          excerpt as description,
          'blog' as type,
          '/admin/blog/' || id as url,
          json_build_object('category', category, 'status', status, 'views', views) as metadata
        FROM blog_posts
        WHERE 
          title ILIKE ${searchTerm} OR
          excerpt ILIKE ${searchTerm} OR
          content ILIKE ${searchTerm}
      `;
      if (dateFrom) {
        blogQuery = sql`${blogQuery} AND created_at >= ${dateFrom}`;
      }
      if (dateTo) {
        blogQuery = sql`${blogQuery} AND created_at <= ${dateTo}`;
      }
      if (status) {
        blogQuery = sql`${blogQuery} AND status = ${status}`;
      }
      blogQuery = sql`${blogQuery} LIMIT 10`;
      const blogPosts = await blogQuery.catch(() => []);
      results.push(...blogPosts);
    }

    return NextResponse.json({
      ok: true,
      results: results.slice(0, 50), // Limit total results
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error searching:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to search' },
      { status: 500 }
    );
  }
}

