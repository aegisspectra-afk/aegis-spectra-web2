import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { logAuditEvent } from '@/lib/auth-server';
import { z } from 'zod';

const approveSubscriptionSchema = z.object({
  subscriptionId: z.string().min(1, 'Subscription ID is required'),
  orderId: z.string().min(1, 'Order ID is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = approveSubscriptionSchema.parse(body);
    const { subscriptionId, orderId } = validatedData;

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // In a real implementation, you would verify the subscription with PayPal API here
    // For now, we'll simulate the approval process

    // Update subscription status
    await prisma.subscription.updateMany({
      where: {
        userId,
        // You would need to store the PayPal subscription ID in the database
        // For now, we'll just update any active subscription
      },
      data: {
        status: 'ACTIVE',
      },
    });

    await logAuditEvent(userId, 'PAYPAL_SUBSCRIPTION_APPROVED', request.ip, JSON.stringify({
      subscriptionId,
      orderId,
    }));

    return NextResponse.json({
      success: true,
      message: 'Subscription approved successfully',
      subscriptionId,
    });

  } catch (error: any) {
    console.error('PayPal subscription approval error:', error);

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

    await logAuditEvent(null, 'PAYPAL_SUBSCRIPTION_APPROVAL_FAILED', request.ip, JSON.stringify({
      error: error.message,
      subscriptionId: subscriptionId,
    }));

    return NextResponse.json(
      { error: 'Failed to approve PayPal subscription' },
      { status: 500 }
    );
  }
}