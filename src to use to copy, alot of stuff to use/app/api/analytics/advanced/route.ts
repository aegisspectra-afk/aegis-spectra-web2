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
    const metric = searchParams.get('metric') || 'events';

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

    // Fetch analytics data based on the selected metric
    let analyticsData;

    switch (metric) {
      case 'events':
        analyticsData = await getEventsAnalytics(user.organizationId, startDate, endDate);
        break;
      case 'alerts':
        analyticsData = await getAlertsAnalytics(user.organizationId, startDate, endDate);
        break;
      case 'performance':
        analyticsData = await getPerformanceAnalytics(user.organizationId, startDate, endDate);
        break;
      case 'security':
        analyticsData = await getSecurityAnalytics(user.organizationId, startDate, endDate);
        break;
      default:
        analyticsData = await getEventsAnalytics(user.organizationId, startDate, endDate);
    }

    return NextResponse.json(analyticsData);

  } catch (error: any) {
    console.error('Advanced analytics error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

async function getEventsAnalytics(organizationId: string | null, startDate: Date, endDate: Date) {
  // Fetch events data
  const events = await prisma.event.findMany({
    where: {
      organizationId: organizationId || undefined,
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      camera: true,
    },
  });

  const cameras = await prisma.camera.findMany({
    where: {
      organizationId: organizationId || undefined,
    },
  });

  const alerts = await prisma.alert.findMany({
    where: {
      organizationId: organizationId || undefined,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Calculate summary
  const totalEvents = events.length;
  const totalAlerts = alerts.length;
  const totalCameras = cameras.length;
  const activeCameras = cameras.filter((c: any) => c.isActive).length;
  const systemUptime = totalCameras > 0 ? (activeCameras / totalCameras) * 100 : 0;

  // Calculate trends
  const eventsByDay = calculateEventsByDay(events, startDate, endDate);
  const eventsByHour = calculateEventsByHour(events);
  const eventsByType = calculateEventsByType(events);
  const eventsBySeverity = calculateEventsBySeverity(events);

  // Calculate performance metrics
  const performance = {
    camerasOnline: activeCameras,
    camerasOffline: totalCameras - activeCameras,
    totalCameras,
    uptime: systemUptime,
    averageLatency: 150, // Mock data - would be calculated from real metrics
    storageUsed: 750, // Mock data in GB
    storageTotal: 1000, // Mock data in GB
  };

  // Generate insights
  const topAlerts = calculateTopAlerts(alerts);
  const recommendations = generateRecommendations(events, alerts, performance);
  const anomalies = detectAnomalies(events);

  return {
    summary: {
      totalEvents,
      totalAlerts,
      totalCameras,
      averageResponseTime: 2.5, // Mock data
      systemUptime,
    },
    trends: {
      eventsByDay,
      eventsByHour,
      eventsByType,
      eventsBySeverity,
    },
    performance,
    insights: {
      topAlerts,
      recommendations,
      anomalies,
    },
  };
}

async function getAlertsAnalytics(organizationId: string | null, startDate: Date, endDate: Date) {
  // Similar structure but focused on alerts
  return getEventsAnalytics(organizationId, startDate, endDate);
}

async function getPerformanceAnalytics(organizationId: string | null, startDate: Date, endDate: Date) {
  // Similar structure but focused on performance metrics
  return getEventsAnalytics(organizationId, startDate, endDate);
}

async function getSecurityAnalytics(organizationId: string | null, startDate: Date, endDate: Date) {
  // Similar structure but focused on security metrics
  return getEventsAnalytics(organizationId, startDate, endDate);
}

function calculateEventsByDay(events: any[], startDate: Date, endDate: Date) {
  const days = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dayStart = new Date(currentDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);
    
    const dayEvents = events.filter(event => 
      event.timestamp >= dayStart && event.timestamp <= dayEnd
    );
    
    days.push({
      date: currentDate.toISOString().split('T')[0],
      count: dayEvents.length,
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return days;
}

function calculateEventsByHour(events: any[]) {
  const hours = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));
  
  events.forEach(event => {
    const hour = new Date(event.timestamp).getHours();
    hours[hour].count++;
  });
  
  return hours;
}

function calculateEventsByType(events: any[]) {
  const typeCounts: { [key: string]: number } = {};
  
  events.forEach(event => {
    typeCounts[event.eventType] = (typeCounts[event.eventType] || 0) + 1;
  });
  
  const total = events.length;
  
    return Object.entries(typeCounts).map(([type, count]: [string, number]) => ({
    type,
    count,
    percentage: total > 0 ? (count / total) * 100 : 0,
  }));
}

function calculateEventsBySeverity(events: any[]) {
  const severityCounts: { [key: string]: number } = {};
  
  events.forEach(event => {
    severityCounts[event.severity] = (severityCounts[event.severity] || 0) + 1;
  });
  
  const severityColors: { [key: string]: string } = {
    'LOW': '#10b981',
    'MEDIUM': '#f59e0b',
    'HIGH': '#ef4444',
    'CRITICAL': '#dc2626',
  };
  
    return Object.entries(severityCounts).map(([severity, count]: [string, number]) => ({
    severity,
    count,
    color: severityColors[severity] || '#6b7280',
  }));
}

function calculateTopAlerts(alerts: any[]) {
  const alertCounts: { [key: string]: { title: string; count: number; severity: string } } = {};
  
  alerts.forEach(alert => {
    const key = alert.title;
    if (!alertCounts[key]) {
      alertCounts[key] = {
        title: alert.title,
        count: 0,
        severity: alert.severity,
      };
    }
    alertCounts[key].count++;
  });
  
  return Object.values(alertCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
        .map((alert: any, index: number) => ({
      id: `alert-${index}`,
      title: alert.title,
      count: alert.count,
      severity: alert.severity,
    }));
}

function generateRecommendations(events: any[], alerts: any[], performance: any) {
  const recommendations = [];
  
  // Performance recommendations
  if (performance.uptime < 95) {
    recommendations.push({
      id: 'uptime-1',
      title: 'Improve System Uptime',
      description: 'System uptime is below 95%. Consider checking camera connections and network stability.',
      priority: 'HIGH',
    });
  }
  
  if (performance.storageUsed / performance.storageTotal > 0.8) {
    recommendations.push({
      id: 'storage-1',
      title: 'Storage Space Warning',
      description: 'Storage usage is above 80%. Consider cleaning old recordings or upgrading storage.',
      priority: 'MEDIUM',
    });
  }
  
  // Security recommendations
  const criticalAlerts = alerts.filter(alert => alert.severity === 'CRITICAL');
  if (criticalAlerts.length > 0) {
    recommendations.push({
      id: 'security-1',
      title: 'Address Critical Alerts',
      description: `There are ${criticalAlerts.length} critical alerts that require immediate attention.`,
      priority: 'HIGH',
    });
  }
  
  return recommendations;
}

function detectAnomalies(events: any[]) {
  const anomalies: any[] = [];
  
  // Simple anomaly detection - events with unusual patterns
  const eventCountsByHour = calculateEventsByHour(events);
  const averageEventsPerHour = events.length / 24;
  
  eventCountsByHour.forEach((hourData, hour) => {
    if (hourData.count > averageEventsPerHour * 3) {
      anomalies.push({
        id: `anomaly-${hour}`,
        description: `Unusual activity detected at hour ${hour}: ${hourData.count} events (average: ${averageEventsPerHour.toFixed(1)})`,
        severity: 'MEDIUM',
        timestamp: new Date().toISOString(),
      });
    }
  });
  
  return anomalies.slice(0, 5); // Return top 5 anomalies
}