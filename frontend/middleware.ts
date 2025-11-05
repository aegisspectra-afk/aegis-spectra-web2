import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './src/lib/auth';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/about',
  '/services',
  '/products',
  '/product',
  '/blog',
  '/contact',
  '/privacy',
  '/terms',
  '/quote',
  '/checkout', // Allow checkout without auth (guest checkout)
  '/checkout/success',
  '/support', // Support page is public
  '/admin/login', // Admin login page
];

// Protected routes that require authentication
const protectedRoutes = [
  '/user',
  '/admin',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next();
  }

  // Allow static files and API routes (they handle their own auth)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || 
                  request.cookies.get('user_token')?.value ||
                  request.cookies.get('admin_token')?.value;

    if (!token) {
      // Redirect to appropriate login page
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded || !decoded.sessionId) {
      // Invalid token - clear cookies and redirect to login
      const response = pathname.startsWith('/admin') 
        ? NextResponse.redirect(new URL('/admin/login', request.url))
        : NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('user_token');
      response.cookies.delete('admin_token');
      return response;
    }

    // Note: Full session verification happens in API routes
    // Middleware just checks token validity for performance

    // Check role-based access for admin routes
    if (pathname.startsWith('/admin')) {
      const allowedRoles = ['super_admin', 'admin', 'manager'];
      if (!allowedRoles.includes(decoded.role)) {
        // Redirect to user dashboard or login
        return NextResponse.redirect(new URL('/account', request.url));
      }
    }

    // Add user info to request headers for use in API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId.toString());
    requestHeaders.set('x-user-email', decoded.email);
    requestHeaders.set('x-user-role', decoded.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Default: allow the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

