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

function callMutateAsync(mutation: any, variables: any) {
  if (!mutation) return Promise.resolve();
  if (typeof mutation.mutateAsync === "function") return mutation.mutateAsync(variables);
  return new Promise((resolve, reject) => {
    mutation.mutate(variables, {
      onSuccess: (data: any) => resolve(data),
      onError: (err: any) => reject(err),
    });
  });
}

export function useFeatureToggles(
  experienceId: string,
) {
  const { data: featuresApiData, refetch: refetchFeatures } = useFeaturesByExperience(experienceId || "");
  const enableFeatureMutation = useEnableFeature();
  const disableFeatureMutation = useDisableFeature(experienceId || "");

  const featuresFromApi = useMemo(() => {
    if (!featuresApiData || !Array.isArray(featuresApiData.data)) return null;
    const parsed: any = {};
    for (const f of featuresApiData.data) parsed[f.feature_name] = !!f.is_enabled;
    return parsed as FeatureSettings;
  }, [featuresApiData]);

  const [featureSettings, setFeatureSettings] = useState<FeatureSettings>(() => ({ ...DEFAULT_FEATURE_SETTINGS }));

  useEffect(() => {
    if (featuresFromApi) setFeatureSettings(prev => ({ ...prev, ...featuresFromApi }));
  }, [featuresFromApi]);

  const enableFeatureAsync = useCallback(async (featureName: string) => {
    if (!experienceId) return;
    try {
      await callMutateAsync(enableFeatureMutation, { experienceId, featureName });
      refetchFeatures?.();
    } catch (err) {
      // keep error handling lightweight here; callers can handle UI notifications
      // eslint-disable-next-line no-console
      console.error("enableFeatureAsync error", err);
      throw err;
    }
  }, [experienceId, enableFeatureMutation, refetchFeatures]);

  const disableFeatureAsync = useCallback(async (idOrName: number | string) => {
    try {
      if (typeof idOrName === "number") {
        await callMutateAsync(disableFeatureMutation, idOrName);
      } else if (experienceId) {
        // optimistic path: enable to get an id, then disable
        const res: any = await callMutateAsync(enableFeatureMutation, { experienceId, featureName: idOrName });
        const id = res?.data?.id;
        if (id) await callMutateAsync(disableFeatureMutation, id);
      }
      refetchFeatures?.();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("disableFeatureAsync error", err);
      throw err;
    }
  }, [disableFeatureMutation, enableFeatureMutation, experienceId, refetchFeatures]);

  const onToggleCore = useCallback(async (featureId: string, enabled: boolean) => {
    // keep local state consistent
    setFeatureSettings(prev => ({ ...prev, [featureId]: enabled }));

    if (enabled) {
      await enableFeatureAsync(featureId);
      return;
    }

    // disabling: find backend-enabled feature id if present
    const found = featuresApiData?.data?.find?.((f: any) => f.feature_name === featureId && f.is_enabled);
    if (found) await disableFeatureAsync(found.id);
    else await disableFeatureAsync(featureId);
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
