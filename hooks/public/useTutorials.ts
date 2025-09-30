import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchExperienceTutorials, invalidateExperienceTutorials } from '@/services/public/tutorialService';

export function useExperienceTutorials(slug: string) {
	return useQuery({
		queryKey: ['experienceTutorials', slug],
		queryFn: () => fetchExperienceTutorials(slug),
		staleTime: 1000 * 60 * 60, // 1 hour
		refetchOnWindowFocus: false,
	});
}

export function useInvalidateExperienceTutorials() {
  return useMutation({
    mutationFn: (slug: string) => invalidateExperienceTutorials(slug),
  });
}
