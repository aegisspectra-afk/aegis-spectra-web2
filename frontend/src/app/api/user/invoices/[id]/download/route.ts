import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { neon } from '@netlify/neon';

// Initialize Neon client with fallback
let sql: any = null;
try {
  sql = neon();
} catch (error: any) {
  console.warn('Neon client not available, using fallback for invoice download');
  sql = null;
}

export const dynamic = 'force-dynamic';

// GET - Download invoice as PDF
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;

    if (!sql) {
      return NextResponse.json(
        { ok: false, error: 'Database not available' },
        { status: 503 }
      );
    }

    const [invoice] = await sql`
      SELECT * FROM invoices
      WHERE id = ${parseInt(id)} AND (user_id = ${user.id} OR user_email = ${user.email})
      LIMIT 1
    `.catch(() => []);

    if (!invoice) {
      return NextResponse.json(
        { ok: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // TODO: Generate PDF using a library like pdfkit or puppeteer
    // For now, return a placeholder
    return NextResponse.json({
      ok: true,
      message: 'PDF generation will be implemented',
      invoice: {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        total: invoice.total,
      }
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Error downloading invoice:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to download invoice' },
      { status: 500 }
    );
  }
}

