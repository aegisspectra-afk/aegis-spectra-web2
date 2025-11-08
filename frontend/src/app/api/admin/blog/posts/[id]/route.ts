/**
 * Admin Blog Post API - Get, Update, Delete specific post
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const [post] = await sql`
      SELECT * FROM blog_posts WHERE id = ${id} LIMIT 1
    `.catch(() => []);

    if (!post) {
      return NextResponse.json(
        { ok: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      post,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching post:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PATCH - Update post
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    // Get current post
    const [currentPost] = await sql`
      SELECT * FROM blog_posts WHERE id = ${id} LIMIT 1
    `.catch(() => []);

    if (!currentPost) {
      return NextResponse.json(
        { ok: false, error: 'Post not found' },
        { status: 404 }
      );
    }

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

    // Check if slug already exists (if changed)
    if (slug && slug !== currentPost.slug) {
      const [existing] = await sql`
        SELECT id FROM blog_posts WHERE slug = ${slug} AND id != ${id} LIMIT 1
      `.catch(() => []);

      if (existing) {
        return NextResponse.json(
          { ok: false, error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update post
    const [updatedPost] = await sql`
      UPDATE blog_posts
      SET 
        title = COALESCE(${title || null}, title),
        slug = COALESCE(${slug || null}, slug),
        excerpt = COALESCE(${excerpt !== undefined ? excerpt : null}, excerpt),
        content = COALESCE(${content || null}, content),
        category = COALESCE(${category || null}, category),
        tags = COALESCE(${tags ? JSON.stringify(tags) : null}, tags),
        featured = COALESCE(${featured !== undefined ? featured : null}, featured),
        status = COALESCE(${status || null}, status),
        published_at = CASE 
          WHEN ${status === 'published'} AND status != 'published' THEN NOW()
          WHEN ${status !== 'published'} AND status = 'published' THEN NULL
          ELSE published_at
        END,
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `.catch(() => []);

    if (!updatedPost) {
      return NextResponse.json(
        { ok: false, error: 'Failed to update post' },
        { status: 500 }
      );
    }

    // Create audit log
    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.BLOG_POST_UPDATED,
      'blog_post',
      id,
      { changes: Object.keys(body) },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      post: updatedPost,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error updating post:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;

    // Delete post
    await sql`
      DELETE FROM blog_posts WHERE id = ${id}
    `.catch(() => {
      throw new Error('Failed to delete post');
    });

    // Create audit log
    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.BLOG_POST_DELETED,
      'blog_post',
      id,
      {},
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      message: 'Post deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error deleting post:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}

