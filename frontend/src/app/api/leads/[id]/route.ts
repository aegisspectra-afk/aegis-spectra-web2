import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon();

// סיסמה להגנה - מומלץ לשנות ב-Netlify Environment Variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aegis2024';

// Helper function לבדיקת סיסמה
function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const providedPassword = authHeader?.replace('Bearer ', '');
  return providedPassword === ADMIN_PASSWORD;
}

// PATCH - עדכון ליד
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Unauthorized - Invalid password',
        requiresAuth: true
      }, { status: 401 });
    }

    const { id: idParam } = await params;
    const body = await request.json();
    const { status, notes } = body;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid lead ID' 
      }, { status: 400 });
    }

    // עדכון רק השדות שצוינו
    if (status !== undefined && notes !== undefined) {
      await sql`
        UPDATE leads 
        SET status = ${status}, notes = ${notes}
        WHERE id = ${id}
      `;
    } else if (status !== undefined) {
      await sql`
        UPDATE leads 
        SET status = ${status}
        WHERE id = ${id}
      `;
    } else if (notes !== undefined) {
      await sql`
        UPDATE leads 
        SET notes = ${notes}
        WHERE id = ${id}
      `;
    } else {
      return NextResponse.json({ 
        ok: false, 
        error: 'No fields to update' 
      }, { status: 400 });
    }

    // קבלת הליד המעודכן
    const [updatedLead] = await sql`
      SELECT * FROM leads WHERE id = ${id}
    `;

    return NextResponse.json({ ok: true, lead: updatedLead });
  } catch (error: any) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to update lead' 
    }, { status: 500 });
  }
}

