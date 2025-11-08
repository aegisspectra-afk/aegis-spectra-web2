/**
 * Admin SEO Management API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get all SEO data
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const seoData = await sql`
      SELECT * FROM seo_settings
      ORDER BY page
    `.catch(() => []);

    return NextResponse.json({
      ok: true,
      seoData,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching SEO data:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch SEO data' },
      { status: 500 }
    );
  }
}

// POST - Create or update SEO data
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();
    const {
      page,
      title,
      description,
      keywords,
      og_title,
      og_description,
      og_image,
      canonical_url,
      robots,
    } = body;

    if (!page || !title || !description) {
      return NextResponse.json(
        { ok: false, error: 'page, title, and description are required' },
        { status: 400 }
      );
    }

    // Check if exists
    const [existing] = await sql`
      SELECT id FROM seo_settings WHERE page = ${page} LIMIT 1
    `.catch(() => []);

    let result;
    if (existing) {
      // Update
      [result] = await sql`
        UPDATE seo_settings
        SET 
          title = ${title},
          description = ${description},
          keywords = ${keywords || null},
          og_title = ${og_title || null},
          og_description = ${og_description || null},
          og_image = ${og_image || null},
          canonical_url = ${canonical_url || null},
          robots = ${robots || 'index, follow'},
          updated_at = NOW()
        WHERE page = ${page}
        RETURNING *
      `.catch(() => []);
    } else {
      // Create
      [result] = await sql`
        INSERT INTO seo_settings (
          page, title, description, keywords, og_title, og_description,
          og_image, canonical_url, robots
        )
        VALUES (
          ${page}, ${title}, ${description}, ${keywords || null},
          ${og_title || null}, ${og_description || null}, ${og_image || null},
          ${canonical_url || null}, ${robots || 'index, follow'}
        )
        RETURNING *
      `.catch(() => []);
    }

    if (!result) {
      return NextResponse.json(
        { ok: false, error: 'Failed to save SEO data' },
        { status: 500 }
      );
    }

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'seo_settings',
      result.id,
      { page, title },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      seoData: result,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error saving SEO data:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to save SEO data' },
      { status: 500 }
    );
  }
}

