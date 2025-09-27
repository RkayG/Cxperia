import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // First, update the session
  const supabaseResponse = await updateSession(request);

  // Create a simple server client to check user session
  const { createServerClient } = await import('@supabase/ssr');
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll() {
          // We don't need to set cookies here since updateSession handles it
        },
      },
    }
  )

  // Get the user using getUser (more secure than getSession)
  const { data: { user } } = await supabase.auth.getUser()

  // Protect dashboard routes - require authentication
  if (pathname.startsWith('/dashboard') && !user) {
    console.log('No user found, redirecting to login');
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    
    // Important: Copy over the cookies from supabaseResponse
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith('/auth') && user) {
    console.log('User found, redirecting to dashboard');
    const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
    
    // Important: Copy over the cookies from supabaseResponse  
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  // Public experience pages are accessible to everyone
  if (pathname.startsWith('/exp/')) {
    return supabaseResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}