// middleware.ts - Improved version
import { type NextRequest, NextResponse } from 'next/server';
import { rootDomain } from '@/lib/utils';

function extractSubdomain(request: NextRequest): string | null {
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];
  if (!hostname) return null;

  // Local development
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    if (hostname.includes('.localhost')) {
      return hostname.split('.')[0] || null;
    }
    return null;
  }

  // Production - extract subdomain from your actual domain
  const rootDomainFormatted = rootDomain.replace('https://', '').replace('http://', '');
  if (hostname.endsWith(rootDomainFormatted) && hostname !== rootDomainFormatted) {
    const sub = hostname.replace(`.${rootDomainFormatted}`, '');
    return sub || null;
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  // Define routes that need locale prefixes
  const routesNeedingLocale = ['/dashboard', '/auth', '/products', '/docs', '/experience'];
  
  // Check if the pathname starts with any route that needs a locale
  const needsLocale = routesNeedingLocale.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Handle routes that need locale prefixes
  if (needsLocale) {
    const url = request.nextUrl.clone();
    
    // If we're on a subdomain, preserve the subdomain in the redirect
    if (subdomain) {
      // For localhost, reconstruct the subdomain properly
      if (url.hostname.includes('localhost')) {
        url.hostname = `${subdomain}.localhost`;
      } else {
        // For production domains
        const rootDomainFormatted = rootDomain.replace('https://', '').replace('http://', '');
        url.hostname = `${subdomain}.${rootDomainFormatted}`;
      }
    }
    
    url.pathname = `/en${pathname}`;
    return NextResponse.redirect(url);
  }

  // Handle root path redirect to default locale
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    
    // If we're on a subdomain, preserve the subdomain in the redirect
    if (subdomain) {
      // For localhost, reconstruct the subdomain properly
      if (url.hostname.includes('localhost')) {
        url.hostname = `${subdomain}.localhost`;
      } else {
        // For production domains
        const rootDomainFormatted = rootDomain.replace('https://', '').replace('http://', '');
        url.hostname = `${subdomain}.${rootDomainFormatted}`;
      }
    }
    
    url.pathname = '/en';
    return NextResponse.redirect(url);
  }

  // If subdomain detected, route to app space
  if (subdomain) {
    const url = request.nextUrl.clone();
    
    // Block admin access from subdomains
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // For app subdomain, rewrite to / structure
    url.pathname = `/${pathname}`;
    
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - _next (Next.js internals)
    // - _static (inside /public)
    // - all root files inside /public (e.g. /favicon.ico)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|en|fr).*)',
  ],
};