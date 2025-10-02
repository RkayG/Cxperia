import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Feedback service with real API calls
const feedbackService = {
  async getFeedbacks(brandId?: string) {
    const url = brandId ? `/api/feedbacks?brand_id=${brandId}` : '/api/feedbacks';
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch feedbacks');
    }
    
    return await response.json();
  },
};

export function useFeedbacks(brandId?: string) {
  return useQuery({
    queryKey: ['feedbacks', brandId],
    queryFn: () => feedbackService.getFeedbacks(brandId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}



