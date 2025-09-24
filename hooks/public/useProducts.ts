import { useQuery } from '@tanstack/react-query';
import { fetchExperienceProducts } from '../services/productService';

export function useExperienceProducts(slug: string) {
	return useQuery({
		queryKey: ['experienceProducts', slug],
		queryFn: () => fetchExperienceProducts(slug),
		staleTime: 1000 * 60 * 60, // 1 hour
		refetchOnWindowFocus: false,
	});
}
