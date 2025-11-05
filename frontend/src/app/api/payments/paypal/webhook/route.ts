import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

// Verify PayPal webhook signature
async function verifyWebhookSignature(
  headers: Headers,
  body: string,
  webhookId: string
): Promise<boolean> {
  try {
    const signature = headers.get('paypal-transmission-id');
    const certUrl = headers.get('paypal-cert-url');
    const authAlgo = headers.get('paypal-auth-algo');
    const transmissionSig = headers.get('paypal-transmission-sig');
    const transmissionTime = headers.get('paypal-transmission-time');

    if (!signature || !certUrl || !authAlgo || !transmissionSig || !transmissionTime) {
      console.error('Missing PayPal webhook headers');
      return false;
    }

    // Get PayPal certificate
    const certRes = await fetch(certUrl);
    const cert = await certRes.text();

    // Create verification string
    const verifyString = [
      signature,
      transmissionTime,
      webhookId,
      crypto.createHash('sha256').update(body).digest('hex')
    ].join('|');

    // Verify signature using PayPal's certificate
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(verifyString);
    verify.end();

    const isValid = verify.verify(cert, transmissionSig, 'base64');
    return isValid;
  } catch (error) {
    console.error('Webhook verification error:', error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const webhookId = process.env.PAYPAL_WEBHOOK_ID || '';
    const headers = req.headers;

    // Verify webhook signature (only in production)
    if (process.env.PAYPAL_ENV === 'live' && webhookId) {
      const isValid = await verifyWebhookSignature(headers, body, webhookId);
      if (!isValid) {
        console.error('Invalid PayPal webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(body);
    const eventType = event.event_type;
    const resource = event.resource;

    console.log('PayPal webhook received:', eventType);

    // Handle different webhook event types
    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        // Payment was successfully captured
        const captureId = resource?.id;
        const orderId = resource?.supplementary_data?.related_ids?.order_id;
        const amount = resource?.amount;
        const payer = resource?.payer;

        console.log('Payment captured:', {
          captureId,
          orderId,
          amount: amount?.value,
          currency: amount?.currency_code,
          payerEmail: payer?.email_address
        });

        // TODO: Update order status in database
        // await updateOrderStatus(orderId, 'completed', {
        //   captureId,
        //   amount,
        //   payerEmail: payer?.email_address
        // });

        // Send confirmation email
        // await sendOrderConfirmationEmail(orderId);

        break;

      case 'PAYMENT.CAPTURE.DENIED':
        // Payment was denied
        console.log('Payment denied:', resource?.id);
        // TODO: Update order status to 'failed'
        break;

      case 'PAYMENT.CAPTURE.REFUNDED':
        // Payment was refunded
        console.log('Payment refunded:', resource?.id);
        // TODO: Update order status to 'refunded'
        break;

      case 'CHECKOUT.ORDER.APPROVED':
        // Order was approved by buyer
        console.log('Order approved:', resource?.id);
        break;

      case 'CHECKOUT.ORDER.COMPLETED':
        // Order was completed
        console.log('Order completed:', resource?.id);
        break;

      default:
        console.log('Unhandled webhook event type:', eventType);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('PayPal webhook error:', error);
    // Still return 200 to prevent PayPal from retrying
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 200 });
  }
}

