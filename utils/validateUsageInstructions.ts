export interface UsageInstructionsErrors {
  productName?: string;
  productType?: string;
  howToUse?: string;
  applicationSteps?: string;
  tips?: string;
  warnings?: string;
  frequency?: string;
  skinType?: string;
  duration?: string;
}

export function validateUsageInstructions(data: any): UsageInstructionsErrors {
  const errors: UsageInstructionsErrors = {};
  if (!data.howToUse || !data.howToUse.trim()) errors.howToUse = 'General usage instructions are required.';
  if (!data.applicationSteps || !Array.isArray(data.applicationSteps) || data.applicationSteps.length === 0 || data.applicationSteps.some((s: any) => !s.step.trim() || !s.description.trim())) {
    errors.applicationSteps = 'All application steps must have a title and description.';
  }
 /*  if (!data.tips || !Array.isArray(data.tips) || data.tips.some((t: string) => !t.trim())) {
    errors.tips = 'All tips must be filled in.';
  }
  if (!data.warnings || !Array.isArray(data.warnings) || data.warnings.some((w: string) => !w.trim())) {
    errors.warnings = 'All warnings must be filled in.';
  } */
  if (!data.frequency || !data.frequency.trim()) errors.frequency = 'Usage frequency is required.';
  /* if (!data.skinType || !Array.isArray(data.skinType) || data.skinType.length === 0) errors.skinType = 'At least one skin type must be selected.'; */
/*   if (!data.duration || !data.duration.trim()) errors.duration = 'Application duration is required.'; */
  return errors;
}
