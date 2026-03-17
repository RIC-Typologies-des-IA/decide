/**
 * Authentication middleware for Next.js
 * Protects routes by validating JWT tokens
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedPaths = ['/dashboard', '/api/protected'];
  const authPaths = ['/auth/login', '/auth/register'];

  // Check if the path is protected
  const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthRoute = authPaths.some(path => pathname.startsWith(path));

  // Get token from cookie
  const token = request.cookies.get('token')?.value;

  // Verify token
  const session = token ? await verifyToken(token) : null;

  // Protected routes - redirect to login if not authenticated
  if (isProtectedRoute && !session) {
    // For API routes, return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // For page routes, redirect to login with callback
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Auth routes - redirect to dashboard if already authenticated
  if (isAuthRoute && session) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};
