import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { securityMiddleware, addSecurityHeaders, logSecurityEvent } from '@/lib/security';

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const allowPanelDev = process.env.NEXT_PUBLIC_ALLOW_PANEL_DEV === 'true';
    const jwt = req.cookies.get('spectra_token')?.value;

    // Favicon redirect to actual asset under public/favicons
    if (pathname === '/favicon.ico') {
      return NextResponse.rewrite(new URL('/favicons/favicon.ico', req.url));
    }

    // Apply security middleware for API routes
    if (pathname.startsWith('/api/')) {
      const securityResponse = securityMiddleware(req);
      if (securityResponse) {
        return securityResponse;
      }
    }

    // Security headers for all responses
    const response = NextResponse.next();
    
    // Add comprehensive security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    // Add HSTS header for HTTPS
    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    // Log security events
    if (pathname.startsWith('/api/')) {
      logSecurityEvent('api_access', {
        ip: req.ip || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        endpoint: pathname,
        severity: 'low',
        message: 'API endpoint accessed'
      });
    }

    // In dev, optionally allow panel without NextAuth (temporary)
    if (allowPanelDev && pathname.startsWith('/panel')) {
      return NextResponse.next();
    }

    // Check if user is authenticated (NextAuth or local JWT cookie)
    if (!token && !jwt) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Check role-based access for specific routes
    if (pathname.startsWith('/panel/system') && token && !token.roles?.includes('SUPER_ADMIN')) {
      return NextResponse.redirect(new URL('/panel', req.url));
    }

    if (pathname.startsWith('/panel/users') && token && !token.roles?.includes('ADMIN') && !token.roles?.includes('SUPER_ADMIN')) {
      return NextResponse.redirect(new URL('/panel', req.url));
    }

    if (pathname.startsWith('/panel/analytics') && token && !token.roles?.includes('ADMIN') && !token.roles?.includes('SUPER_ADMIN')) {
      return NextResponse.redirect(new URL('/panel', req.url));
    }

    if (pathname.startsWith('/panel/reports') && token && !token.roles?.includes('ADMIN') && !token.roles?.includes('SUPER_ADMIN')) {
      return NextResponse.redirect(new URL('/panel', req.url));
    }

    // Unify legacy /dashboard (non-saas) to /panel; allow /saas/dashboard to stand
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/panel', req.url));
    }

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        const jwt = req.cookies.get?.('spectra_token')?.value;
        
        // Public routes that don't require authentication
        const publicRoutes = [
          '/',
          '/pricing', 
          '/contact', 
          '/privacy', 
          '/terms', 
          '/login',
          '/pricing/success',
          '/saas',
          '/builder',
          '/api/auth',
          '/api/catalog',
          '/api/cart',
          '/api/checkout'
        ];

        // Allow public routes
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }

        // Require authentication for protected routes
        if (pathname.startsWith('/panel') ||
            pathname.startsWith('/dashboard') ||
            pathname.startsWith('/saas') ||
            pathname.startsWith('/admin')) {
          return !!token || !!jwt;
        }

        // Allow API routes that don't require auth
        if (pathname.startsWith('/api/')) {
          return true;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/panel/:path*',
    '/dashboard/:path*',
    '/saas/:path*',
    '/saas/cameras/:path*',
    '/saas/users/:path*',
    '/admin/:path*',
    '/api/protected/:path*'
  ]
};