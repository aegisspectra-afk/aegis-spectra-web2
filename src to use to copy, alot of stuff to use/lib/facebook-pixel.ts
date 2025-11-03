// Facebook Pixel configuration
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

// Only load Facebook Pixel if ID is provided
export const isFBPixelEnabled = FB_PIXEL_ID && FB_PIXEL_ID !== 'XXXXXXXXXXXXXXX';

// Initialize Facebook Pixel
export const initFacebookPixel = () => {
  if (typeof window !== 'undefined' && !window.fbq && isFBPixelEnabled) {
    (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    
    if (window.fbq && FB_PIXEL_ID) {
      (window as any).fbq('init', FB_PIXEL_ID);
      (window as any).fbq('track', 'PageView');
    }
  }
};

// Track custom events
export const trackFacebookEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && isFBPixelEnabled && (window as any).fbq) {
    (window as any).fbq('track', eventName, parameters);
  }
};

// Common events for lead generation
export const trackLeadGeneration = (value?: number, currency = 'ILS') => {
  trackFacebookEvent('Lead', {
    value: value,
    currency: currency,
  });
};

export const trackContactFormSubmit = () => {
  trackFacebookEvent('CompleteRegistration');
};

export const trackWhatsAppClick = () => {
  trackFacebookEvent('Contact');
};

export const trackPricingView = (planName: string) => {
  trackFacebookEvent('ViewContent', {
    content_name: planName,
    content_category: 'pricing',
  });
};

// Declare fbq function for TypeScript
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}