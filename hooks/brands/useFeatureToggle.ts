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
 
    
    if (!experienceId) {
      return;
    }
    
    if (!enableFeatureMutation) {
      throw new Error('Enable feature mutation not available');
    }
    
    try {
      await enableFeatureMutation.mutateAsync({ experienceId, featureName });
    } catch (err) {
      // keep error handling lightweight here; callers can handle UI notifications
      // eslint-disable-next-line no-console
      throw err;
    }
  }, [experienceId, enableFeatureMutation]);

  const disableFeatureAsync = useCallback(async (idOrName: string) => {
    try {
      if (experienceId) {
        // Find the existing feature by name first
        const found = (featuresApiData as any)?.data?.find?.((f: any) => f.feature_name === idOrName && f.is_enabled);
        if (found) {
          await disableFeatureMutation.mutateAsync(found.id);
        } else {
          // Feature doesn't exist, nothing to disable
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      throw err;
    }
  }, [disableFeatureMutation, experienceId, featuresApiData]);

  const onToggleCore = useCallback(async (featureId: string, enabled: boolean) => {
    
    // keep local state consistent
    setFeatureSettings(prev => ({ ...prev, [featureId]: enabled }));

    if (enabled) {
      try {
        await enableFeatureAsync(featureId);
      } catch (error) {
        throw error;
      }
      return;
    }

    // disabling: use the feature name directly
    try {
      await disableFeatureAsync(featureId);
    } catch (error) {
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
