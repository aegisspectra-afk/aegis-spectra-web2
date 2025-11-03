// Analytics utilities for tracking events

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

// Google Analytics events
export const trackGAEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Facebook Pixel events
export const trackFBEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters);
  }
};

// Common tracking events
export const trackPageView = (pageName: string) => {
  trackGAEvent('page_view', 'Navigation', pageName);
  trackFBEvent('PageView');
};

export const trackContactForm = (formType: string) => {
  trackGAEvent('form_submit', 'Contact', formType);
  trackFBEvent('Lead', { content_name: formType });
};

export const trackProductView = (productName: string, price?: number) => {
  trackGAEvent('view_item', 'Ecommerce', productName, price);
  trackFBEvent('ViewContent', {
    content_name: productName,
    value: price,
    currency: 'ILS'
  });
};

export const trackAddToCart = (productName: string, price: number, quantity: number = 1) => {
  trackGAEvent('add_to_cart', 'Ecommerce', productName, price * quantity);
  trackFBEvent('AddToCart', {
    content_name: productName,
    value: price * quantity,
    currency: 'ILS'
  });
};

export const trackPurchase = (transactionId: string, value: number, items: Array<{name: string, price: number, quantity: number}>) => {
  trackGAEvent('purchase', 'Ecommerce', transactionId, value);
  trackFBEvent('Purchase', {
    content_name: 'Security System',
    value: value,
    currency: 'ILS'
  });
};

export const trackGuideView = (guideName: string, category: string) => {
  trackGAEvent('view_guide', 'Content', guideName);
  trackFBEvent('ViewContent', {
    content_name: guideName,
    content_category: category
  });
};

export const trackBlogView = (postTitle: string, category: string) => {
  trackGAEvent('view_blog', 'Content', postTitle);
  trackFBEvent('ViewContent', {
    content_name: postTitle,
    content_category: category
  });
};

export const trackPhoneCall = (phoneNumber: string) => {
  trackGAEvent('phone_call', 'Contact', phoneNumber);
  trackFBEvent('Contact', { content_name: 'Phone Call' });
};

export const trackWhatsAppClick = (context: string) => {
  trackGAEvent('whatsapp_click', 'Contact', context);
  trackFBEvent('Contact', { content_name: 'WhatsApp' });
};

export const trackDemoRequest = (demoType: string) => {
  trackGAEvent('demo_request', 'Lead', demoType);
  trackFBEvent('Lead', { content_name: 'Demo Request' });
};

export const trackQuoteRequest = (quoteType: string) => {
  trackGAEvent('quote_request', 'Lead', quoteType);
  trackFBEvent('Lead', { content_name: 'Quote Request' });
};

// Conversion tracking
export const trackConversion = (conversionType: string, value?: number) => {
  trackGAEvent('conversion', 'Conversion', conversionType, value);
  trackFBEvent('CompleteRegistration', {
    content_name: conversionType,
    value: value,
    currency: 'ILS'
  });
};

// Error tracking
export const trackError = (errorType: string, errorMessage: string) => {
  trackGAEvent('exception', 'Error', errorType);
  // Facebook doesn't have a specific error event, but we can use custom events
  trackFBEvent('CustomEvent', {
    event_name: 'Error',
    error_type: errorType,
    error_message: errorMessage
  });
};

// User engagement tracking
export const trackScrollDepth = (depth: number) => {
  trackGAEvent('scroll', 'Engagement', `${depth}%`);
};

export const trackTimeOnPage = (timeInSeconds: number) => {
  trackGAEvent('timing_complete', 'Engagement', 'Time on Page', timeInSeconds);
};

export const trackVideoPlay = (videoTitle: string) => {
  trackGAEvent('video_play', 'Engagement', videoTitle);
  trackFBEvent('VideoPlay', { content_name: videoTitle });
};

// Search tracking
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackGAEvent('search', 'Site Search', searchTerm, resultsCount);
  trackFBEvent('Search', { search_string: searchTerm });
};

// Social media tracking
export const trackSocialShare = (platform: string, content: string) => {
  trackGAEvent('share', 'Social', platform);
  trackFBEvent('Share', { content_name: content });
};

// Newsletter signup
export const trackNewsletterSignup = (email: string) => {
  trackGAEvent('newsletter_signup', 'Lead', 'Newsletter');
  trackFBEvent('CompleteRegistration', { content_name: 'Newsletter Signup' });
};

// Download tracking
export const trackDownload = (fileName: string, fileType: string) => {
  trackGAEvent('file_download', 'Downloads', fileName);
  trackFBEvent('ViewContent', { content_name: fileName, content_type: fileType });
};

// Form tracking
export const trackFormSubmission = (formName: string, formType: string | boolean) => {
  const typeString = typeof formType === 'boolean' ? (formType ? 'success' : 'error') : formType;
  trackGAEvent('form_submit', 'Forms', formName);
  trackFBEvent('Lead', { content_name: formName, content_category: typeString });
};

export const trackLeadGeneration = (leadType: string, source: string | number) => {
  const sourceString = typeof source === 'number' ? source.toString() : source;
  trackGAEvent('lead_generation', 'Lead', leadType);
  trackFBEvent('Lead', { content_name: leadType, content_category: sourceString });
};

// Button and interaction tracking
export const trackButtonClick = (buttonName: string, location: string) => {
  trackGAEvent('button_click', 'Interaction', buttonName);
  trackFBEvent('CustomEvent', { event_name: 'Button Click', button_name: buttonName, location: location });
};

export const trackPricingTierClick = (tierName: string, price: number) => {
  trackGAEvent('pricing_tier_click', 'Pricing', tierName, price);
  trackFBEvent('ViewContent', { 
    content_name: tierName, 
    value: price, 
    currency: 'ILS',
    content_category: 'Pricing'
  });
};