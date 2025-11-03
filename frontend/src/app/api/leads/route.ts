import { neon } from '@netlify/neon';
import { NextResponse } from 'next/server';

const sql = neon();

// GET - קבלת כל הלידים
export async function GET() {
  try {
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

