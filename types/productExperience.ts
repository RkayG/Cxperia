// Unified Experience type for single-object experience data (for migration)
export interface Experience {
  experienceId: string;
  name: string;
  tagline?: string;
  description?: string;
  category?: string;
  storeLink?: string;
  product_image_url?: UploadedImage[];
  logo_url?: string;
  netContent?: number | null;
  originalPrice?: number | null;
  discountedPrice?: number | null;
  estimatedDurationDays?: number;
  skinType?: string;
  features: FeatureSettings;
  // Add any additional fields as needed for the unified experience
  [key: string]: any;
}

// For Experience Overview (Step Two)
export interface ExperienceOverviewData {
  experienceName: string;
  shortTagline?: string ;
  category?: string;
  storeLink?: string;
  logoFile?: File | string;
  features: FeatureSettings;
}

export interface ExperienceOverviewProps {
  data: ExperienceOverviewData;
  onUpdate: (data: Partial<ExperienceOverviewData>) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export interface FeatureToggleProps {
  feature: Feature;
  isEnabled: boolean;
  onToggle: (featureId: keyof FeatureSettings, enabled: boolean) => void;
}
export interface FeatureSettings {
  tutorialsRoutines: boolean;
  ingredientList: boolean;
  loyaltyPoints: boolean;
  skinRecommendations: boolean;
  chatbot: boolean;
  feedbackForm: boolean;
  customerService: boolean;
  productUsage: boolean;
}

export interface Feature {
  id: keyof FeatureSettings;
  title: string;
  description: string;
  icon: string;
  recommended?: boolean;
  required?: boolean;
  comingSoon?: boolean;
}
export interface UploadedImage {
  id: string;
  url?: string;
  file?: File;
  preview?: string;
  uploading?: boolean;
  uploadError?: string | null;
}

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

import type { ValidationErrors } from '@/utils/validation';
export interface ProductFormProps {
  data: Experience;
  onUpdate: (data: Partial<Experience>) => void;
  errors?: ValidationErrors;
}

export interface MediaUploadProps {
  images: UploadedImage[];
  onImagesUpdate: (images: UploadedImage[]) => void;
  errors?: ValidationErrors;
}

export interface UploadTipProps {
  icon: React.ReactNode;
  text: string;
  isActive?: boolean;
}

export interface ProductPayload {
  name: string;
  tagline?: string;
  category?: string;
  store_link?: string;
  product_image_url?: string[] | null;
  logo_url?: string | null;
  net_content?: string | null;
  estimated_usage_duration_days?: number;
}


/** ====================================
* PREVIEW TYPES
* =====================================
*/
export interface MobilePreviewProps {
  experienceId: string; // Experience ID required for preview embedding
}

export interface QrCodeGeneratorProps {
  onGenerateQrCode: () => void;
  qrCodeImageUrl?: string; // URL of the generated QR code
  isLoading?: boolean;
}

export interface DownloadOptionsProps {
  onDownload: (format: string) => void;
}

export interface PreviewPageProps {
  // These props would typically come from a parent component or state management
  mobilePreviewData: MobilePreviewProps;
  qrCodeImageUrl?: string; // Pass generated QR code URL down
  onGenerateQrCode: () => void;
  onDownloadQrCode: (format: string) => void;
  onFinish: () => void;
  isGeneratingQr: boolean;
}