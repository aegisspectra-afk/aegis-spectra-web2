/**
 * Analytics Events Service - Track user events
 */
type AnalyticsEventType =
  | 'page_view'
  | 'package_view'
  | 'package_compare_view'
  | 'price_calc'
  | 'add_to_cart'
  | 'quote_start'
  | 'quote_step_complete'
  | 'quote_submit'
  | 'quote_share'
  | 'quote_pdf_download';

export interface AnalyticsEventPayload {
  eventType: AnalyticsEventType;
  packageSlug?: string;
  payload?: Record<string, any>;
  timestamp?: string;
}

/**
 * Track analytics event
 */
export async function trackEvent(
  eventType: AnalyticsEventType,
  payload: Record<string, any> = {}
): Promise<void> {
  // Client-side tracking
  if (typeof window !== 'undefined') {
    try {
      // Send to server
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          packageSlug: payload.packageSlug,
          payload,
          timestamp: new Date().toISOString(),
        }),
      });

      // Also send to external analytics (if configured)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventType, payload);
      }
    } catch (error) {
      console.error('Failed to track event:', error);
      // Don't throw - analytics failures shouldn't break the app
    }
  }
}

/**
 * Helper functions for common events
 */
export const analytics = {
  pageView: (path: string) => trackEvent('page_view', { path }),
  
  packageView: (slug: string) => trackEvent('package_view', { packageSlug: slug }),
  
  packageCompareView: () => trackEvent('package_compare_view'),
  
  priceCalc: (slug: string, total: number, options?: any) =>
    trackEvent('price_calc', { packageSlug: slug, total, options }),
  
  addToCart: (slug: string, price: number) =>
    trackEvent('add_to_cart', { packageSlug: slug, price }),
  
  quoteStart: () => trackEvent('quote_start'),
  
  quoteStepComplete: (step: number) =>
    trackEvent('quote_step_complete', { step }),
  
  quoteSubmit: (quoteId: string, total: number) =>
    trackEvent('quote_submit', { quoteId, total }),
  
  quoteShare: (quoteId: string) =>
    trackEvent('quote_share', { quoteId }),
  
  quotePdfDownload: (quoteId: string) =>
    trackEvent('quote_pdf_download', { quoteId }),
};

