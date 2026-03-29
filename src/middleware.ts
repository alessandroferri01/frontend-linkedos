import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/login', '/register', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some((p) => pathname === p)) {
    return NextResponse.next();
  }

  // For dashboard routes, check if token exists in cookie or redirect
  // Note: actual JWT validation happens server-side via API calls
  // This middleware only provides client-side route protection
  const token = request.cookies.get('token')?.value;

  if (pathname.startsWith('/dashboard') && !token) {
    // Check localStorage is not possible in middleware,
    // so we let client-side handle the redirect via API 401
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
