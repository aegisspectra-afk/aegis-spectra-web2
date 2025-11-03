// Mobile optimization utilities

import { useEffect, useState, useCallback } from 'react';

// Mobile detection utilities
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768;
};

export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /iPad|Android/i.test(navigator.userAgent) && window.innerWidth > 768 && window.innerWidth <= 1024;
};

export const isDesktop = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.innerWidth > 1024;
};

// Touch detection
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Screen size detection hook
export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isTouch: false,
  });

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({
        width,
        height,
        isMobile: width <= 768,
        isTablet: width > 768 && width <= 1024,
        isDesktop: width > 1024,
        isTouch: isTouchDevice(),
      });
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return screenSize;
};

// Mobile-specific optimizations
export const mobileOptimizations = {
  // Reduce animations on mobile for better performance
  reduceAnimations: () => {
    if (typeof window === 'undefined') return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileDevice = isMobile();
    
    if (prefersReducedMotion || isMobileDevice) {
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
      document.documentElement.style.setProperty('--transition-duration', '0.1s');
    }
  },

  // Optimize images for mobile
  optimizeImages: () => {
    if (typeof window === 'undefined') return;
    
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      // Add loading="lazy" for better performance
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      
      // Add decoding="async" for better performance
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
    });
  },

  // Optimize fonts for mobile
  optimizeFonts: () => {
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
  },

  // Add touch-friendly interactions
  addTouchInteractions: () => {
    if (typeof window === 'undefined') return;
    
    // Add touch feedback to buttons
    const buttons = document.querySelectorAll('button, [role="button"]');
    buttons.forEach((button) => {
      button.addEventListener('touchstart', () => {
        button.classList.add('touch-active');
      });
      
      button.addEventListener('touchend', () => {
        button.classList.remove('touch-active');
      });
    });
  },

  // Optimize scrolling for mobile
  optimizeScrolling: () => {
    if (typeof window === 'undefined') return;
    
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add momentum scrolling for iOS
    (document.body.style as any).webkitOverflowScrolling = 'touch';
  },

  // Add mobile-specific meta tags
  addMobileMetaTags: () => {
    if (typeof window === 'undefined') return;
    
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(meta);
    }
    
    // Add mobile web app capabilities
    const appleMobileWebApp = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (!appleMobileWebApp) {
      const meta = document.createElement('meta');
      meta.name = 'apple-mobile-web-app-capable';
      meta.content = 'yes';
      document.head.appendChild(meta);
    }
    
    // Add status bar style
    const statusBarStyle = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!statusBarStyle) {
      const meta = document.createElement('meta');
      meta.name = 'apple-mobile-web-app-status-bar-style';
      meta.content = 'black-translucent';
      document.head.appendChild(meta);
    }
  },
};

// Mobile-specific CSS classes
export const mobileClasses = {
  // Hide on mobile
  hideOnMobile: 'hidden md:block',
  
  // Show only on mobile
  showOnMobile: 'block md:hidden',
  
  // Mobile-specific spacing
  mobilePadding: 'px-4 md:px-6 lg:px-8',
  mobileMargin: 'mx-4 md:mx-6 lg:mx-8',
  
  // Mobile-specific text sizes
  mobileText: 'text-sm md:text-base lg:text-lg',
  mobileHeading: 'text-xl md:text-2xl lg:text-3xl',
  
  // Mobile-specific grid
  mobileGrid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  mobileFlex: 'flex-col md:flex-row',
  
  // Touch-friendly sizes
  touchTarget: 'min-h-[44px] min-w-[44px]',
  touchButton: 'px-6 py-3 md:px-4 md:py-2',
};

// Mobile performance optimizations
export const mobilePerformance = {
  // Reduce bundle size for mobile
  loadCriticalOnly: () => {
    if (typeof window === 'undefined') return;
    
    // Only load critical components on mobile
    if (isMobile()) {
      // Lazy load non-critical components
      const lazyComponents = document.querySelectorAll('[data-lazy]');
      lazyComponents.forEach((component) => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Load component
              const src = entry.target.getAttribute('data-src');
              if (src) {
                entry.target.setAttribute('src', src);
                observer.unobserve(entry.target);
              }
            }
          });
        });
        
        observer.observe(component);
      });
    }
  },

  // Optimize images for mobile
  optimizeImagesForMobile: () => {
    if (typeof window === 'undefined') return;
    
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      // Use smaller images on mobile
      if (isMobile()) {
        const src = img.getAttribute('src');
        if (src && !src.includes('w_')) {
          // Add width parameter for responsive images
          const newSrc = src.replace(/(\.[^.]+)$/, '_mobile$1');
          img.setAttribute('src', newSrc);
        }
      }
    });
  },

  // Reduce JavaScript execution on mobile
  reduceJSExecution: () => {
    if (typeof window === 'undefined') return;
    
    if (isMobile()) {
      // Use requestIdleCallback for non-critical tasks
      const runWhenIdle = (callback: () => void) => {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(callback);
        } else {
          setTimeout(callback, 1);
        }
      };
      
      // Defer non-critical JavaScript
      runWhenIdle(() => {
        // Load analytics
        if (window.gtag) {
          window.gtag('config', 'GA_MEASUREMENT_ID');
        }
      });
    }
  },
};

// Mobile-specific event handlers
export const mobileEvents = {
  // Handle touch events
  handleTouch: (element: HTMLElement, callback: (e: TouchEvent) => void) => {
    element.addEventListener('touchstart', callback, { passive: true });
    element.addEventListener('touchend', callback, { passive: true });
  },

  // Handle swipe gestures
  handleSwipe: (element: HTMLElement, onSwipeLeft: () => void, onSwipeRight: () => void) => {
    let startX = 0;
    let startY = 0;
    
    element.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });
    
    element.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const diffX = startX - endX;
      const diffY = startY - endY;
      
      // Check if it's a horizontal swipe
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          onSwipeLeft();
        } else {
          onSwipeRight();
        }
      }
    });
  },

  // Handle pull-to-refresh
  handlePullToRefresh: (callback: () => void) => {
    if (typeof window === 'undefined') return;
    
    let startY = 0;
    let isPulling = false;
    
    document.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      isPulling = window.scrollY === 0;
    });
    
    document.addEventListener('touchmove', (e) => {
      if (!isPulling) return;
      
      const currentY = e.touches[0].clientY;
      const diffY = currentY - startY;
      
      if (diffY > 100) {
        callback();
        isPulling = false;
      }
    });
  },
};

// Initialize mobile optimizations
export const initializeMobileOptimizations = () => {
  if (typeof window === 'undefined') return;
  
  // Run optimizations
  mobileOptimizations.reduceAnimations();
  mobileOptimizations.optimizeImages();
  mobileOptimizations.optimizeFonts();
  mobileOptimizations.addTouchInteractions();
  mobileOptimizations.optimizeScrolling();
  mobileOptimizations.addMobileMetaTags();
  
  // Run performance optimizations
  mobilePerformance.loadCriticalOnly();
  mobilePerformance.optimizeImagesForMobile();
  mobilePerformance.reduceJSExecution();
};

// Mobile-specific utility functions
export const mobileUtils = {
  // Get safe area insets for notched devices
  getSafeAreaInsets: () => {
    if (typeof window === 'undefined') return { top: 0, bottom: 0, left: 0, right: 0 };
    
    const style = getComputedStyle(document.documentElement);
    return {
      top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0'),
      bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0'),
      left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0'),
      right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0'),
    };
  },

  // Check if device has notch
  hasNotch: () => {
    if (typeof window === 'undefined') return false;
    
    const insets = mobileUtils.getSafeAreaInsets();
    return insets.top > 0 || insets.bottom > 0;
  },

  // Get device orientation
  getOrientation: () => {
    if (typeof window === 'undefined') return 'portrait';
    
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  },

  // Check if device is in landscape mode
  isLandscape: () => {
    return mobileUtils.getOrientation() === 'landscape';
  },

  // Check if device is in portrait mode
  isPortrait: () => {
    return mobileUtils.getOrientation() === 'portrait';
  },
};
