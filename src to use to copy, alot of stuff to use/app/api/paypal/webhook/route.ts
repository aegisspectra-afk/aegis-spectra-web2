import { NextRequest, NextResponse } from 'next/server';
import { paypalConfig, validatePayPalConfig } from '@/lib/paypal-config';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Validate PayPal configuration
    const configValidation = validatePayPalConfig();
    if (!configValidation.isValid) {
      console.error('PayPal configuration error:', configValidation.errors);
      return NextResponse.json(
        { error: 'PayPal configuration error' },
        { status: 500 }
      );
    }

    const body = await request.text();
    const headers = request.headers;

    // Verify webhook signature
    const authAlgo = headers.get('paypal-auth-algo');
    const certId = headers.get('paypal-cert-id');
    const transmissionId = headers.get('paypal-transmission-id');
    const transmissionSig = headers.get('paypal-transmission-sig');
    const transmissionTime = headers.get('paypal-transmission-time');

    if (!authAlgo || !certId || !transmissionId || !transmissionSig || !transmissionTime) {
      console.error('Missing PayPal webhook headers');
      return NextResponse.json(
        { error: 'Missing webhook headers' },
        { status: 400 }
      );
    }

    // Parse the webhook event
    let event;
    try {
      event = JSON.parse(body);
    } catch (error) {
      console.error('Failed to parse webhook body:', error);
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCaptureCompleted(event);
        break;
      
      case 'PAYMENT.CAPTURE.DENIED':
        await handlePaymentCaptureDenied(event);
        break;
      
      case 'PAYMENT.CAPTURE.REFUNDED':
        await handlePaymentCaptureRefunded(event);
        break;
      
      case 'BILLING.SUBSCRIPTION.CREATED':
        await handleSubscriptionCreated(event);
        break;
      
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        await handleSubscriptionActivated(event);
        break;
      
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        await handleSubscriptionCancelled(event);
        break;
      
      default:
        console.log(`Unhandled PayPal event type: ${event.event_type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentCaptureCompleted(event: any) {
  try {
    console.log('PayPal payment capture completed:', event.resource.id);
    
    const capture = event.resource;
    console.log('Capture details:', {
      id: capture.id,
      amount: capture.amount,
      status: capture.status,
      create_time: capture.create_time
    });
    
    // Here you can update your database with the successful payment
    // For example, mark an order as paid
    
  } catch (error) {
    console.error('Error handling payment capture completed:', error);
  }
}

async function handlePaymentCaptureDenied(event: any) {
  try {
    console.log('PayPal payment capture denied:', event.resource.id);
    
    const capture = event.resource;
    console.log('Denied capture details:', {
      id: capture.id,
      amount: capture.amount,
      status: capture.status,
      reason_code: capture.reason_code
    });
    
    // Here you can handle the denied payment
    // For example, mark an order as failed
    
  } catch (error) {
    console.error('Error handling payment capture denied:', error);
  }
}

async function handlePaymentCaptureRefunded(event: any) {
  try {
    console.log('PayPal payment capture refunded:', event.resource.id);
    
    const refund = event.resource;
    console.log('Refund details:', {
      id: refund.id,
      amount: refund.amount,
      status: refund.status,
      create_time: refund.create_time
    });
    
    // Here you can handle the refund
    // For example, mark an order as refunded
    
  } catch (error) {
    console.error('Error handling payment capture refunded:', error);
  }
}

async function handleSubscriptionCreated(event: any) {
  try {
    console.log('PayPal subscription created:', event.resource.id);
    
    const subscription = event.resource;
    console.log('Subscription details:', {
      id: subscription.id,
      status: subscription.status,
      create_time: subscription.create_time,
      subscriber: subscription.subscriber
    });
    
    // Here you can create a subscription record in your database
    
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionActivated(event: any) {
  try {
    console.log('PayPal subscription activated:', event.resource.id);
    
    const subscription = event.resource;
    console.log('Activated subscription details:', {
      id: subscription.id,
      status: subscription.status,
      start_time: subscription.start_time
    });
    
    // Here you can update the subscription status in your database
    
  } catch (error) {
    console.error('Error handling subscription activated:', error);
  }
}

async function handleSubscriptionCancelled(event: any) {
  try {
    console.log('PayPal subscription cancelled:', event.resource.id);
    
    const subscription = event.resource;
    console.log('Cancelled subscription details:', {
      id: subscription.id,
      status: subscription.status,
      cancelled_time: subscription.cancelled_time
    });
    
    // Here you can mark the subscription as cancelled in your database
    
  } catch (error) {
    console.error('Error handling subscription cancelled:', error);
  }
}