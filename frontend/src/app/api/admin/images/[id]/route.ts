/**
 * Admin Image API - Get, Update, Delete specific image
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get image by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const [image] = await sql`
      SELECT * FROM images WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!image) {
      return NextResponse.json(
        { ok: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      image,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching image:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}

// PATCH - Update image
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const [currentImage] = await sql`
      SELECT * FROM images WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!currentImage) {
      return NextResponse.json(
        { ok: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    const { alt_text, category } = body;

    const [updatedImage] = await sql`
      UPDATE images
      SET 
        alt_text = COALESCE(${alt_text !== undefined ? alt_text : null}, alt_text),
        category = COALESCE(${category || null}, category),
        updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `.catch(() => []);

    if (!updatedImage) {
      return NextResponse.json(
        { ok: false, error: 'Failed to update image' },
        { status: 500 }
      );
    }

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.PRODUCT_UPDATED,
      'image',
      id,
      { changes: Object.keys(body) },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      image: updatedImage,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error updating image:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update image' },
      { status: 500 }
    );
  }
}

// DELETE - Delete image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;

    await sql`
      DELETE FROM images WHERE id = ${parseInt(id)}
    `.catch(() => {
      throw new Error('Failed to delete image');
    });

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.PRODUCT_DELETED,
      'image',
      id,
      { action: 'deleted' },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      message: 'Image deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error deleting image:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

