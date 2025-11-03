import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';
import { withOrg } from '@/lib/auth-guard';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!(session?.user as any)?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const cameraId = searchParams.get('cameraId');
    const eventType = searchParams.get('eventType');
    const severity = searchParams.get('severity');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = {
      organizationId: (session?.user as any)?.organizationId
    };

    if (cameraId) where.cameraId = cameraId;
    if (eventType) where.eventType = eventType;
    if (severity) where.severity = severity;
    
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          camera: {
            select: {
              name: true,
              location: true
            }
          },
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          timestamp: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.event.count({ where })
    ]);

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!(session?.user as any)?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { cameraId, eventType, severity, description, confidence, metadata } = body;

    if (!cameraId || !eventType || !severity || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // Verify camera belongs to user's organization
    const camera = await prisma.camera.findFirst({
      where: {
        id: cameraId,
        organizationId: (session?.user as any)?.organizationId
      }
    });

    if (!camera) {
      return NextResponse.json(
        { error: 'Camera not found or access denied' }, 
        { status: 404 }
      );
    }

    // Create event with organization isolation
    const event = await prisma.event.create({
      data: {
        cameraId,
        eventType,
        severity,
        description,
        confidence,
        metadata: metadata ? JSON.stringify(metadata) : null,
        userId: session?.user?.id,
        organizationId: (session?.user as any)?.organizationId
      },
      include: {
        camera: {
          select: {
            name: true,
            location: true
          }
        }
      }
    });

    return NextResponse.json(event, { status: 201 });
    
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' }, 
      { status: 500 }
    );
  }
}