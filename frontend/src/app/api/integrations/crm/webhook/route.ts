/**
 * CRM Webhook Receiver - Receive updates from CRM
 */
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // TODO: Validate signature
    // const signature = request.headers.get('x-crm-signature');
    // if (!validateSignature(signature, await request.text())) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    const body = await request.json();
    const { quoteId, status } = body; // 'accepted' | 'rejected'

    if (!quoteId || !status) {
      return NextResponse.json(
        { success: false, error: 'Quote ID and status are required' },
        { status: 400 }
      );
    }

    // TODO: Update quote status in database
    // await updateQuote(quoteId, { status });

    return NextResponse.json({
      success: true,
      message: 'Quote status updated',
    });
  } catch (error: any) {
    console.error('CRM webhook error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

