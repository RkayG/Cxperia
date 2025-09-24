import { useQuery } from '@tanstack/react-query';
import { fetchExperienceTutorials } from '../services/tutorialService';

export function useExperienceTutorials(slug: string) {
	return useQuery({
		queryKey: ['experienceTutorials', slug],
		queryFn: () => fetchExperienceTutorials(slug),
		staleTime: 1000 * 60 * 60, // 1 hour
		refetchOnWindowFocus: false,
	});
}
