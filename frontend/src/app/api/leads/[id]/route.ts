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

    // Build update query - use conditional updates
    let hasUpdate = false;
    
    if (status !== undefined && notes !== undefined && score !== undefined && tags !== undefined) {
      await sql`
        UPDATE leads 
        SET status = ${status}, notes = ${notes}, score = ${score}, tags = ${JSON.stringify(tags)}::jsonb, updated_at = NOW()
        WHERE id = ${id}
      `;
      hasUpdate = true;
    } else if (status !== undefined && notes !== undefined) {
      await sql`
        UPDATE leads 
        SET status = ${status}, notes = ${notes}, updated_at = NOW()
        WHERE id = ${id}
      `;
      hasUpdate = true;
    } else if (status !== undefined) {
      await sql`
        UPDATE leads 
        SET status = ${status}, updated_at = NOW()
        WHERE id = ${id}
      `;
      hasUpdate = true;
    } else if (notes !== undefined) {
      await sql`
        UPDATE leads 
        SET notes = ${notes}, updated_at = NOW()
        WHERE id = ${id}
      `;
      hasUpdate = true;
    } else if (score !== undefined) {
      await sql`
        UPDATE leads 
        SET score = ${score}, updated_at = NOW()
        WHERE id = ${id}
      `;
      hasUpdate = true;
    } else if (tags !== undefined) {
      await sql`
        UPDATE leads 
        SET tags = ${JSON.stringify(tags)}::jsonb, updated_at = NOW()
        WHERE id = ${id}
      `;
      hasUpdate = true;
    }

    if (!hasUpdate) {
      return NextResponse.json({ 
        ok: false, 
        error: 'No fields to update' 
      }, { status: 400 });
    }
    
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
