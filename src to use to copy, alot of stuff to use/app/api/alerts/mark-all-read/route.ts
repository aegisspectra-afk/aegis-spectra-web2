import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';

export async function PATCH() {
  try {
    const session = await requireAuth();
    const userId = session.user.id;
    const organizationId = (session.user as any).organizationId;

    if (!userId || !organizationId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Mark all alerts as read for the user's organization
    const result = await prisma.alert.updateMany({
      where: {
        organizationId: organizationId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ 
      message: 'All alerts marked as read',
      updatedCount: result.count 
    });
  } catch (error) {
    console.error('Failed to mark all alerts as read:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}