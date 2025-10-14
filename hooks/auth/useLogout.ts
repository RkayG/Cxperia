import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { showToast } from '@/lib/toast';
// Removed subdomain import - no longer needed

interface LogoutResponse {
  message: string;
  success: boolean;
}

export function useLogout() {
  const router = useRouter();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (): Promise<LogoutResponse> => {
      // First, try to logout via API (server-side logout)
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json() as { error?: string };
          throw new Error(errorData.error || 'Failed to logout');
        }

        const data = await response.json() as LogoutResponse;
        return data;
      } catch (apiError) {
        
        // Fallback to client-side logout
        const { error } = await supabase.auth.signOut();
        if (error) {
          throw new Error(error.message);
        }
        
        return { message: 'Déconnexion réussie', success: true };
      }
    },
    onSuccess: (data) => {
      showToast.success('Déconnexion réussie');
      
      // Clear all client-side storage
      try {
        // Clear localStorage
        localStorage.clear();
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Clear any brand-specific data
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('brand-') || key.includes('experience-') || key.includes('user-'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Clear cookies (client-side)
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
      } catch (error) {
        console.warn('Error clearing client-side storage:', error);
      }
      
      // Force a hard redirect to ensure all state is cleared
      window.location.href = '/auth/login';
    },
    onError: (error) => {
      showToast.error(error instanceof Error ? error.message : 'Échec de la déconnexion');
    },
  });
}
