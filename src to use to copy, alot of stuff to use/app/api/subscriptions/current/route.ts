import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: {
          in: ['ACTIVE', 'TRIALING', 'PAST_DUE']
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Calculate next billing date (assuming monthly billing)
    const nextBillingDate = new Date(subscription.startDate);
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    return NextResponse.json({
      id: subscription.id,
      plan: subscription.plan,
      status: subscription.status,
      startDate: subscription.startDate.toISOString(),
      endDate: subscription.endDate?.toISOString(),
      nextBillingDate: nextBillingDate.toISOString(),
      amount: getPlanAmount(subscription.plan),
      currency: 'USD',
      provider: 'paypal', // You would determine this from your data
    });

  } catch (error: any) {
    console.error('Current subscription fetch error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

function getPlanAmount(plan: string): number {
  switch (plan) {
    case 'FREE':
      return 0;
    case 'BASIC':
      return 2900; // $29.00 in cents
    case 'PRO':
      return 7900; // $79.00 in cents
    case 'BUSINESS':
      return 19900; // $199.00 in cents
    default:
      return 0;
  }
}