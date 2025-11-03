import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';

export async function GET() {
  try {
    const session = await requireAuth();
    const userId = session.user.id;
    const organizationId = (session.user as any).organizationId;

    if (!userId || !organizationId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get alerts for the user's organization
    const alerts = await prisma.alert.findMany({
      where: {
        organizationId: organizationId,
      },
      include: {
        camera: {
          select: {
            name: true,
            location: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to last 50 alerts
    });

    const unreadCount = await prisma.alert.count({
      where: {
        organizationId: organizationId,
        isRead: false,
      },
    });

    return NextResponse.json({
      alerts: alerts.map((alert: any) => ({
        id: alert.id,
        type: alert.type,
        title: alert.title,
        description: alert.description,
        timestamp: alert.createdAt,
        cameraId: alert.cameraId,
        cameraName: alert.camera?.name || 'Unknown Camera',
        severity: alert.severity,
        isRead: alert.isRead,
        thumbnail: alert.thumbnail,
      })),
      unreadCount,
    });
  } catch (error) {
    console.error('Failed to fetch alerts:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;
    const organizationId = (session.user as any).organizationId;

    if (!userId || !organizationId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, title, description, cameraId, severity = 'medium' } = body;

    if (!type || !title || !description || !cameraId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Verify camera belongs to user's organization
    const camera = await prisma.camera.findFirst({
      where: {
        id: cameraId,
        organizationId: organizationId,
      },
    });

    if (!camera) {
      return NextResponse.json({ message: 'Camera not found' }, { status: 404 });
    }

    const alert = await prisma.alert.create({
      data: {
        type,
        title,
        description,
        severity,
        cameraId,
        organizationId,
        userId,
      },
    });

    return NextResponse.json({ alert });
  } catch (error) {
    console.error('Failed to create alert:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}