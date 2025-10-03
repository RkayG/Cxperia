import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { experienceService } from '@/services/brands/experienceService';

// Optimized query configurations
const QUERY_CONFIGS = {
  // Long-lived data (experiences, products) - cache for 10 minutes
  longLived: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  },
  // Short-lived data (recent items) - cache for 2 minutes
  shortLived: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  },
  // Real-time data (user-specific) - cache for 1 minute
  realTime: {
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000, // 3 minutes
    refetchOnWindowFocus: false,
  },
};

// Optimized experiences query
export function useOptimizedExperiences(brand_id?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: brand_id ? ['experiences', brand_id] : ['experiences'],
    queryFn: () => experienceService.getAll(brand_id),
    ...QUERY_CONFIGS.longLived,
    // Only refetch if data is older than staleTime
    refetchOnMount: false,
    enabled: options?.enabled !== false && !!brand_id,
  });
}

// Optimized recent experiences
export function useOptimizedRecentExperiences(brand_id?: string) {
  return useQuery({
    queryKey: brand_id ? ['recentExperiences', brand_id] : ['recentExperiences'],
    queryFn: () => experienceService.getRecent(),
    ...QUERY_CONFIGS.shortLived,
    enabled: !!brand_id,
  });
}

// Optimized single experience
export function useOptimizedExperience(id: string) {
  return useQuery({
    queryKey: ['experience', id],
    queryFn: () => experienceService.getById(id),
    ...QUERY_CONFIGS.longLived,
    enabled: !!id,
    // Don't refetch if we already have this data
    refetchOnMount: false,
  });
}

// Optimized mutations with selective invalidation
export function useOptimizedCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => experienceService.create(data),
    onSuccess: (newExperience) => {
      // Only invalidate the list, not individual items
      queryClient.invalidateQueries({ 
        queryKey: ['experiences'],
        exact: false // This will invalidate all experience-related queries
      });
      
      // Optimistically update the cache
      if (newExperience) {
        queryClient.setQueryData(['experience', newExperience.id], newExperience);
      }
    },
    // Don't retry mutations
    retry: false,
  });
}

export function useOptimizedUpdateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => experienceService.update(id, data),
    onSuccess: (updatedExperience, variables) => {
      // Update the specific experience in cache
      queryClient.setQueryData(['experience', variables.id], updatedExperience);
      
      // Only invalidate the list if it's a significant change
      queryClient.invalidateQueries({ 
        queryKey: ['experiences'],
        exact: false
      });
    },
    retry: false,
  });
}

export function useOptimizedDeleteExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => experienceService.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache immediately
      queryClient.removeQueries({ queryKey: ['experience', deletedId] });
      
      // Invalidate lists
      queryClient.invalidateQueries({ 
        queryKey: ['experiences'],
        exact: false
      });
    },
    retry: false,
  });
}

// Utility function to prefetch data
export function usePrefetchExperiences() {
  const queryClient = useQueryClient();
  
  return (brand_id?: string) => {
    queryClient.prefetchQuery({
      queryKey: brand_id ? ['experiences', brand_id] : ['experiences'],
      queryFn: () => experienceService.getAll(brand_id),
      ...QUERY_CONFIGS.longLived,
    });
  };
}

// Utility function to clear unused cache
export function useClearUnusedCache() {
  const queryClient = useQueryClient();
  
  return () => {
    // Clear queries that haven't been used recently
    queryClient.removeQueries({
      predicate: (query) => {
        const lastUsed = query.state.dataUpdatedAt;
        const now = Date.now();
        const timeSinceLastUsed = now - lastUsed;
        
        // Remove queries unused for more than 30 minutes
        return timeSinceLastUsed > 30 * 60 * 1000;
      },
    });
  };
}
