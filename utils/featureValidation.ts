// utils/featureValidation.ts
import type { FeatureSettings } from "@/types/productExperience";

export interface FeatureValidationResult {
  valid: boolean;
  errors: {
    missingRequired: string[]; // feature ids
    notEnoughSelected: boolean;
  };
}

const REQUIRED_FEATURES = [
  "productUsage",
  "ingredientList",
  "feedbackForm"
];

export function validateFeatures(features: FeatureSettings): FeatureValidationResult {
  const enabled = Object.entries(features).filter(([_, v]) => !!v).map(([k]) => k);
  const missingRequired = REQUIRED_FEATURES.filter(f => !features[f as keyof FeatureSettings]);
  const notEnoughSelected = enabled.length < 4;
  return {
    valid: missingRequired.length === 0 && !notEnoughSelected,
    errors: {
      missingRequired,
      notEnoughSelected
    }
  };
}
