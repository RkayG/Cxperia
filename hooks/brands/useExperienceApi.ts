import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../../../Cyxperia/CxperiaPlatform/src/services/experienceService';

export function useExperiences(brand_id?: string | undefined) {
  return useQuery({
    queryKey: brand_id ? ['experiences', brand_id] : ['experiences'],
    queryFn: () => api.getExperiences(brand_id),
  });
}

// Recent experiences (last 30 days) - uses client-side filter in the service
export function useRecentExperiences(brand_id?: string | undefined) {
  return useQuery({
    queryKey: brand_id ? ['recentExperiences', brand_id] : ['recentExperiences'],
    queryFn: () => api.getRecentExperiences(brand_id),
    enabled: true,
  });
}

// Get experience by ID
export function useExperience(id: string | undefined) {
  return useQuery({
    queryKey: ['experience', id],
    queryFn: () => api.getExperienceById(id),
    enabled: !!id,
    
  });
}

// Create Experience
export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.createExperience(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['experiences'] })
  });
}
// Update Experience
export function useUpdateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | undefined; data: any }) => api.updateExperience(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['experience', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
    }
  });
}
// Get Experience URL by ID
export function useExperienceUrl(id: string | undefined) {
  return useQuery({
    queryKey: ['experienceUrl', id],
    queryFn: () => api.getExperienceUrl(id),
    enabled: !!id,
  });
}

// Delete Experience
export function useDeleteExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | undefined) => api.deleteExperience(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['experiences'] })
  });
}
// Set publish status
export function useSetPublishStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_published }: { id: string | undefined; is_published: boolean }) => api.setPublishStatus(id, is_published),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['experience', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
    }
  });
}
