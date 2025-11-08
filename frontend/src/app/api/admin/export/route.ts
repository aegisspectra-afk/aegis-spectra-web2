/**
 * Admin Data Export API
 */
import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

const sql = neon();

// GET - Export data
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = request.nextUrl;
    const type = searchParams.get('type') || 'orders';
    const format = searchParams.get('format') || 'csv';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const status = searchParams.get('status');

    let data: any[] = [];
    let headers: string[] = [];

    switch (type) {
      case 'orders':
        headers = ['מספר הזמנה', 'לקוח', 'אימייל', 'טלפון', 'סכום', 'סטטוס', 'תאריך'];
        let ordersQuery = sql`
          SELECT 
            order_id, customer_name, customer_email, customer_phone,
            total, status, created_at
          FROM orders
          WHERE 1=1
        `;
        if (dateFrom) {
          ordersQuery = sql`${ordersQuery} AND created_at >= ${dateFrom}`;
        }
        if (dateTo) {
          ordersQuery = sql`${ordersQuery} AND created_at <= ${dateTo}`;
        }
        if (status) {
          ordersQuery = sql`${ordersQuery} AND status = ${status}`;
        }
        data = await ordersQuery.catch(() => []);
        data = data.map((row: any) => [
          row.order_id,
          row.customer_name,
          row.customer_email,
          row.customer_phone,
          row.total,
          row.status,
          new Date(row.created_at).toLocaleDateString('he-IL'),
        ]);
        break;

      case 'products':
        headers = ['מק"ט', 'שם', 'מחיר', 'מלאי', 'קטגוריה', 'סטטוס'];
        const products = await sql`
          SELECT sku, name, price, stock, category, status
          FROM products
          ORDER BY created_at DESC
        `.catch(() => []);
        data = products.map((row: any) => [
          row.sku,
          row.name,
          row.price,
          row.stock,
          row.category,
          row.status,
        ]);
        break;

      case 'users':
        headers = ['אימייל', 'שם', 'טלפון', 'תאריך הרשמה', 'סטטוס'];
        const users = await sql`
          SELECT email, name, phone, created_at, status
          FROM users
          ORDER BY created_at DESC
        `.catch(() => []);
        data = users.map((row: any) => [
          row.email,
          row.name,
          row.phone,
          new Date(row.created_at).toLocaleDateString('he-IL'),
          row.status,
        ]);
        break;

      case 'leads':
        headers = ['שם', 'טלפון', 'אימייל', 'עיר', 'מוצר', 'תאריך'];
        const leads = await sql`
          SELECT name, phone, email, city, product_sku, created_at
          FROM leads
          ORDER BY created_at DESC
        `.catch(() => []);
        data = leads.map((row: any) => [
          row.name,
          row.phone,
          row.email || '',
          row.city || '',
          row.product_sku || '',
          new Date(row.created_at).toLocaleDateString('he-IL'),
        ]);
        break;

      case 'reviews':
        headers = ['מוצר', 'לקוח', 'דירוג', 'כותרת', 'סטטוס', 'תאריך'];
        const reviews = await sql`
          SELECT sku, user_name, rating, title, status, created_at
          FROM reviews
          ORDER BY created_at DESC
        `.catch(() => []);
        data = reviews.map((row: any) => [
          row.sku || '',
          row.user_name,
          row.rating,
          row.title || '',
          row.status,
          new Date(row.created_at).toLocaleDateString('he-IL'),
        ]);
        break;
    }

    // Generate CSV
    if (format === 'csv') {
      const csvContent = [
        headers.join(','),
        ...data.map((row) => row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${type}_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // For Excel, return JSON (client can use a library like xlsx to convert)
    return NextResponse.json({
      ok: true,
      headers,
      data,
      message: 'For Excel format, use a library like xlsx on the client side',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Error exporting data:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

