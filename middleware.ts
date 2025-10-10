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

  // If subdomain detected, route to tenant space
  if (subdomain) {
    const url = request.nextUrl.clone();
    
    // Block admin access from subdomains
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // For all subdomains, rewrite to /s/[subdomain] structure
    url.pathname = `/s/${subdomain}${pathname}`;
    
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};