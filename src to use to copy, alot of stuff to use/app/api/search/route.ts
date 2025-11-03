import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      query,
      dateRange,
      cameraId,
      eventType,
      severity,
      status,
      location,
      limit = 50,
      offset = 0
    } = body;

    // Build where clause for Prisma
    const where: any = {};

    // Text search
    if (query) {
      where.OR = [
        { description: { contains: query, mode: 'insensitive' } },
        { camera: { name: { contains: query, mode: 'insensitive' } } },
        { camera: { location: { contains: query, mode: 'insensitive' } } },
      ];
    }

    // Date range filter
    if (dateRange?.from || dateRange?.to) {
      where.timestamp = {};
      if (dateRange.from) {
        where.timestamp.gte = new Date(dateRange.from);
      }
      if (dateRange.to) {
        where.timestamp.lte = new Date(dateRange.to);
      }
    }

    // Camera filter
    if (cameraId) {
      where.cameraId = cameraId;
    }

    // Event type filter
    if (eventType) {
      where.eventType = eventType;
    }

    // Severity filter
    if (severity) {
      where.severity = severity.toUpperCase();
    }

    // Status filter
    if (status) {
      where.status = status.toUpperCase();
    }

    // Location filter
    if (location) {
      where.camera = {
        ...where.camera,
        location: { contains: location, mode: 'insensitive' }
      };
    }

    // Get events with camera information
    const events = await prisma.event.findMany({
      where,
      include: {
        camera: {
          select: {
            id: true,
            name: true,
            location: true,
            thumbnail: true,
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit,
      skip: offset
    });

    // Get total count for pagination
    const totalCount = await prisma.event.count({ where });

    // Transform to SearchResult format
    const results = events.map((event: any) => ({
      id: event.id,
      timestamp: event.timestamp,
      camera: {
        id: event.camera.id,
        name: event.camera.name,
        location: event.camera.location,
        thumbnail: event.camera.thumbnail || undefined,
      },
      event: {
        type: event.eventType.toLowerCase(),
        severity: event.severity.toLowerCase() as 'low' | 'medium' | 'high' | 'critical',
        description: event.description,
        confidence: event.confidence || 0.95,
      },
      status: event.status.toLowerCase() as 'active' | 'resolved' | 'investigating' | 'false_positive',
      metadata: event.metadata ? JSON.parse(event.metadata as string) : undefined,
    }));

    return NextResponse.json({
      results,
      totalCount,
      hasMore: offset + limit < totalCount
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get search suggestions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const query = searchParams.get('q');

    if (!type || !query) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    let suggestions: string[] = [];

    switch (type) {
      case 'cameras':
        const cameras = await prisma.camera.findMany({
          where: {
            name: { contains: query }
          },
          select: { name: true },
          take: 10
        });
        suggestions = cameras.map((c: any) => c.name);
        break;

      case 'locations':
        const locations = await prisma.camera.findMany({
          where: {
            location: { contains: query }
          },
          select: { location: true },
          take: 10,
          distinct: ['location']
        });
        suggestions = locations.map((c: any) => c.location);
        break;

      case 'events':
        const events = await prisma.event.findMany({
          where: {
            description: { contains: query }
          },
          select: { description: true },
          take: 10,
          distinct: ['description']
        });
        suggestions = events.map((e: any) => e.description);
        break;
    }

    return NextResponse.json({ suggestions });

  } catch (error) {
    console.error('Search suggestions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}