import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sku: string;
  image?: string;
}

export interface OrderData {
  items: OrderItem[];
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  };
  paymentMethod: 'paypal' | 'credit-card' | 'bit' | 'paybox';
  totalAmount: number;
  shippingMethod: 'standard' | 'express' | 'pickup';
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderData = await request.json();

    // Validate required fields
    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      );
    }

    if (!orderData.customerInfo) {
      return NextResponse.json(
        { error: 'Customer information is required' },
        { status: 400 }
      );
    }

    // Validate customer info
    const { firstName, lastName, email, phone, address, city, zipCode } = orderData.customerInfo;
    if (!firstName || !lastName || !email || !phone || !address || !city || !zipCode) {
      return NextResponse.json(
        { error: 'All customer fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone format (basic Israeli phone validation)
    const phoneRegex = /^[\d\-\+\(\)\s]+$/;
    if (!phoneRegex.test(phone) || phone.length < 9) {
      return NextResponse.json(
        { error: 'Invalid phone format' },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Calculate totals
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = orderData.shippingMethod === 'express' ? 50 : 
                        orderData.shippingMethod === 'pickup' ? 0 : 25;
    const totalAmount = subtotal + shippingCost;

    // Create order object
    const order = {
      id: orderId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: orderData.items,
      customerInfo: orderData.customerInfo,
      paymentMethod: orderData.paymentMethod,
      shippingMethod: orderData.shippingMethod,
      notes: orderData.notes || '',
      totals: {
        subtotal,
        shipping: shippingCost,
        total: totalAmount
      },
      paymentStatus: 'pending',
      shippingStatus: 'pending'
    };

    // In a real application, you would save this to a database
    // For now, we'll just return the order
    console.log('Order created:', order);

    // TODO: Save to database
    // await saveOrderToDatabase(order);

    // TODO: Send confirmation email
    // await sendOrderConfirmationEmail(order);

    // TODO: Create invoice PDF
    // const invoiceUrl = await generateInvoicePDF(order);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      order,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}