import { useMutation } from '@tanstack/react-query';

// Hook to increment tutorial view count
export function useIncrementTutorialView() {
  return useMutation({
    mutationFn: async (tutorialId: string) => {
      const response = await fetch(`/api/public/tutorials/${tutorialId}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to increment view count');
      }

      return await response.json();
    },
    // Don't show error toasts for view tracking failures
    onError: (error) => {
      console.warn('Failed to increment view count:', error);
    },
  });
}

// Hook to get tutorial view count (optional)
export function useTutorialViewCount(tutorialId: string) {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/public/tutorials/${tutorialId}/view`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get view count');
      }

      return await response.json();
    },
  });
}
