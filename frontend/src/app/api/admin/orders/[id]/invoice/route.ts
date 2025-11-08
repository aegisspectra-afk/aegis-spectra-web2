/**
 * Admin Order Invoice API
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

// GET - Generate invoice PDF
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    // TODO: Implement PDF generation using a library like pdfkit or puppeteer
    // For now, return a simple HTML invoice that can be printed
    
    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
        <head>
          <meta charset="UTF-8">
          <title>חשבונית - ${id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-details { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { padding: 10px; border: 1px solid #ddd; text-align: right; }
            .total { font-size: 1.5em; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>חשבונית</h1>
            <p>מספר הזמנה: ${id}</p>
          </div>
          <div class="invoice-details">
            <p>תאריך: ${new Date().toLocaleDateString('he-IL')}</p>
          </div>
          <p>חשבונית תוצג כאן לאחר יישום יצירת PDF</p>
        </body>
      </html>
    `;

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

