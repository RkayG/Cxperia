import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { experienceService } from '@/services/brands/experienceService';

// Get all experiences for a brand
export function useExperiences(brand_id?: string) {
  return useQuery({
    queryKey: brand_id ? ['experiences', brand_id] : ['experiences'],
    queryFn: () => experienceService.getAll(brand_id),
  });
}

// Recent experiences (last 30 days)
export function useRecentExperiences(brand_id?: string) {
  return useQuery({
    queryKey: brand_id ? ['recentExperiences', brand_id] : ['recentExperiences'],
    queryFn: () => experienceService.getRecent(),
    enabled: true,
  });
}

// Get experience by ID
export function useExperience(id: string) {
  return useQuery({
    queryKey: ['experience', id],
    queryFn: () => experienceService.getById(id),
    enabled: !!id,
    
  });
}

// Create Experience
export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => experienceService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['experiences'] })
  });
}
// Update Experience
export function useUpdateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => experienceService.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['experience', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
    }
  });
}
// Get Experience URL by ID
export function useExperienceUrl(id: string) {
  return useQuery({
    queryKey: ['experienceUrl', id],
    queryFn: () => experienceService.getExperienceUrl(id),
    enabled: !!id,
  });
}

// Delete Experience
export function useDeleteExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => experienceService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['experiences'] })
  });
}
// Set publish status
export function useSetPublishStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_published }: { id: string; is_published: boolean }) => experienceService.setPublishStatus(id, is_published),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['experience', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
    }
  });
}
