/**
 * Admin Blog Posts API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get all blog posts
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = sql`
      SELECT * FROM blog_posts
      WHERE 1=1
    `;

    if (status && status !== 'all') {
      query = sql`${query} AND status = ${status}`;
    }

    if (category && category !== 'all') {
      query = sql`${query} AND category = ${category}`;
    }

    query = sql`${query} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const posts = await query.catch(() => []);

    return NextResponse.json({
      ok: true,
      posts,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      featured,
      status,
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { ok: false, error: 'title, slug, and content are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const [existing] = await sql`
      SELECT id FROM blog_posts WHERE slug = ${slug} LIMIT 1
    `.catch(() => []);

    if (existing) {
      return NextResponse.json(
        { ok: false, error: 'Slug already exists' },
        { status: 400 }
      );
    }

    // Create post
    const [newPost] = await sql`
      INSERT INTO blog_posts (
        title, slug, excerpt, content, category, tags, featured, status,
        author_name, author_email, published_at
      )
      VALUES (
        ${title}, ${slug}, ${excerpt || ''}, ${content}, ${category || 'כללי'},
        ${tags ? JSON.stringify(tags) : '[]'}, ${featured || false},
        ${status || 'draft'}, ${admin.name || 'Admin'}, ${admin.email},
        ${status === 'published' ? new Date().toISOString() : null}
      )
      RETURNING *
    `.catch(() => []);

    if (!newPost) {
      return NextResponse.json(
        { ok: false, error: 'Failed to create blog post' },
        { status: 500 }
      );
    }

    // Create audit log
    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.BLOG_POST_CREATED,
      'blog_post',
      newPost.id,
      { title, slug },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      post: newPost,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

