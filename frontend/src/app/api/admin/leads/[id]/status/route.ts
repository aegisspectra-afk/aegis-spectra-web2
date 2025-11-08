/**
 * Admin Lead Status API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// PATCH - Update lead status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['new', 'contacted', 'qualified', 'converted', 'lost'].includes(status)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Get current lead
    const [currentLead] = await sql`
      SELECT status FROM leads WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!currentLead) {
      return NextResponse.json(
        { ok: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Update lead status
    await sql`
      UPDATE leads
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${parseInt(id)}
    `;

    // Create audit log
    await createAuditLog(
      admin.id,
      admin.email,
      'lead_status_changed',
      'lead',
      parseInt(id),
      { oldStatus: currentLead.status, newStatus: status },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      message: 'Lead status updated successfully',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error updating lead status:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update lead status' },
      { status: 500 }
    );
  }
}

