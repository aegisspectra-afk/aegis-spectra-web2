/**
 * Admin Order Invoice API
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { getOrderDataForInvoice, generateInvoiceHTML } from '@/lib/pdf-generator';

export const dynamic = 'force-dynamic';

// GET - Generate invoice PDF (HTML for now, can be converted to PDF using browser print or puppeteer)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    // Get order data
    const orderData = await getOrderDataForInvoice(id);

    if (!orderData) {
      return NextResponse.json(
        { ok: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Generate HTML invoice
    const html = generateInvoiceHTML(orderData);

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}

