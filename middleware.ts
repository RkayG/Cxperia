// middleware.ts - Simplified version for path-based routing
import { type NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create a Supabase client for middleware
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Get the user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect dashboard routes - require authentication
  if (pathname.startsWith('/dashboard') && !session) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith('/auth') && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Public experience pages are accessible to everyone
  if (pathname.startsWith('/exp/')) {
    // No authentication required for QR code pages
    return res;
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};