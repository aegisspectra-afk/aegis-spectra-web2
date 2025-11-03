import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon();

// סיסמה להגנה - מומלץ לשנות ב-Netlify Environment Variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aegis2024';

// GET - קבלת כל הלידים (מוגן בסיסמה)
export async function GET(request: NextRequest) {
  try {
    // בדיקת סיסמה
    const authHeader = request.headers.get('authorization');
    const providedPassword = authHeader?.replace('Bearer ', '');
    
    if (providedPassword !== ADMIN_PASSWORD) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Unauthorized - Invalid password',
        requiresAuth: true
      }, { status: 401 });
    }

    const leads = await sql`
      SELECT * FROM leads 
      ORDER BY created_at DESC 
      LIMIT 100
    `;
    
    return NextResponse.json({ ok: true, leads });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    
    if (error.message?.includes('does not exist') || error.message?.includes('relation')) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Database table not found. Please create the leads table first.',
        leads: []
      }, { status: 500 });
    }

    return NextResponse.json({ ok: false, error: 'Failed to fetch leads', leads: [] }, { status: 500 });
  }
}

