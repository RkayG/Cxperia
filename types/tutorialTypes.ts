export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  shade?: string;
  amount?: string;
}

export interface TutorialStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  duration: string;
  products: Product[];
  imageUrl?: string;
  videoUrl?: string;
  tips: string[];
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  totalDuration: string;
  skinTypes: string[];
  occasion: string[];
  tags: string[];
  steps: TutorialStep[];
  featuredImage?: string;
  videoUrl?: string;
  videoThumbnail?: string;
}

export interface TutorialCreatorProps {
  mode?: "edit" | "create";
}

export type ActiveTab = "overview" | "steps" | "products" | "preview";