/**
 * Admin Email Templates API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get all email templates
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const templates = await sql`
      SELECT * FROM email_templates
      ORDER BY created_at DESC
    `.catch(() => []);

    return NextResponse.json({
      ok: true,
      templates,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch email templates' },
      { status: 500 }
    );
  }
}

// POST - Create new email template
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();
    const { name, subject, body, type, variables, is_active } = body;

    if (!name || !subject || !body || !type) {
      return NextResponse.json(
        { ok: false, error: 'name, subject, body, and type are required' },
        { status: 400 }
      );
    }

    const [newTemplate] = await sql`
      INSERT INTO email_templates (name, subject, body, type, variables, is_active)
      VALUES (
        ${name}, ${subject}, ${body}, ${type},
        ${variables ? JSON.stringify(variables) : null}, ${is_active !== false}
      )
      RETURNING *
    `.catch(() => []);

    if (!newTemplate) {
      return NextResponse.json(
        { ok: false, error: 'Failed to create email template' },
        { status: 500 }
      );
    }

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'email_template',
      newTemplate.id,
      { name, type },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      template: newTemplate,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error creating email template:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create email template' },
      { status: 500 }
    );
  }
}

