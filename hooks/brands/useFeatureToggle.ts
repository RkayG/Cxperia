import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useFeaturesByExperience,
  useEnableFeature,
  useDisableFeature,
} from "./useEnableDisableFeatures"; // adjust path as needed in your project

export type FeatureSettings = {
  tutorialsRoutines?: boolean;
  ingredientList?: boolean;
  skinRecommendations?: boolean;
  loyaltyPoints?: boolean;
  chatbot?: boolean;
  feedbackForm?: boolean;
  customerService?: boolean;
  productUsage?: boolean;
  [key: string]: any;
};

const DEFAULT_FEATURE_SETTINGS: FeatureSettings = {
  tutorialsRoutines: false,
  ingredientList: false,
  skinRecommendations: false,
  loyaltyPoints: false,
  chatbot: false,
  feedbackForm: false,
  customerService: false,
  productUsage: false,
};


export function useFeatureToggles(
  experienceId: string,
) {
  const { data: featuresApiData, refetch: refetchFeatures } = useFeaturesByExperience(experienceId || "");
  const enableFeatureMutation = useEnableFeature();
  const disableFeatureMutation = useDisableFeature(experienceId || "");

  const featuresFromApi = useMemo(() => {
    if (!featuresApiData || !(featuresApiData as any).data || !Array.isArray((featuresApiData as any).data)) return null;
    const parsed: any = {};
    for (const f of (featuresApiData as any).data) parsed[f.feature_name] = !!f.is_enabled;
    return parsed as FeatureSettings;
  }, [featuresApiData]);

  const [featureSettings, setFeatureSettings] = useState<FeatureSettings>(() => ({ ...DEFAULT_FEATURE_SETTINGS }));

  useEffect(() => {
    if (featuresFromApi) setFeatureSettings(prev => ({ ...prev, ...featuresFromApi }));
  }, [featuresFromApi]);

  const enableFeatureAsync = useCallback(async (featureName: string) => {
    console.log('enableFeatureAsync called with:', { featureName, experienceId });
    console.log('enableFeatureMutation:', enableFeatureMutation);
    
    if (!experienceId) {
      console.log('No experienceId, returning early');
      return;
    }
    
    if (!enableFeatureMutation) {
      console.error('enableFeatureMutation is not available');
      throw new Error('Enable feature mutation not available');
    }
    
    try {
      console.log('Calling enableFeatureMutation.mutateAsync with:', { experienceId, featureName });
      await enableFeatureMutation.mutateAsync({ experienceId, featureName });
      console.log('Enable feature mutation completed successfully');
    } catch (err) {
      // keep error handling lightweight here; callers can handle UI notifications
      // eslint-disable-next-line no-console
      console.error("enableFeatureAsync error", err);
      throw err;
    }
  }, [experienceId, enableFeatureMutation]);

  const disableFeatureAsync = useCallback(async (idOrName: string) => {
    try {
      if (experienceId) {
        // Find the existing feature by name first
        const found = (featuresApiData as any)?.data?.find?.((f: any) => f.feature_name === idOrName && f.is_enabled);
        if (found) {
          console.log('Found existing feature to disable:', found.id);
          await disableFeatureMutation.mutateAsync(found.id);
        } else {
          console.log('No existing feature found to disable for:', idOrName);
          // Feature doesn't exist, nothing to disable
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("disableFeatureAsync error", err);
      throw err;
    }
  }, [disableFeatureMutation, experienceId, featuresApiData]);

  const onToggleCore = useCallback(async (featureId: string, enabled: boolean) => {
    console.log('onToggleCore called with:', { featureId, enabled, experienceId });
    
    // keep local state consistent
    setFeatureSettings(prev => ({ ...prev, [featureId]: enabled }));

    if (enabled) {
      console.log('Enabling feature via API:', featureId);
      try {
        await enableFeatureAsync(featureId);
        console.log('Feature enabled successfully:', featureId);
      } catch (error) {
        console.error('Failed to enable feature:', featureId, error);
        throw error;
      }
      return;
    }

    // disabling: use the feature name directly
    console.log('Disabling feature via API:', featureId);
    try {
      await disableFeatureAsync(featureId);
      console.log('Feature disabled successfully:', featureId);
    } catch (error) {
      console.error('Failed to disable feature:', featureId, error);
      throw error;
    }
  }, [enableFeatureAsync, disableFeatureAsync, featuresApiData]);

  return {
    featureSettings,
    setFeatureSettings,
    onToggleCore,
    featuresApiData,
    refetchFeatures,
    enableFeatureAsync,
    disableFeatureAsync,
  } as const;
}
