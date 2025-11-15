import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { neon } from '@netlify/neon';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for delete-account');
  sql = null;
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('user_token')?.value;

    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'לא מאומת' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { ok: false, error: 'Token לא תקין' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { confirmEmail } = body;

    if (!confirmEmail || confirmEmail !== decoded.email) {
      return NextResponse.json(
        { ok: false, error: 'יש לאשר את האימייל למחיקת החשבון' },
        { status: 400 }
      );
    }

    // If no database, return success for local dev
    if (!sql) {
      console.log('Database not available, skipping account deletion for local dev');
      return NextResponse.json({
        ok: true,
        message: 'חשבון נמחק בהצלחה (local dev mode)'
      });
    }

    // Delete user (or mark as deleted)
    await sql`
      UPDATE users
      SET email = ${`deleted_${decoded.userId}_${Date.now()}@deleted.local`},
          name = 'Deleted User',
          phone = '',
          updated_at = NOW()
      WHERE id = ${decoded.userId}
    `.catch((error: any) => {
      console.error('Error deleting account:', error);
      throw error;
    });

    return NextResponse.json({
      ok: true,
      message: 'חשבון נמחק בהצלחה'
    });
  } catch (error: any) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { ok: false, error: 'שגיאה במחיקת חשבון' },
      { status: 500 }
    );
  }
}

