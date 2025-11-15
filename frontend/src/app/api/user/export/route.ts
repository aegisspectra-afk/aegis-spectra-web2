import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { neon } from '@netlify/neon';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for data export');
  sql = null;
}

export const dynamic = 'force-dynamic';

// GET - Export user data
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = request.nextUrl;
    const type = searchParams.get('type') || 'all';

    if (!sql) {
      return NextResponse.json({
        ok: true,
        download_url: 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
          message: 'Data export not available in local dev mode',
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        }, null, 2))
      });
    }

    try {
      const exportData: any = {
        export_date: new Date().toISOString(),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
        }
      };

      if (type === 'all' || type === 'orders') {
        const orders = await sql`
          SELECT * FROM orders
          WHERE user_id = ${user.id} OR customer_email = ${user.email}
          ORDER BY created_at DESC
        `.catch(() => []);
        exportData.orders = orders;
      }

      if (type === 'all' || type === 'profile') {
        const [profile] = await sql`
          SELECT * FROM users WHERE id = ${user.id} LIMIT 1
        `.catch(() => []);
        exportData.profile = profile;
      }

      if (type === 'all' || type === 'activity') {
        const activities = await sql`
          SELECT * FROM user_activity_log
          WHERE user_id = ${user.id} OR user_email = ${user.email}
          ORDER BY created_at DESC
        `.catch(() => []);
        exportData.activity = activities;
      }

      // Create download URL
      const jsonData = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      return NextResponse.json({
        ok: true,
        download_url: url,
        filename: `export-${type}-${new Date().toISOString().split('T')[0]}.json`
      });
    } catch (dbError: any) {
      console.error('Database error exporting data:', dbError);
      return NextResponse.json(
        { ok: false, error: 'Failed to export data' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Error exporting data:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

