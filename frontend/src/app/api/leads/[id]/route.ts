import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aegis2024';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const providedPassword = authHeader?.replace('Bearer ', '');
  return providedPassword === ADMIN_PASSWORD;
}

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
    const { status, notes, score, tags } = body;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid lead ID' 
      }, { status: 400 });
    }

    // Build update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(status);
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramIndex++}`);
      values.push(notes);
    }
    if (score !== undefined) {
      updates.push(`score = $${paramIndex++}`);
      values.push(score);
    }
    if (tags !== undefined) {
      updates.push(`tags = $${paramIndex++}`);
      values.push(JSON.stringify(tags));
    }

    if (updates.length === 0) {
      return NextResponse.json({ 
        ok: false, 
        error: 'No fields to update' 
      }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const query = `UPDATE leads SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    
    const [updatedLead] = await sql.unsafe(query, values);

    return NextResponse.json({ ok: true, lead: updatedLead });
  } catch (error: any) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to update lead' 
    }, { status: 500 });
  }
}
