import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/services/brands/featureService';

// --- INCI Ingredient Search ---
import { searchInciIngredients } from '@/services/brands/featureService';

// --- Ingredients ---
export function useIngredients(experienceId?: string) {
  return useQuery({
    queryKey: ['ingredients', experienceId],
    queryFn: () => api.getIngredients(experienceId as string),
    enabled: typeof experienceId === 'string',
  });
}

export function useAddIngredient(experienceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.addIngredient(experienceId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredients', experienceId] })
  });
}

export function useUpdateIngredient(experienceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ingredientId, data }: { ingredientId: string; data: any }) =>
      api.updateIngredient(experienceId, ingredientId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredients', experienceId] })
  });
}

export function useDeleteIngredient(experienceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ingredientId: string) => api.deleteIngredient(experienceId, ingredientId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredients', experienceId] })
  });
}


// --- Tutorials ---

export function useTutorials() {
  return useQuery({
    queryKey: ['tutorials'],
    queryFn: () => api.getTutorials(),
  });
} 

export function useAddTutorial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.addTutorial(data),
    onSuccess: (_data, variables) => {
      // Invalidate tutorials for the experience if experience_id is present in data
      if (variables && variables.experience_id) {
        queryClient.invalidateQueries({ queryKey: ['tutorials', variables.experience_id] });
      }
    },
  });
}

export function useTutorial(tutorialId?: string) {
  return useQuery({
    queryKey: ['tutorial', tutorialId],
    queryFn: () => api.getTutorialById(tutorialId as string),
    enabled: typeof tutorialId === 'string',
  });
}

export function useUpdateTutorial(experienceId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tutorialId, data }: { tutorialId: string; data: any }) =>
      api.updateTutorial(tutorialId, data),
    onSuccess: (_data, _variables) => {
      if (experienceId) {
        queryClient.invalidateQueries({ queryKey: ['tutorials', experienceId] });
      }
    },
  });
}

export function useDeleteTutorial(experienceId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tutorialId: string) => api.deleteTutorial(tutorialId),
    onSuccess: (_data, _variables) => {
      // Always invalidate the main tutorials query
      queryClient.invalidateQueries({ queryKey: ['tutorials'] });
      if (experienceId) {
        queryClient.invalidateQueries({ queryKey: ['tutorials', experienceId] });
      }
    },
  });
}

export function useUnpublishTutorial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tutorialId: string) => api.unpublishTutorial(tutorialId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutorials'] });
    },
  });
}


// --- Link Tutorials to Experience ---
export function useLinkTutorialsToExperience() {
  return useMutation({
    mutationFn: ({ experienceId, tutorialIds }: { experienceId: string; tutorialIds: string[] }) =>
      api.linkTutorialsToExperience(experienceId, tutorialIds),
  });
}

// --- Get Tutorial IDs Linked to an Experience
export function useTutorialIdsLinkedToExperience(experienceId: string) {
  return useQuery({
    queryKey: ['tutorialIdsLinked', experienceId],
    queryFn: () => api.getTutorialIdsLinkedToExperience(experienceId),
    enabled: typeof experienceId === 'string',
  });
}

// --- Recent Tutorials ---
export function useRecentTutorials(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['recentTutorials'],
    queryFn: () => api.getRecentTutorials(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: options?.enabled !== false,
  });
}

// --- Digital Instructions ---
export function useInstructions(experienceId?: string) {
  return useQuery({
    queryKey: ['instructions', experienceId],
    queryFn: () => api.getInstructions(experienceId as string),
    enabled: typeof experienceId === 'string',
  });
}

export function useAddInstruction(experienceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.addInstruction(experienceId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['instructions', experienceId] })
  });
}


// --- Customer Support Links (brand scoped) ---
export function useCustomerSupportLinksByBrand() {
  return useQuery({
    queryKey: ['customerSupportLinks'],
    queryFn: () => api.getCustomerSupportLinksByBrand(),
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    //enabled: !!brandId,
  });
}

export function useAddCustomerSupportLinks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (links: any[]) => api.addCustomerSupportLinks( links),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customerSupportLinks'] })
  });
}


// --- Feedback Forms ---
export function useFeedbackForms(experienceId?: string) {
  return useQuery({
    queryKey: ['feedbackForms', experienceId],
    queryFn: () => api.getFeedbackForms(experienceId as string),
    enabled: typeof experienceId === 'number',
  });
}

export function useUpdateFeedbackForms(experienceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.updateFeedbackForms(experienceId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feedbackForms', experienceId] })
  });
}

// (Removed: useRecentTutorials, as recent tutorials endpoint is deprecated)

// --- INCI Ingredient Search ---
export function useInciIngredientSearch(searchTerm: string, limit: number = 10) {
  return useQuery({
    queryKey: ['inciIngredients', searchTerm, limit],
    queryFn: () => searchInciIngredients(searchTerm, limit),
    staleTime: 1000 * 60 * 600, // 10 hours
    refetchOnWindowFocus: false,
    enabled: !!searchTerm,
  });
}

// --- Brand Logo ---
export function useBrandLogo() {
  return useQuery({
    queryKey: ['brandLogo'],
    queryFn: () => api.getBrandLogo(),
    staleTime: 1000 * 60 * 600, // 10 hours
    refetchOnWindowFocus: false,
  });
}