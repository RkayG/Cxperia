import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logInfo, logError, extractRequestInfo, generateRequestId } from '@/lib/logging';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = generateRequestId();
  const requestInfo = extractRequestInfo(request);
  
  try {
    //console.log('Logout request received');
    
    const supabase = await createClient();
    
    // Get current user before logout
    const { data: { user }, error: getUserError } = await supabase.auth.getUser();
    
    if (getUserError) {
      
      return NextResponse.json({ error: 'Failed to get user information' }, { status: 500 });
    }
    
    if (!user) {
      
      return NextResponse.json({ message: 'Already logged out' }, { status: 200 });
    }
    
    // Log the logout event
    logInfo('User logout initiated', {
      ...requestInfo,
      requestId,
      additionalData: {
        userId: user.id,
        userEmail: user.email,
      }
    });
    
    // Sign out the user - this should clear the session
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      //console.error('Error during logout:', signOutError);
      logError(signOutError, {
        ...requestInfo,
        requestId,
        statusCode: 500,
        additionalData: {
          userId: user.id,
          userEmail: user.email,
        }
      });
      
      return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
    }
    
   // console.log('User logged out successfully:', user.email);
    
    // Log successful logout
    logInfo('User logged out successfully', {
      ...requestInfo,
      requestId,
      additionalData: {
        userId: user.id,
        userEmail: user.email,
      }
    });
    
    // Create response with cleared cookies
    const response = NextResponse.json({ 
      message: 'Logged out successfully',
      success: true 
    });
    
    // Explicitly clear all Supabase auth cookies
    const authCookies = [
      'sb-access-token',
      'sb-refresh-token',
      'supabase-auth-token',
      'supabase.auth.token',
    ];
    
    authCookies.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    });
    
    // Also clear any cookies that might contain session data
    response.cookies.set('sb-localhost-auth-token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    return response;
    
  } catch (error) {
    logError(error as Error, {
      ...requestInfo,
      requestId,
      statusCode: 500,
    });
    
    return NextResponse.json(
      { error: 'Internal server error during logout' },
      { status: 500 }
    );
  } finally {
    const responseTime = Date.now() - startTime;
    logInfo('Logout request completed', {
      ...requestInfo,
      requestId,
      additionalData: {
        responseTime,
      }
    });
  }
}
