import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;
    const organizationId = (session.user as any).organizationId;
    const alertId = params.id;

    if (!userId || !organizationId || !alertId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify alert belongs to user's organization
    const alert = await prisma.alert.findFirst({
      where: {
        id: alertId,
        organizationId: organizationId,
      },
    });

    if (!alert) {
      return NextResponse.json({ message: 'Alert not found' }, { status: 404 });
    }

    // Mark alert as read
    const updatedAlert = await prisma.alert.update({
      where: {
        id: alertId,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ alert: updatedAlert });
  } catch (error) {
    console.error('Failed to mark alert as read:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}