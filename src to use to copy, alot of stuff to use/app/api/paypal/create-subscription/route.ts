import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { logAuditEvent } from '@/lib/auth-server';
import { z } from 'zod';

const createSubscriptionSchema = z.object({
  plan: z.string().min(1, 'Plan is required'),
  price: z.number().positive('Price must be positive'),
  isGuest: z.boolean().optional().default(false),
  email: z.string().email().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = createSubscriptionSchema.parse(body);
    const { plan, price, isGuest, email } = validatedData;

    let userId: string | null = null;

    // If not a guest, get user session
    if (!isGuest) {
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      userId = session.user.id;
    }

    // In a real implementation, you would integrate with PayPal API here
    // For now, we'll simulate the subscription creation
    const subscriptionId = `paypal_sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create subscription record in database
    if (userId) {
      await prisma.subscription.create({
        data: {
          userId,
          plan: plan as any,
          status: 'ACTIVE',
          startDate: new Date(),
        },
      });

      await logAuditEvent(userId, 'PAYPAL_SUBSCRIPTION_CREATED', request.ip, JSON.stringify({
        plan,
        price,
        subscriptionId,
      }));
    }

    // For demo purposes, we'll redirect to a success page instead of PayPal
    // In production, you would integrate with PayPal API here
    const successUrl = `/pricing/success?plan=${plan}&subscriptionId=${subscriptionId}&provider=paypal`;
    
    return NextResponse.json({
      subscriptionId,
      url: successUrl,
      message: 'Subscription created successfully',
      plan,
      price,
      provider: 'paypal'
    });

  } catch (error: any) {
    console.error('PayPal subscription creation error:', error);

    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    // Try to get plan from body if available
    let plan = 'unknown';
    try {
      const body = await request.json();
      plan = body.plan || 'unknown';
    } catch {
      // If we can't parse body, use 'unknown'
    }

    await logAuditEvent(null, 'PAYPAL_SUBSCRIPTION_FAILED', request.ip, JSON.stringify({
      error: error.message,
      plan: plan,
    }));

    return NextResponse.json(
      { error: 'Failed to create PayPal subscription' },
      { status: 500 }
    );
  }
}