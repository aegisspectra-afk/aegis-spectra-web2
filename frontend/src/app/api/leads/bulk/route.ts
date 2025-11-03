import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon();

// סיסמה להגנה
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aegis2024';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const providedPassword = authHeader?.replace('Bearer ', '');
  return providedPassword === ADMIN_PASSWORD;
}

// PATCH - עדכון מספר לידים
export async function PATCH(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Unauthorized - Invalid password',
        requiresAuth: true
      }, { status: 401 });
    }

    const body = await request.json();
    const { ids, status, notes } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid IDs array' 
      }, { status: 400 });
    }

    // עדכון כל הלידים
    if (status !== undefined) {
      await sql`
        UPDATE leads 
        SET status = ${status}
        WHERE id = ANY(${ids})
      `;
    }

    if (notes !== undefined) {
      await sql`
        UPDATE leads 
        SET notes = ${notes}
        WHERE id = ANY(${ids})
      `;
    }

    // קבלת הלידים המעודכנים
    const updatedLeads = await sql`
      SELECT * FROM leads WHERE id = ANY(${ids})
    `;

    return NextResponse.json({ ok: true, leads: updatedLeads, count: updatedLeads.length });
  } catch (error: any) {
    console.error('Error updating leads:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to update leads' 
    }, { status: 500 });
  }
}

