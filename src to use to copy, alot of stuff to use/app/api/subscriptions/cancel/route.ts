import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';
import { logAuditEvent } from '@/lib/auth-server';
import { z } from 'zod';

const cancelSubscriptionSchema = z.object({
  subscriptionId: z.string().min(1, 'Subscription ID is required'),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = cancelSubscriptionSchema.parse(body);
    const { subscriptionId } = validatedData;

    // Find the subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: session.user.id,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    if (subscription.status === 'CANCELED') {
      return NextResponse.json(
        { error: 'Subscription is already canceled' },
        { status: 400 }
      );
    }

    // Update subscription status
    await prisma.subscription.update({
      where: {
        id: subscriptionId,
      },
      data: {
        status: 'CANCELED',
        endDate: new Date(),
      },
    });

    // Log the cancellation
    await logAuditEvent(session.user.id, 'SUBSCRIPTION_CANCELED', request.ip, JSON.stringify({
      subscriptionId,
      plan: subscription.plan,
    }));

    // TODO: In a real implementation, you would also cancel the subscription with the payment provider (PayPal)
    // For PayPal: await paypal.subscriptions.cancel(subscription.paypalSubscriptionId);

    return NextResponse.json({
      success: true,
      message: 'Subscription canceled successfully',
    });

  } catch (error: any) {
    console.error('Subscription cancellation error:', error);

    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    // Try to get subscriptionId from body if available
    let subscriptionId = 'unknown';
    try {
      const body = await request.json();
      subscriptionId = body.subscriptionId || 'unknown';
    } catch {
      // If we can't parse body, use 'unknown'
    }

    await logAuditEvent(null, 'SUBSCRIPTION_CANCEL_FAILED', request.ip, JSON.stringify({
      error: error.message,
      subscriptionId: subscriptionId,
    }));

    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}