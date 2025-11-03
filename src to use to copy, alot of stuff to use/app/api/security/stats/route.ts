import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { logSecurityEvent } from '@/lib/security';

/**
 * GET /api/security/stats - Get security statistics
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only allow admin users to view security stats
    if (!session?.user?.roles?.includes('ADMIN') && !session?.user?.roles?.includes('SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get date range (default: last 30 days)
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get security event counts by severity
    const [totalEvents, criticalEvents, highEvents, mediumEvents, lowEvents] = await Promise.all([
      prisma.securityAuditLog.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      prisma.securityAuditLog.count({
        where: {
          severity: 'critical',
          createdAt: {
            gte: startDate
          }
        }
      }),
      prisma.securityAuditLog.count({
        where: {
          severity: 'high',
          createdAt: {
            gte: startDate
          }
        }
      }),
      prisma.securityAuditLog.count({
        where: {
          severity: 'medium',
          createdAt: {
            gte: startDate
          }
        }
      }),
      prisma.securityAuditLog.count({
        where: {
          severity: 'low',
          createdAt: {
            gte: startDate
          }
        }
      })
    ]);

    // Get recent events
    const recentEvents = await prisma.securityAuditLog.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    // Get events by type
    const eventsByType = await prisma.securityAuditLog.groupBy({
      by: ['event'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: {
        event: true
      },
      orderBy: {
        _count: {
          event: 'desc'
        }
      },
      take: 10
    });

    // Get events by severity over time (last 7 days)
    const eventsOverTime = await prisma.$queryRaw`
      SELECT 
        DATE(createdAt) as date,
        severity,
        COUNT(*) as count
      FROM security_audit_logs 
      WHERE createdAt >= ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
      GROUP BY DATE(createdAt), severity
      ORDER BY date DESC, severity
    `;

    // Get top IPs with most events
    const topIPs = await prisma.securityAuditLog.groupBy({
      by: ['ip'],
      where: {
        createdAt: {
          gte: startDate
        },
        ip: {
          not: null
        }
      },
      _count: {
        ip: true
      },
      orderBy: {
        _count: {
          ip: 'desc'
        }
      },
      take: 10
    });

    // Get failed login attempts
    const failedLogins = await prisma.securityAuditLog.count({
      where: {
        event: 'login_failed',
        createdAt: {
          gte: startDate
        }
      }
    });

    // Get successful logins
    const successfulLogins = await prisma.securityAuditLog.count({
      where: {
        event: 'login_success',
        createdAt: {
          gte: startDate
        }
      }
    });

    // Get rate limit blocks
    const rateLimitBlocks = await prisma.securityAuditLog.count({
      where: {
        event: 'rate_limit_exceeded',
        createdAt: {
          gte: startDate
        }
      }
    });

    // Get CSRF violations
    const csrfViolations = await prisma.securityAuditLog.count({
      where: {
        event: 'csrf_violation',
        createdAt: {
          gte: startDate
        }
      }
    });

    // Calculate security score (0-100)
    const securityScore = Math.max(0, 100 - (criticalEvents * 20) - (highEvents * 10) - (mediumEvents * 5) - (lowEvents * 1));

    const stats = {
      totalEvents,
      criticalEvents,
      highEvents,
      mediumEvents,
      lowEvents,
      recentEvents,
      eventsByType,
      eventsOverTime,
      topIPs,
      failedLogins,
      successfulLogins,
      rateLimitBlocks,
      csrfViolations,
      securityScore,
      dateRange: {
        start: startDate,
        end: new Date(),
        days
      }
    };

    // Log security stats access
    logSecurityEvent('security_stats_accessed', {
      ip: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      endpoint: '/api/security/stats',
      severity: 'low',
      message: 'Security statistics accessed',
      metadata: { days, userId: session.user.id }
    });

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching security stats:', error);
    
    logSecurityEvent('security_stats_error', {
      ip: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      endpoint: '/api/security/stats',
      severity: 'high',
      message: 'Error accessing security statistics',
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
    });

    return NextResponse.json(
      { error: 'Failed to fetch security statistics' },
      { status: 500 }
    );
  }
}
