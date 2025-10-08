import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { logAccess, extractRequestInfo, generateRequestId } from '@/lib/logging-edge';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const startTime = Date.now();
  const requestId = generateRequestId();
  
  // Extract request info for logging
  const requestInfo = extractRequestInfo(request);

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
    
    // Log the redirect
    const responseTime = Date.now() - startTime;
    logAccess({
      ...requestInfo,
      statusCode: 302,
      responseTime,
      requestId,
      userId: 'anonymous',
    });
    
    return redirectResponse;
  }

  // Protect admin routes - require authentication
  if (pathname.startsWith('/admin') && !user) {
    console.log('No user found for admin route, redirecting to main login');
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    
    // Important: Copy over the cookies from supabaseResponse
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    
    // Log the redirect
    const responseTime = Date.now() - startTime;
    logAccess({
      ...requestInfo,
      statusCode: 302,
      responseTime,
      requestId,
      userId: 'anonymous',
    });
    
    return redirectResponse;
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith('/auth') && user) {
    console.log('User found on auth page, checking role for redirect');
    
    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    let redirectUrl: URL;
    if (profile?.role === 'super_admin' || profile?.role === 'sales_admin') {
      console.log('Admin user found, redirecting to admin dashboard');
      redirectUrl = new URL('/admin', request.url);
    } else {
      console.log('Regular user found, redirecting to dashboard');
      redirectUrl = new URL('/dashboard', request.url);
    }
    
    const redirectResponse = NextResponse.redirect(redirectUrl);
    
    // Important: Copy over the cookies from supabaseResponse  
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    
    // Log the redirect
    const responseTime = Date.now() - startTime;
    logAccess({
      ...requestInfo,
      statusCode: 302,
      responseTime,
      requestId,
      userId: user.id,
    });
    
    return redirectResponse;
  }


  // Public experience pages are accessible to everyone
  if (pathname.startsWith('/exp/')) {
    // Log the request
    const responseTime = Date.now() - startTime;
    logAccess({
      ...requestInfo,
      statusCode: 200,
      responseTime,
      requestId,
    });
    return supabaseResponse;
  }

  // Log the request
  const responseTime = Date.now() - startTime;
  logAccess({
    ...requestInfo,
    statusCode: 200,
    responseTime,
    requestId,
  });

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