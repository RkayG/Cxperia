import { useQuery } from '@tanstack/react-query';
import { fetchPublicExperience } from '../services/experienceService';

export function usePublicExperience(slug: string) {
	return useQuery({
		queryKey: ['publicExperience', slug],
		queryFn: () => fetchPublicExperience(slug),
		staleTime: 1000 * 60 * 500, // 500 minutes
		refetchOnWindowFocus: false,
	});
}
