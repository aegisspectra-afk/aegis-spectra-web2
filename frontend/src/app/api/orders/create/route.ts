import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const sql = neon();

export async function POST(request: NextRequest) {
  try {
    // Get user token (optional - for authenticated orders)
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('user_token')?.value;
    let userId: number | null = null;

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        // Get user ID from database
        const users = await sql`
          SELECT id FROM users WHERE email = ${decoded.email} LIMIT 1
        `.catch(() => []);
        if (users.length > 0) {
          userId = users[0].id;
        }
      }
    }

    const body = await request.json();
    const {
      id: orderId,
      items,
      subtotal,
      shipping,
      discount = 0,
      total,
      shippingMethod,
      customer,
      notes,
    } = body;

    // Validate required fields
    if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'פרטי הזמנה חסרים' },
        { status: 400 }
      );
    }

    if (!customer || !customer.firstName || !customer.lastName || !customer.phone) {
      return NextResponse.json(
        { ok: false, error: 'פרטי לקוח חסרים' },
        { status: 400 }
      );
    }

    // Create orders table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255) UNIQUE NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255),
        customer_phone VARCHAR(50) NOT NULL,
        customer_address TEXT,
        customer_city VARCHAR(100),
        customer_postal_code VARCHAR(20),
        items JSONB NOT NULL,
        subtotal INTEGER NOT NULL,
        shipping INTEGER DEFAULT 0,
        discount INTEGER DEFAULT 0,
        total INTEGER NOT NULL,
        shipping_method VARCHAR(50),
        payment_method VARCHAR(50) DEFAULT 'pending',
        payment_status VARCHAR(50) DEFAULT 'pending',
        order_status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `.catch(() => {});

    // Create order items table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL,
        sku VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        price INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `.catch(() => {});

    // Insert order
    const orderResult = await sql`
      INSERT INTO orders (
        order_id, user_id, customer_name, customer_email, customer_phone,
        customer_address, customer_city, customer_postal_code,
        items, subtotal, shipping, discount, total,
        shipping_method, payment_method, payment_status, order_status, notes
      )
      VALUES (
        ${orderId},
        ${userId},
        ${`${customer.firstName} ${customer.lastName}`},
        ${customer.email || null},
        ${customer.phone},
        ${customer.address || null},
        ${customer.city || null},
        ${customer.postalCode || null},
        ${JSON.stringify(items)},
        ${subtotal},
        ${shipping},
        ${discount},
        ${total},
        ${shippingMethod || 'standard'},
        'pending',
        'pending',
        'pending',
        ${notes || null}
      )
      RETURNING id, order_id, created_at
    `.catch((error) => {
      console.error('Error creating order:', error);
      throw error;
    });

    if (orderResult.length === 0) {
      throw new Error('Failed to create order');
    }

    // Insert order items
    for (const item of items) {
      await sql`
        INSERT INTO order_items (order_id, sku, name, price, quantity)
        VALUES (${orderId}, ${item.sku || 'unknown'}, ${item.name}, ${item.price}, ${item.quantity})
      `.catch((error) => {
        console.error('Error inserting order item:', error);
      });
    }

    // Send notification email (async, don't wait)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/orders/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, order: body }),
    }).catch(() => {});

    return NextResponse.json({
      ok: true,
      success: true,
      orderId,
      order: {
        id: orderId,
        ...orderResult[0],
      },
      message: 'הזמנה נוצרה בהצלחה',
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { ok: false, success: false, error: 'שגיאה ביצירת הזמנה. אנא נסה שוב.' },
      { status: 500 }
    );
  }
}

