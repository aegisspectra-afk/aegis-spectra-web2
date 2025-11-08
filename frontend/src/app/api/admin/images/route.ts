/**
 * Admin Images API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get all images
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = sql`
      SELECT * FROM images WHERE 1=1
    `;

    if (category && category !== 'all') {
      query = sql`${query} AND category = ${category}`;
    }

    if (search) {
      query = sql`${query} AND (filename ILIKE ${'%' + search + '%'} OR alt_text ILIKE ${'%' + search + '%'})`;
    }

    query = sql`${query} ORDER BY created_at DESC LIMIT 100`;

    const images = await query.catch(() => []);

    return NextResponse.json({
      ok: true,
      images,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching images:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

// POST - Upload new image
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const alt_text = formData.get('alt_text') as string;
    const category = formData.get('category') as string;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: 'File is required' },
        { status: 400 }
      );
    }

    // In a real implementation, you would upload to Cloudinary, S3, etc.
    // For now, we'll just store metadata
    const buffer = await file.arrayBuffer();
    const size = buffer.byteLength;

    // Generate a URL (in production, this would be from your CDN)
    const filename = file.name;
    const url = `/uploads/${filename}`;

    const [newImage] = await sql`
      INSERT INTO images (filename, url, alt_text, category, size)
      VALUES (${filename}, ${url}, ${alt_text || null}, ${category || 'product'}, ${size})
      RETURNING *
    `.catch(() => []);

    if (!newImage) {
      return NextResponse.json(
        { ok: false, error: 'Failed to save image' },
        { status: 500 }
      );
    }

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.PRODUCT_UPDATED,
      'image',
      newImage.id,
      { filename, category },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      image: newImage,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error uploading image:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

