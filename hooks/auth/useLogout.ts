import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { showToast } from '@/lib/toast';
import { redirectToSubdomain } from '@/lib/utils/subdomain';

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
        console.warn('API logout failed, falling back to client-side logout:', apiError);
        
        // Fallback to client-side logout
        const { error } = await supabase.auth.signOut();
        if (error) {
          throw new Error(error.message);
        }
        
        return { message: 'Logged out successfully', success: true };
      }
    },
    onSuccess: (data) => {
      console.log('Logout successful:', data);
      showToast.success('Logged out successfully');
      
      // Clear any client-side state if needed
      // You can add more cleanup here if you have global state
      
      // Redirect to login page on main domain
      if (window.location.hostname.includes('app.')) {
        redirectToSubdomain('/auth/login');
      } else {
        router.push('/auth/login');
      }
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      showToast.error(error instanceof Error ? error.message : 'Failed to logout');
    },
  });
}
