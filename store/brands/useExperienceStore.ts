import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Experience, FeatureSettings } from '@/types/productExperience';
import type { Brand } from '@/types/brand';


interface ExperienceState {
  brand: Brand | null;
  setBrand: (brand: Brand | null) => void;
  // Unified Experience Data
  experienceData: Experience;
  setExperienceData: (data: Partial<Experience>, slug?: string) => void;
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

  // Experience URL
  experienceUrl: string | null;
  setExperienceUrl: (url: string | null) => void;
  fetchExperienceUrl: (experienceId: string) => Promise<void>;

  // Status
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Reset everything
  resetAll: () => void;
}
// Utility to store/fetch experience data by slug in localStorage
function setExperienceDataBySlug(slug: string, data: Experience) {
  if (typeof window !== 'undefined' && slug) {
    localStorage.setItem(`experience:${slug}`, JSON.stringify(data));
  }
}

export function getExperienceDataBySlug(slug: string): Experience | null {
  if (typeof window !== 'undefined' && slug) {
    const raw = localStorage.getItem(`experience:${slug}`);
    if (raw) {
      try {
        return JSON.parse(raw) as Experience;
      } catch {}
    }
  }
  return null;
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


import { experienceService } from '@/services/brands/experienceService';

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
      experienceUrl: null,

      // Actions
      setExperienceData: (data, slug) => {
        set((state) => {
          const merged = { ...state.experienceData, ...data };
          // Store in localStorage by slug if provided
          if (slug) setExperienceDataBySlug(slug, merged);
          return { experienceData: merged };
        });
      },

      clearExperienceData: () => set({ experienceData: initialExperienceData }),

      setIds: (experienceId, productId) => set({ experienceId, productId }),

      clearIds: () => set({ experienceId: null, productId: null }),

      setExperienceUrl: (url) => set({ experienceUrl: url }),

      fetchExperienceUrl: async (experienceId) => {
        set({ isLoading: true });
        try {
          const res = await experienceService.getExperienceUrl(experienceId);
          if (res && res.experience_url) {
            set({ experienceUrl: res.experience_url });
          } else {
            set({ experienceUrl: null });
          }
        } catch (e) {
          set({ experienceUrl: null });
        } finally {
          set({ isLoading: false });
        }
      },

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
        experienceUrl: null,
      }),
    }),
    {
      name: 'experience-storage',
      // Save all state to local storage
      partialize: (state) => ({ ...state }),
    }
  )
);