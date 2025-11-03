// Performance optimization utilities

// Image optimization utilities
export const optimizeImage = (src: string, width?: number, height?: number, quality: number = 75): string => {
  // For Next.js Image component, we don't need to modify the src
  // The optimization is handled by Next.js automatically
  return src;
};

// Lazy loading hook
export function useLazyLoading() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const setRef = useCallback((node: HTMLElement | null) => {
    if (elementRef.current) {
      observerRef.current?.unobserve(elementRef.current);
    }

    if (node) {
      elementRef.current = node;
      observerRef.current?.observe(node);
    }
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.classList.add('loaded');
            observerRef.current?.unobserve(target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return setRef;
}

// Debounce hook for search and input optimization
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook for scroll and resize optimization
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return;

  // Preload critical fonts
  const fontPreloads = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap',
  ];

  fontPreloads.forEach((href) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });

  // Preload critical images
  const imagePreloads = [
    '/hero-bg.jpg',
    '/logo.png',
    '/og-image.png',
  ];

  imagePreloads.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Resource hints for external domains
export const addResourceHints = () => {
  if (typeof window === 'undefined') return;

  const hints = [
    { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' },
    { rel: 'dns-prefetch', href: 'https://connect.facebook.net' },
    { rel: 'dns-prefetch', href: 'https://api-m.sandbox.paypal.com' },
    { rel: 'dns-prefetch', href: 'https://api.paypal.com' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
  ];

  hints.forEach((hint) => {
    const link = document.createElement('link');
    Object.entries(hint).forEach(([key, value]) => {
      link.setAttribute(key, value);
    });
    document.head.appendChild(link);
  });
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  if (typeof window === 'undefined') return fn();

  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`${name} took ${end - start} milliseconds`);
  
  // Send to analytics if available
  if (window.gtag) {
    window.gtag('event', 'timing_complete', {
      name: name,
      value: Math.round(end - start),
    });
  }
  
  return result;
};

// Bundle size optimization
export const loadComponent = (importFn: () => Promise<any>) => {
  return React.lazy(importFn);
};

// Critical CSS extraction
export const extractCriticalCSS = (css: string): string => {
  // This would be handled by a build tool in production
  // For now, we'll return the full CSS
  return css;
};

// Service Worker registration for caching
export const registerServiceWorker = () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
};

// Image lazy loading with intersection observer
export const useImageLazyLoading = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return { imgRef, isLoaded, isInView, handleLoad };
};

// Code splitting utilities
export const createAsyncComponent = (importFn: () => Promise<any>) => {
  return React.lazy(() => importFn().catch(() => ({
    default: () => React.createElement('div', null, 'Error loading component')
  })));
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if (typeof window === 'undefined' || !('memory' in performance)) return;

  const memory = (performance as any).memory;
  console.log('Memory usage:', {
    used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
    total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
    limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB',
  });
};

// Performance budget monitoring
export const checkPerformanceBudget = () => {
  if (typeof window === 'undefined') return;

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  const metrics = {
    fcp: 0, // First Contentful Paint
    lcp: 0, // Largest Contentful Paint
    fid: 0, // First Input Delay
    cls: 0, // Cumulative Layout Shift
  };

  // Check if metrics are within budget
  const budget = {
    fcp: 2000, // 2 seconds
    lcp: 4000, // 4 seconds
    fid: 100,  // 100ms
    cls: 0.1,  // 0.1
  };

  Object.entries(metrics).forEach(([metric, value]) => {
    if (value > budget[metric as keyof typeof budget]) {
      console.warn(`Performance budget exceeded for ${metric}: ${value}ms`);
    }
  });
};

// Import React hooks
import React, { useState, useEffect, useRef, useCallback } from 'react';
