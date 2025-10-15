import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (mounted) {
            setAuthState({ user: null, loading: false, error: error.message });
          }
          return;
        }

        if (mounted) {
          setAuthState({
            user: session?.user || null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Initial session error:', error);
        if (mounted) {
          setAuthState({ user: null, loading: false, error: 'Failed to get session' });
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;

        if (event === 'SIGNED_OUT' || !session) {
          setAuthState({ user: null, loading: false, error: null });
          // Clear any cached data
          localStorage.clear();
          sessionStorage.clear();
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setAuthState({ user: session.user, loading: false, error: null });
        } else if (event === 'SIGNED_IN') {
          setAuthState({ user: session.user, loading: false, error: null });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      // Call the logout API to clear server-side session
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Logout API failed');
      }

      // Clear client-side session
      await supabase.auth.signOut();
      
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Force redirect to login
      window.location.href = '/auth/login';
      
    } catch (error) {
      console.error('Logout error:', error);
      setAuthState(prev => ({ ...prev, error: 'Logout failed', loading: false }));
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error);
        throw error;
      }
      
      return session;
    } catch (error) {
      console.error('Failed to refresh session:', error);
      // If refresh fails, sign out the user
      await signOut();
      throw error;
    }
  };

  return {
    ...authState,
    signOut,
    refreshSession,
    isAuthenticated: !!authState.user,
  };
}
