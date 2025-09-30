// CosmeticProductModal.types.ts

// ApplicationStep is already good
export interface ApplicationStep {
  id: string;
  step: string;
  description: string;
}

// ProductUsageData is already good
export interface ProductUsageData {
  productName: string;
  productType: string;
  howToUse: string;
  applicationSteps: ApplicationStep[];
  tips: string[];
  warnings: string[];
  frequency: string;
  skinType: string[];
  duration: string;
}

// Combined FormData type
export type FormData = ProductUsageData & { usageTimeType?: string[] };

export interface CosmeticProductModalProps {
  experienceId: string;
  inline?: boolean;
  initialInstructions?: any;
  productName?: string;
  onClose?: () => void;
  onFeatureEnable?: () => void;
}

export type ActiveTab = "instructions" | "tips" | "warnings";