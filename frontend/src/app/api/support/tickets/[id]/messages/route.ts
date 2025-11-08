/**
 * Support Ticket Messages API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// POST - Add message to ticket
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const { message, sender_type = 'admin', is_internal = false } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { ok: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get ticket
    const [ticket] = await sql`
      SELECT id FROM support_tickets WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!ticket) {
      return NextResponse.json(
        { ok: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Add message
    const [newMessage] = await sql`
      INSERT INTO support_ticket_messages (
        ticket_id, sender_type, sender_name, sender_email, message, is_internal
      )
      VALUES (
        ${parseInt(id)},
        ${sender_type},
        ${admin.name || admin.email},
        ${admin.email},
        ${message},
        ${is_internal}
      )
      RETURNING *
    `.catch(() => []);

    if (!newMessage) {
      return NextResponse.json(
        { ok: false, error: 'Failed to add message' },
        { status: 500 }
      );
    }

    // Update ticket updated_at
    await sql`
      UPDATE support_tickets
      SET updated_at = NOW()
      WHERE id = ${parseInt(id)}
    `.catch(() => {});

    return NextResponse.json({
      ok: true,
      message: newMessage,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error adding message:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to add message' },
      { status: 500 }
    );
  }
}

