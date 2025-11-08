/**
 * Admin Backup API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { createAuditLog, AuditActions } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Get all backups
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const backups = await sql`
      SELECT * FROM backups
      ORDER BY created_at DESC
      LIMIT 50
    `.catch(() => []);

    return NextResponse.json({
      ok: true,
      backups,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error fetching backups:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch backups' },
      { status: 500 }
    );
  }
}

// POST - Create new backup
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);

    // In a real implementation, you would:
    // 1. Export database to SQL file
    // 2. Upload to cloud storage (S3, etc.)
    // 3. Store metadata in database

    const backupName = `backup-${new Date().toISOString().split('T')[0]}-${Date.now()}`;

    const [newBackup] = await sql`
      INSERT INTO backups (name, type, size, status)
      VALUES (${backupName}, 'full', 0, 'completed')
      RETURNING *
    `.catch(() => []);

    if (!newBackup) {
      return NextResponse.json(
        { ok: false, error: 'Failed to create backup' },
        { status: 500 }
      );
    }

    await createAuditLog(
      admin.id,
      admin.email,
      AuditActions.SETTINGS_UPDATED,
      'backup',
      newBackup.id,
      { name: backupName },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      ok: true,
      backup: newBackup,
      message: 'Backup created successfully (metadata only - implement actual backup logic)',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error creating backup:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create backup' },
      { status: 500 }
    );
  }
}

