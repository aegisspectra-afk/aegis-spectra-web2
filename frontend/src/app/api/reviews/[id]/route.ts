import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

const sql = neon();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aegis2024';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const providedPassword = authHeader?.replace('Bearer ', '');
  return providedPassword === ADMIN_PASSWORD;
}

// GET - Get single review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviewId = parseInt(id);

    const [review] = await sql`
      SELECT r.*,
             (SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = r.id AND is_helpful = true) as helpful_count
      FROM reviews r
      WHERE r.id = ${reviewId}
    `;

    if (!review) {
      return NextResponse.json(
        { ok: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, review });
  } catch (error: any) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}

// PATCH - Update review (admin only or own review)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviewId = parseInt(id);
    const body = await request.json();
    const { status, admin_notes, rating, title, review_text, images, user_email } = body;

    // Get existing review
    const [existing] = await sql`
      SELECT * FROM reviews WHERE id = ${reviewId}
    `;

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check permissions
    let isAdmin = false;
    let admin = null;
    try {
      admin = await requireAdmin(request);
      isAdmin = true;
    } catch {
      // Not admin
    }
    const isOwner = user_email && existing.user_email && existing.user_email === user_email;

    // Only admin can change status or admin_notes
    if ((status || admin_notes) && !isAdmin) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized - Only admin can change status' },
        { status: 403 }
      );
    }

    // Only owner or admin can update review content
    if ((rating || title || review_text || images) && !isAdmin && !isOwner) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized - You can only update your own review' },
        { status: 403 }
      );
    }

    // Update review
    const [review] = await sql`
      UPDATE reviews
      SET 
        status = ${status !== undefined ? status : existing.status},
        admin_notes = ${admin_notes !== undefined ? admin_notes : existing.admin_notes},
        rating = ${rating !== undefined ? rating : existing.rating},
        title = ${title !== undefined ? title : existing.title},
        review_text = ${review_text !== undefined ? review_text : existing.review_text},
        images = ${images !== undefined ? JSON.stringify(images) : existing.images},
        updated_at = NOW()
      WHERE id = ${reviewId}
      RETURNING *
    `;

    // Create audit log if admin
    if (admin && status) {
      if (status === 'approved') {
        await createAuditLog(
          admin.id,
          admin.email,
          AuditActions.REVIEW_APPROVED,
          'review',
          reviewId,
          { reviewId },
          request.headers.get('x-forwarded-for') || undefined,
          request.headers.get('user-agent') || undefined
        );
      } else if (status === 'rejected') {
        await createAuditLog(
          admin.id,
          admin.email,
          AuditActions.REVIEW_REJECTED,
          'review',
          reviewId,
          { reviewId },
          request.headers.get('x-forwarded-for') || undefined,
          request.headers.get('user-agent') || undefined
        );
      }
    }

    return NextResponse.json({ ok: true, review });
  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE - Delete review (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const reviewId = parseInt(id);

    await sql`
      DELETE FROM reviews WHERE id = ${reviewId}
    `;

    // Create audit log
    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.REVIEW_DELETED,
      'review',
      reviewId,
      { reviewId },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({ ok: true, message: 'Review deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}

