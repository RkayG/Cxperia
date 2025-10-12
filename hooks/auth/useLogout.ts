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
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to logout');
        }

        const data = await response.json();
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
      
      // Clear any client-side state if needed
      // You can add more cleanup here if you have global state
      
      // Simple redirect to login page
      router.push('/auth/login');
    },
    onError: (error) => {
      showToast.error(error instanceof Error ? error.message : 'Échec de la déconnexion');
    },
  });
}
