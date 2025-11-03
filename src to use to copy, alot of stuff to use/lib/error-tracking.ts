// Error tracking and logging
export interface ErrorInfo {
  message: string;
  stack?: string;
  url?: string;
  line?: number;
  column?: number;
  userAgent?: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export class ErrorTracker {
  private static instance: ErrorTracker;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  trackError(error: Error, context?: Record<string, any>): void {
    const errorInfo: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      ...context,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracked:', errorInfo);
    }

    // Send to analytics service
    this.sendToAnalytics(errorInfo);
  }

  trackApiError(endpoint: string, status: number, message: string): void {
    const errorInfo: ErrorInfo = {
      message: `API Error: ${endpoint} - ${status}`,
      url: endpoint,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
    };

    this.sendToAnalytics(errorInfo);
  }

  trackFormError(formName: string, field: string, error: string): void {
    const errorInfo: ErrorInfo = {
      message: `Form Error: ${formName}.${field} - ${error}`,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
    };

    this.sendToAnalytics(errorInfo);
  }

  private sendToAnalytics(errorInfo: ErrorInfo): void {
    // In production, send to your error tracking service
    if (typeof window !== 'undefined') {
      // Send to Sentry if configured
      if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        // Sentry integration would go here
        console.log('Error sent to Sentry:', errorInfo);
      } else {
        console.log('Error sent to analytics:', errorInfo);
      }
    }
  }
}

// Global error handler
export function setupErrorTracking(): void {
  if (typeof window === 'undefined') return;

  const errorTracker = ErrorTracker.getInstance();

  // Track unhandled errors
  window.addEventListener('error', (event) => {
    errorTracker.trackError(event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorTracker.trackError(new Error(event.reason), {
      type: 'unhandled_promise_rejection',
    });
  });
}

// Performance monitoring
export function trackPerformance(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const performanceData = {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
      firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
    };

    console.log('Performance metrics:', performanceData);
  });
}