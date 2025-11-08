import { neon } from '@netlify/neon';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon();

// GET - Get order tracking information
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const orderId = searchParams.get('order_id');
    const trackingNumber = searchParams.get('tracking_number');
    const email = searchParams.get('email');

    if (!orderId && !trackingNumber) {
      return NextResponse.json(
        { ok: false, error: 'order_id or tracking_number is required' },
        { status: 400 }
      );
    }

    // Get order
    let order: any;
    if (orderId) {
      [order] = await sql`
        SELECT * FROM orders WHERE id = ${parseInt(orderId)} LIMIT 1
      `;
    } else {
      [order] = await sql`
        SELECT * FROM orders WHERE tracking_number = ${trackingNumber} LIMIT 1
      `;
    }

    if (!order) {
      return NextResponse.json(
        { ok: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify email if provided
    if (email && order.customer_email !== email) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get status history
    const statusHistory = await sql`
      SELECT * FROM order_status_history
      WHERE order_id = ${order.id}
      ORDER BY created_at ASC
    `;

    // Get order items
    const items = await sql`
      SELECT * FROM order_items
      WHERE order_id = ${order.id}
    `.catch(() => []);

    // Calculate estimated delivery
    let estimatedDelivery = null;
    if (order.shipped_at && order.estimated_delivery) {
      estimatedDelivery = order.estimated_delivery;
    } else if (order.shipped_at) {
      // Default: 3-5 business days
      const deliveryDate = new Date(order.shipped_at);
      deliveryDate.setDate(deliveryDate.getDate() + 4);
      estimatedDelivery = deliveryDate.toISOString();
    }

    return NextResponse.json({
      ok: true,
      order: {
        ...order,
        estimated_delivery: estimatedDelivery
      },
      status_history: statusHistory,
      items
    });
  } catch (error: any) {
    console.error('Error fetching order tracking:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch order tracking' },
      { status: 500 }
    );
  }
}

// PATCH - Update order tracking
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, tracking_number, carrier, estimated_delivery, status } = body;

    if (!order_id) {
      return NextResponse.json(
        { ok: false, error: 'order_id is required' },
        { status: 400 }
      );
    }

    // Update order
    const updateData: any = {};
    if (tracking_number) updateData.tracking_number = tracking_number;
    if (carrier) updateData.carrier = carrier;
    if (estimated_delivery) updateData.estimated_delivery = estimated_delivery;

    const [order] = await sql`
      UPDATE orders
      SET 
        tracking_number = ${tracking_number || null},
        carrier = ${carrier || null},
        estimated_delivery = ${estimated_delivery ? new Date(estimated_delivery) : null},
        updated_at = NOW()
      WHERE id = ${parseInt(order_id)}
      RETURNING *
    `;

    // Update status if provided
    if (status) {
      await sql`
        SELECT update_order_status(
          ${parseInt(order_id)},
          ${status},
          'Tracking updated',
          'admin'
        )
      `;
    }

    return NextResponse.json({ ok: true, order });
  } catch (error: any) {
    console.error('Error updating order tracking:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update order tracking' },
      { status: 500 }
    );
  }
}

