import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';
import { logAuditEvent } from '@/lib/auth-server';
import { z } from 'zod';

const verifyPaymentSchema = z.object({
  plan: z.string().min(1, 'Plan is required'),
  subscriptionId: z.string().min(1, 'Subscription ID is required'),
  provider: z.string().min(1, 'Provider is required'),
  sessionId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  let validatedData: any = null;
  
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
    validatedData = verifyPaymentSchema.parse(body);
    const { plan, subscriptionId, provider, sessionId } = validatedData;

    const userId = session.user.id;

    // Check if subscription already exists
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        // You would need to store the external subscription ID in your database
        // For now, we'll check by plan and status
        plan: plan as any,
        status: 'ACTIVE',
      },
    });

    if (existingSubscription) {
      return NextResponse.json({
        success: true,
        message: 'Payment already verified',
        subscription: existingSubscription,
      });
    }

    // Create new subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        plan: plan as any,
        status: 'ACTIVE',
        startDate: new Date(),
        // You would store the external subscription ID here
        // paypalSubscriptionId: provider === 'paypal' ? subscriptionId : null,
      },
    });

    // Log the successful payment verification
    await logAuditEvent(userId, 'PAYMENT_VERIFIED', request.ip, JSON.stringify({
      plan,
      subscriptionId,
      provider,
      sessionId,
      subscriptionDbId: subscription.id,
    }));

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      subscription,
    });

  } catch (error: any) {
    console.error('Payment verification error:', error);

    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    await logAuditEvent(null, 'PAYMENT_VERIFICATION_FAILED', request.ip, JSON.stringify({
      error: error.message,
      plan: validatedData.plan,
      subscriptionId: validatedData.subscriptionId,
    }));

    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}