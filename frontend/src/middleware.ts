/**
 * Next.js Middleware - Authentication & Authorization
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    // Check for admin token in cookies or headers
    const token = request.cookies.get('admin_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    // For now, allow access but log it
    // TODO: Implement proper authentication
    if (!token) {
      // Redirect to login or show unauthorized
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    // TODO: Verify token is valid and user has admin role
    // For now, just allow access
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};

