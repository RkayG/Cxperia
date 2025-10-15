import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      // Extend session duration
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Custom session duration (in seconds)
      // Note: This is a client-side setting, actual duration is controlled by Supabase project settings
      flowType: 'pkce', // Use PKCE flow for better security
    },
    global: {
      headers: {
        'X-Client-Info': 'cxperia-web',
      },
    },
  }
);

// Helper function to check if session is about to expire
export function isSessionExpiringSoon(session: any, minutesThreshold: number = 5): boolean {
  if (!session?.expires_at) return false;
  
  const expiryTime = new Date(session.expires_at * 1000);
  const now = new Date();
  const thresholdTime = new Date(now.getTime() + minutesThreshold * 60 * 1000);
  
  return expiryTime <= thresholdTime;
}

// Helper function to get session info
export async function getSessionInfo() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  
  if (!session) {
    return null;
  }
  
  const now = new Date();
  const expiresAt = new Date(session.expires_at * 1000);
  const timeUntilExpiry = expiresAt.getTime() - now.getTime();
  const minutesUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60));
  
  return {
    user: session.user,
    expiresAt,
    minutesUntilExpiry,
    isExpiringSoon: isSessionExpiringSoon(session),
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
  };
}
