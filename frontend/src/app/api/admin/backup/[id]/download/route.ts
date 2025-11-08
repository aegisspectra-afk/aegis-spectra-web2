/**
 * Admin Backup Download API
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

// GET - Download backup file
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    // In a real implementation, you would:
    // 1. Fetch backup file from cloud storage
    // 2. Return as downloadable file

    // For now, return a placeholder
    const sqlContent = `-- Backup ${id}\n-- This is a placeholder backup file\n-- Implement actual backup download logic`;

    return new NextResponse(sqlContent, {
      headers: {
        'Content-Type': 'application/sql',
        'Content-Disposition': `attachment; filename="backup-${id}.sql"`,
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error downloading backup:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to download backup' },
      { status: 500 }
    );
  }
}

