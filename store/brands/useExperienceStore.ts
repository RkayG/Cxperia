import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Experience, FeatureSettings } from '@/types/productExperience';
import type { Brand } from '@/types/brand';


interface ExperienceState {
  brand: Brand | null;
  setBrand: (brand: Brand | null) => void;
  // Unified Experience Data
  experienceData: Experience;
  setExperienceData: (data: Partial<Experience>) => void;
  clearExperienceData: () => void;

  // Features by Experience ID
  featuresByExperienceId: { [id: string]: FeatureSettings };
  setFeaturesForExperience: (experienceId: string, features: FeatureSettings) => void;
  getFeaturesForExperience: (experienceId: string) => FeatureSettings | undefined;

  // IDs
  experienceId: string | null;
  productId: string | null;
  setIds: (experienceId: string | null, productId: string | null) => void;
  clearIds: () => void;

  // Status
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Reset everything
  resetAll: () => void;
}


export const initialExperienceData: Experience = {
  experienceId: '',
  name: '',
  category: '',
  tagline: '',
  skin_type: '',
  description: '',
  storeLink: '',
  originalPrice: null,
  discountedPrice: null,
  estimatedDurationDays: 30,
  images: [],
  netContent: 0,
  features: {
    tutorialsRoutines: false,
    ingredientList: false,
    loyaltyPoints: false,
    skinRecommendations: false,
    chatbot: false,
    feedbackForm: true,
    customerService: false,
    productUsage: false,
  },
};


export const useExperienceStore = create<ExperienceState>()(
  persist(
  (set, get) => ({
      // Initial state
  experienceData: initialExperienceData,
  brand: null,
  setBrand: (brand) => set({ brand }),
      experienceId: null,
      productId: null,
      isLoading: false,
      featuresByExperienceId: {},

      // Actions
      setExperienceData: (data) => 
        set((state) => ({ 
          experienceData: { ...state.experienceData, ...data } 
        })),

      clearExperienceData: () => set({ experienceData: initialExperienceData }),

      setIds: (experienceId, productId) => set({ experienceId, productId }),

      clearIds: () => set({ experienceId: null, productId: null }),

      setLoading: (loading) => set({ isLoading: loading }),

      setFeaturesForExperience: (_experienceId, features) => {
        // Always update the features field in the main experienceData object
        set((state) => ({
          experienceData: {
            ...state.experienceData,
            features: { ...features },
          },
        }));
      },

      getFeaturesForExperience: (_experienceId) => {
        // Always return the features field from the main experienceData object
        return get().experienceData.features;
      },

      resetAll: () => set({
        experienceData: initialExperienceData,
        experienceId: null,
        productId: null,
        isLoading: false,
        featuresByExperienceId: {},
      }),
    }),
    {
      name: 'experience-storage',
      // Save all state to local storage
      partialize: (state) => ({ ...state }),
    }
  )
);