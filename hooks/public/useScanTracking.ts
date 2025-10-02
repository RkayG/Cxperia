import { useMutation } from '@tanstack/react-query';

// Hook to increment experience scan count
export function useIncrementScanCount() {
  return useMutation({
    mutationFn: async (slug: string) => {
      const response = await fetch(`/api/public/experience/${slug}/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to increment scan count');
      }

      return await response.json();
    },
    // Don't show error toasts for scan tracking failures
    onError: (error) => {
      console.warn('Failed to increment scan count:', error);
    },
  });
}

// Hook to get experience scan count (optional)
export function useScanCount(slug: string) {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/public/experience/${slug}/scan`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get scan count');
      }

      return await response.json();
    },
  });
}

// Utility function to check if scan should be counted for this session
export function shouldCountScan(slug: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const sessionKey = `scan_counted_${slug}`;
  const lastScanTime = sessionStorage.getItem(sessionKey);
  
  if (!lastScanTime) {
    // First scan in this session
    return true;
  }
  
  // Check if enough time has passed (e.g., 30 minutes)
  const lastScan = new Date(lastScanTime);
  const now = new Date();
  const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
  
  return (now.getTime() - lastScan.getTime()) > thirtyMinutes;
}

// Mark scan as counted for this session
export function markScanCounted(slug: string): void {
  if (typeof window === 'undefined') return;
  
  const sessionKey = `scan_counted_${slug}`;
  sessionStorage.setItem(sessionKey, new Date().toISOString());
}
