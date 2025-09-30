import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchPublicExperience, invalidatePublicExperience } from '@/services/public/experienceService';

export function usePublicExperience(slug: string) {
	return useQuery({
		queryKey: ['publicExperience', slug],
		queryFn: () => fetchPublicExperience(slug),
		staleTime: 1000 * 60 * 500, // 500 minutes
		refetchOnWindowFocus: false,
	});
}
// Separate hook for cache invalidation
export function useInvalidatePublicExperience() {
  return useMutation({
    mutationFn: (slug: string) => invalidatePublicExperience(slug),
  });
}
