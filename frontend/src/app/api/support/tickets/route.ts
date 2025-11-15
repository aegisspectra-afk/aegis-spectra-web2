import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for support tickets');
  sql = null;
}

// GET - Get support tickets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const userEmail = searchParams.get('user_email');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');
    
    // Check if admin (for admin panel)
    let isAdmin = false;
    try {
      await requireAdmin(request);
      isAdmin = true;
    } catch {
      // Not admin, continue with user-only access
    }
    const assignedTo = searchParams.get('assigned_to');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // If no database, return empty tickets
    if (!sql) {
      console.log('Database not available, using fallback tickets');
      return NextResponse.json({
        ok: true,
        tickets: [],
        total: 0,
        limit,
        offset
      });
    }

    let query = sql`
      SELECT t.*,
             (SELECT COUNT(*) FROM support_ticket_messages WHERE ticket_id = t.id) as message_count,
             (SELECT MAX(created_at) FROM support_ticket_messages WHERE ticket_id = t.id) as last_message_at
      FROM support_tickets t
      WHERE 1=1
    `;

    if (!isAdmin && userEmail) {
      query = sql`
        SELECT t.*,
               (SELECT COUNT(*) FROM support_ticket_messages WHERE ticket_id = t.id) as message_count,
               (SELECT MAX(created_at) FROM support_ticket_messages WHERE ticket_id = t.id) as last_message_at
        FROM support_tickets t
        WHERE t.user_email = ${userEmail}
      `;
    }

    if (status) {
      query = sql`
        ${query}
        AND t.status = ${status}
      `;
    }

    if (priority) {
      query = sql`
        ${query}
        AND t.priority = ${priority}
      `;
    }

    if (category) {
      query = sql`
        ${query}
        AND t.category = ${category}
      `;
    }

    if (assignedTo && isAdmin) {
      query = sql`
        ${query}
        AND t.assigned_to = ${assignedTo}
      `;
    }

    try {
      const tickets = await sql`
        ${query}
        ORDER BY t.created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;

      // Get total count
      const totalQuery = sql`
        SELECT COUNT(*) as count
        FROM support_tickets t
        WHERE 1=1
        ${!isAdmin && userEmail ? sql`AND t.user_email = ${userEmail}` : sql``}
        ${status ? sql`AND t.status = ${status}` : sql``}
        ${priority ? sql`AND t.priority = ${priority}` : sql``}
        ${category ? sql`AND t.category = ${category}` : sql``}
        ${assignedTo && isAdmin ? sql`AND t.assigned_to = ${assignedTo}` : sql``}
      `;
      const totalResult = await totalQuery;
      const total = parseInt(totalResult[0]?.count || '0');

      return NextResponse.json({
        ok: true,
        tickets,
        total,
        limit,
        offset
      });
    } catch (dbError: any) {
      console.error('Database error fetching tickets:', dbError);
      // Return empty tickets on database error
      return NextResponse.json({
        ok: true,
        tickets: [],
        total: 0,
        limit,
        offset
      });
    }
  } catch (error: any) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// POST - Create new ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_email, user_name, subject, message, category, priority, order_id, product_id } = body;

    if (!user_email || !user_name || !subject || !message) {
      return NextResponse.json(
        { ok: false, error: 'user_email, user_name, subject, and message are required' },
        { status: 400 }
      );
    }

    // Generate ticket number
    const ticketNumber = `TICKET-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create ticket
    const [ticket] = await sql`
      INSERT INTO support_tickets (
        ticket_number, user_email, user_name, subject, message,
        category, priority, order_id, product_id, status
      )
      VALUES (
        ${ticketNumber}, ${user_email}, ${user_name}, ${subject}, ${message},
        ${category || 'general'}, ${priority || 'medium'}, ${order_id || null},
        ${product_id || null}, 'open'
      )
      RETURNING *
    `;

    // Create initial message
    await sql`
      INSERT INTO support_ticket_messages (
        ticket_id, sender_type, sender_name, sender_email, message
      )
      VALUES (
        ${ticket.id}, 'customer', ${user_name}, ${user_email}, ${message}
      )
    `;

    return NextResponse.json({
      ok: true,
      ticket,
      message: 'Support ticket created successfully'
    });
  } catch (error: any) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}

