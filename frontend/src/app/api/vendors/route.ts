import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

const sql = neon();

// GET - Get vendors
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = sql`
      SELECT * FROM vendors
      WHERE 1=1
    `;

    if (status) {
      query = sql`
        SELECT * FROM vendors
        WHERE status = ${status}
      `;
    }

    const vendors = await sql`
      ${query}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    // Get total count
    const totalQuery = sql`
      SELECT COUNT(*) as count FROM vendors
      ${status ? sql`WHERE status = ${status}` : sql``}
    `;
    const totalResult = await totalQuery;
    const total = parseInt(totalResult[0]?.count || '0');

    return NextResponse.json({
      ok: true,
      vendors,
      total,
      limit,
      offset
    });
  } catch (error: any) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}

// POST - Create vendor
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const {
      name, email, phone, company_name, company_registration,
      address, city, postal_code, country, tax_id, bank_account,
      commission_rate, status
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { ok: false, error: 'name and email are required' },
        { status: 400 }
      );
    }

    const [vendor] = await sql`
      INSERT INTO vendors (
        name, email, phone, company_name, company_registration,
        address, city, postal_code, country, tax_id, bank_account,
        commission_rate, status
      )
      VALUES (
        ${name}, ${email}, ${phone || null}, ${company_name || null},
        ${company_registration || null}, ${address || null}, ${city || null},
        ${postal_code || null}, ${country || 'Israel'}, ${tax_id || null},
        ${bank_account || null}, ${commission_rate || 10.00}, ${status || 'pending'}
      )
      RETURNING *
    `;

    return NextResponse.json({ ok: true, vendor });
  } catch (error: any) {
    console.error('Error creating vendor:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create vendor' },
      { status: 500 }
    );
  }
}

