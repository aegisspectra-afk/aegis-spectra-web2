/**
 * Admin Analytics Dashboard API
 */
import { NextRequest, NextResponse } from 'next/server';
import { requireManager } from '@/lib/auth-server';
import { neon } from '@netlify/neon';

export const dynamic = 'force-dynamic';

const sql = neon();

export async function GET(request: NextRequest) {
  try {
    await requireManager(request);

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const to = searchParams.get('to') || new Date().toISOString();
    const eventType = searchParams.get('eventType');

    // Try to load from database (analytics_events table)
    let funnel = {
      visits: 0,
      builderStarts: 0,
      quotesSubmitted: 0,
      conversions: 0,
      conversionRate: 0,
    };

    let topPackages: Array<{
      slug: string;
      views: number;
      quotes: number;
    }> = [];

    let recentEvents: any[] = [];

    try {
      // Get funnel metrics from analytics_events
      const [funnelData] = await sql`
        SELECT 
          COUNT(*) FILTER (WHERE event_type = 'page_view') as visits,
          COUNT(*) FILTER (WHERE event_type = 'package_view') as builder_starts,
          COUNT(*) FILTER (WHERE event_type = 'quote_submit') as quotes_submitted,
          COUNT(*) FILTER (WHERE event_type = 'quote_submit') as conversions
        FROM analytics_events
        WHERE created_at >= ${from} AND created_at <= ${to}
      `.catch(() => [{ visits: 0, builder_starts: 0, quotes_submitted: 0, conversions: 0 }]);

      funnel = {
        visits: parseInt(funnelData?.visits || 0),
        builderStarts: parseInt(funnelData?.builder_starts || 0),
        quotesSubmitted: parseInt(funnelData?.quotes_submitted || 0),
        conversions: parseInt(funnelData?.conversions || 0),
        conversionRate: funnelData?.visits > 0 
          ? (parseInt(funnelData?.conversions || 0) / parseInt(funnelData?.visits || 1)) * 100 
          : 0,
      };

      // Get top packages
      const topPkgs = await sql`
        SELECT 
          event_data->>'packageSlug' as slug,
          COUNT(*) FILTER (WHERE event_type = 'package_view') as views,
          COUNT(*) FILTER (WHERE event_type = 'quote_submit' AND event_data->>'packageSlug' IS NOT NULL) as quotes
        FROM analytics_events
        WHERE created_at >= ${from} AND created_at <= ${to}
          AND (event_type = 'package_view' OR event_type = 'quote_submit')
        GROUP BY event_data->>'packageSlug'
        ORDER BY views DESC
        LIMIT 10
      `.catch(() => []);

      topPackages = topPkgs.map((p: any) => ({
        slug: p.slug || 'unknown',
        views: parseInt(p.views || 0),
        quotes: parseInt(p.quotes || 0),
      }));

      // Get recent events
      const events = await sql`
        SELECT * FROM analytics_events
        WHERE created_at >= ${from} AND created_at <= ${to}
        ${eventType ? sql`AND event_type = ${eventType}` : sql``}
        ORDER BY created_at DESC
        LIMIT 50
      `.catch(() => []);

      recentEvents = events;
    } catch (err: any) {
      console.error('Error fetching analytics from DB:', err);
      // Return empty data if table doesn't exist
    }

    return NextResponse.json({
      success: true,
      data: {
        funnel,
        topPackages,
        recentEvents,
        period: { from, to },
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.message.includes('Forbidden') ? 403 : 401 }
      );
    }

    console.error('Analytics dashboard error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to load analytics' },
      { status: 500 }
    );
  }
}

