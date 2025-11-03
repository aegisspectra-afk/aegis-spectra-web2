import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export const dynamic = 'force-dynamic';
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

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const format = searchParams.get('format') || 'CSV';

    // Parse date range
    const startDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = to ? new Date(to) : new Date();

    // Get user's organization ID for multi-tenant support
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organizationId: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch data for export
    const [events, alerts, cameras] = await Promise.all([
      prisma.event.findMany({
        where: {
          organizationId: user.organizationId || undefined,
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          camera: true,
        },
      }),
      prisma.alert.findMany({
        where: {
          organizationId: user.organizationId || undefined,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          camera: true,
        },
      }),
      prisma.camera.findMany({
        where: {
          organizationId: user.organizationId || undefined,
        },
      }),
    ]);

    if (format.toUpperCase() === 'CSV') {
      const csvContent = generateCSV(events, alerts, cameras);
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="analytics_export_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    } else if (format.toUpperCase() === 'JSON') {
      const jsonData = {
        exportDate: new Date().toISOString(),
        dateRange: {
          from: startDate.toISOString(),
          to: endDate.toISOString(),
        },
        summary: {
          totalEvents: events.length,
          totalAlerts: alerts.length,
          totalCameras: cameras.length,
        },
        data: {
          events: events.map((event: any) => ({
            id: event.id,
            timestamp: event.timestamp,
            eventType: event.eventType,
            severity: event.severity,
            description: event.description,
            cameraName: event.camera?.name || 'Unknown',
            cameraLocation: event.camera?.location || 'Unknown',
            status: event.status,
          })),
          alerts: alerts.map((alert: any) => ({
            id: alert.id,
            createdAt: alert.createdAt,
            type: alert.type,
            title: alert.title,
            description: alert.description,
            severity: alert.severity,
            isRead: alert.isRead,
            cameraName: alert.camera?.name || 'Unknown',
            cameraLocation: alert.camera?.location || 'Unknown',
          })),
          cameras: cameras.map((camera: any) => ({
            id: camera.id,
            name: camera.name,
            location: camera.location,
            description: camera.description,
            isActive: camera.isActive,
            createdAt: camera.createdAt,
            updatedAt: camera.updatedAt,
          })),
        },
      };

      return new NextResponse(JSON.stringify(jsonData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="analytics_export_${new Date().toISOString().split('T')[0]}.json"`,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid format. Supported formats: CSV, JSON' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Analytics export error:', error);

    return NextResponse.json(
      { error: 'Failed to export analytics data' },
      { status: 500 }
    );
  }
}

function generateCSV(events: any[], alerts: any[], cameras: any[]): string {
  const csvRows: string[] = [];
  
  // CSV Header
  csvRows.push('Type,ID,Timestamp,Event Type,Severity,Description,Camera Name,Camera Location,Status,Additional Info');
  
  // Events data
  events.forEach(event => {
    csvRows.push([
      'Event',
      event.id,
      event.timestamp.toISOString(),
      event.eventType,
      event.severity,
      `"${event.description.replace(/"/g, '""')}"`,
      `"${event.camera?.name || 'Unknown'}"`,
      `"${event.camera?.location || 'Unknown'}"`,
      event.status,
      `"${event.metadata || ''}"`,
    ].join(','));
  });
  
  // Alerts data
  alerts.forEach(alert => {
    csvRows.push([
      'Alert',
      alert.id,
      alert.createdAt.toISOString(),
      alert.type,
      alert.severity,
      `"${alert.description.replace(/"/g, '""')}"`,
      `"${alert.camera?.name || 'Unknown'}"`,
      `"${alert.camera?.location || 'Unknown'}"`,
      alert.isRead ? 'Read' : 'Unread',
      `"${alert.title}"`,
    ].join(','));
  });
  
  // Cameras data
  cameras.forEach(camera => {
    csvRows.push([
      'Camera',
      camera.id,
      camera.createdAt.toISOString(),
      'Camera Info',
      'INFO',
      `"${camera.description || ''}"`,
      `"${camera.name}"`,
      `"${camera.location}"`,
      camera.isActive ? 'Active' : 'Inactive',
      `"Created: ${camera.createdAt.toISOString()}, Updated: ${camera.updatedAt.toISOString()}"`,
    ].join(','));
  });
  
  return csvRows.join('\n');
}