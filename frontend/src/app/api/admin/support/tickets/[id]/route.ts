/**
 * Admin Support Ticket API - Get, Update, Delete specific ticket
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get ticket by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;

    const [ticket] = await sql`
      SELECT 
        t.*,
        json_agg(
          json_build_object(
            'id', tm.id,
            'sender_type', tm.sender_type,
            'sender_name', tm.sender_name,
            'sender_email', tm.sender_email,
            'message', tm.message,
            'attachments', tm.attachments,
            'is_internal', tm.is_internal,
            'created_at', tm.created_at
          )
        ) FILTER (WHERE tm.id IS NOT NULL) as messages
      FROM support_tickets t
      LEFT JOIN support_ticket_messages tm ON t.id = tm.ticket_id
      WHERE t.id = ${parseInt(id)}
      GROUP BY t.id
      LIMIT 1
    `.catch(() => []);

    if (!ticket) {
      return NextResponse.json(
        { ok: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      ticket,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching ticket:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}

// PATCH - Update ticket
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const { status, priority, assigned_to, category } = body;

    // Get current ticket
    const [currentTicket] = await sql`
      SELECT * FROM support_tickets WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!currentTicket) {
      return NextResponse.json(
        { ok: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Update ticket
    const [updatedTicket] = await sql`
      UPDATE support_tickets
      SET 
        status = COALESCE(${status || null}, status),
        priority = COALESCE(${priority || null}, priority),
        assigned_to = COALESCE(${assigned_to || null}, assigned_to),
        category = COALESCE(${category || null}, category),
        updated_at = NOW(),
        resolved_at = ${status === 'resolved' || status === 'closed' ? sql`NOW()` : sql`resolved_at`}
      WHERE id = ${parseInt(id)}
      RETURNING *
    `.catch(() => []);

    if (!updatedTicket) {
      return NextResponse.json(
        { ok: false, error: 'Failed to update ticket' },
        { status: 500 }
      );
    }

    // Create audit log
    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.TICKET_UPDATED,
      'support_ticket',
      id,
      { changes: Object.keys(body), oldStatus: currentTicket.status, newStatus: status },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      ticket: updatedTicket,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error updating ticket:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}

// DELETE - Delete ticket
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;

    // Delete ticket (messages will be deleted via CASCADE)
    await sql`
      DELETE FROM support_tickets WHERE id = ${parseInt(id)}
    `.catch(() => {
      throw new Error('Failed to delete ticket');
    });

    // Create audit log
    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.TICKET_DELETED,
      'support_ticket',
      id,
      {},
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      message: 'Ticket deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error deleting ticket:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete ticket' },
      { status: 500 }
    );
  }
}

