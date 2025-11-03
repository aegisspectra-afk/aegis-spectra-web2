"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function GoogleAnalytics({ gaId }: { gaId?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!gaId) return;

    // Initialize GA
    if (!window.gtag) {
      const script1 = document.createElement("script");
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script1);

      const script2 = document.createElement("script");
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}', {
          page_path: window.location.pathname,
        });
      `;
      document.head.appendChild(script2);
    }
  }, [gaId]);

  useEffect(() => {
    if (!gaId || !(window as any).gtag) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    (window as any).gtag("config", gaId, {
      page_path: url,
    });
  }, [pathname, searchParams, gaId]);

  return null;
}

// Re-export from lib/analytics for backward compatibility
export { 
  trackGAEvent as trackEvent, 
  trackConversion,
  trackPageView,
  trackContactForm,
  trackProductView,
  trackPurchase,
  trackBlogView,
  trackPhoneCall,
  trackWhatsAppClick,
  trackError,
  trackScrollDepth,
  trackTimeOnPage,
  trackSearch,
  trackFormSubmission,
  trackLeadGeneration,
  trackButtonClick
} from '@/lib/analytics';

