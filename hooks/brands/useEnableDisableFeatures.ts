// DEBUG: Hook loaded
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/services/brands/enableDisableFeatureService';

// Enable a feature for an experience
export function useEnableFeature() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ experienceId, featureName }: { experienceId: string; featureName: string }) => {
			return api.enableFeature(experienceId, featureName);
		},
		onSuccess: (_data, variables) => {
			if (variables && variables.experienceId) {
				queryClient.invalidateQueries({ queryKey: ['features', variables.experienceId] });
			}
		},
	});
}

// Disable a feature by featureId
export function useDisableFeature(experienceId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (featureId: string) => api.disableFeature(experienceId, featureId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['features', experienceId] });
		},
	});
}

// Update a feature
export function useUpdateFeature(experienceId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ featureId, data }: { featureId: string; data: any }) =>
			api.updateFeature(experienceId, featureId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['features', experienceId] });
		},
	});
}

// Get all features for an experience
export function useFeaturesByExperience(experienceId: string) {
	return useQuery({
		queryKey: ['features', experienceId],
		queryFn: () => api.getFeaturesByExperience(experienceId),
		enabled: !!experienceId,
	});
}
