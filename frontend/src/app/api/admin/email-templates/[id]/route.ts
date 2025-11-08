/**
 * Admin Email Template API - Get, Update, Delete specific template
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get template by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const [template] = await sql`
      SELECT * FROM email_templates WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!template) {
      return NextResponse.json(
        { ok: false, error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      template,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching template:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch template' },
      { status: 500 }
    );
  }
}

// PATCH - Update template
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const [currentTemplate] = await sql`
      SELECT * FROM email_templates WHERE id = ${parseInt(id)} LIMIT 1
    `.catch(() => []);

    if (!currentTemplate) {
      return NextResponse.json(
        { ok: false, error: 'Template not found' },
        { status: 404 }
      );
    }

    const { name, subject, body, type, variables, is_active } = body;

    const [updatedTemplate] = await sql`
      UPDATE email_templates
      SET 
        name = COALESCE(${name || null}, name),
        subject = COALESCE(${subject || null}, subject),
        body = COALESCE(${body || null}, body),
        type = COALESCE(${type || null}, type),
        variables = COALESCE(${variables ? JSON.stringify(variables) : null}, variables),
        is_active = COALESCE(${is_active !== undefined ? is_active : null}, is_active),
        updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `.catch(() => []);

    if (!updatedTemplate) {
      return NextResponse.json(
        { ok: false, error: 'Failed to update template' },
        { status: 500 }
      );
    }

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'email_template',
      id,
      { changes: Object.keys(body) },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      template: updatedTemplate,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error updating template:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update template' },
      { status: 500 }
    );
  }
}

// DELETE - Delete template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await params;

    await sql`
      DELETE FROM email_templates WHERE id = ${parseInt(id)}
    `.catch(() => {
      throw new Error('Failed to delete template');
    });

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'email_template',
      id,
      { action: 'deleted' },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      message: 'Template deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error deleting template:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}

