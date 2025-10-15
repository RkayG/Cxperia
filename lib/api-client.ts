import { supabase } from '@/lib/supabase';

class ApiClient {
  private isRefreshing = false;
  private refreshPromise: Promise<any> | null = null;

  async request(url: string, options: RequestInit = {}): Promise<Response> {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }

    // Check if token is about to expire (within 5 minutes)
    const tokenExpiry = session.expires_at ? new Date(session.expires_at * 1000) : null;
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    // If token is about to expire, refresh it
    if (tokenExpiry && tokenExpiry <= fiveMinutesFromNow) {
      await this.refreshTokenIfNeeded();
    }

    // Add authorization header
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${session.access_token}`,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If we get a 401, try to refresh the token once
    if (response.status === 401) {
      try {
        await this.refreshTokenIfNeeded();
        
        // Retry the request with new token
        const { data: { session: newSession } } = await supabase.auth.getSession();
        if (newSession) {
          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              ...headers,
              'Authorization': `Bearer ${newSession.access_token}`,
            },
          });
          return retryResponse;
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Redirect to login if refresh fails
        window.location.href = '/auth/login';
        throw refreshError;
      }
    }

    return response;
  }

  private async refreshTokenIfNeeded(): Promise<void> {
    // Prevent multiple simultaneous refresh attempts
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();

    try {
      await this.refreshPromise;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<void> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error);
        throw error;
      }

      console.log('Session refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh session:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Helper function for making authenticated requests
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  return apiClient.request(url, options);
}
