import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchExperienceProducts, invalidateExperienceProducts } from '@/services/public/productService';

export function useExperienceProducts(slug: string) {
	return useQuery({
		queryKey: ['experienceProducts', slug],
		queryFn: () => fetchExperienceProducts(slug),
		staleTime: 1000 * 60 * 60, // 1 hour
		refetchOnWindowFocus: false,
	});
}

// Separate hook for cache invalidation
export function useInvalidateExperienceProducts() {
  return useMutation({
    mutationFn: (slug: string) => invalidateExperienceProducts(slug),
  });
}
