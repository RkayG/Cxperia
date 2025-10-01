import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Experience, FeatureSettings } from '@/types/productExperience';
import type { Brand } from '@/types/brand';

interface ExperienceState {
  brand: Brand | null;
  setBrand: (brand: Brand | null) => void;
  // Unified Experience Data
  experienceData: Experience;
  setExperienceData: (data: Partial<Experience>, experienceId?: string) => void;
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

  // Fetch experience data from backend
  fetchExperienceData: (experienceId: string) => Promise<Experience | null>;
  
  // Get experience data by ID from localStorage
  getExperienceDataById: (experienceId: string) => Experience | null;
  
  // Reset everything
  resetAll: () => void;
}

// Utility to store/fetch experience data by ID in localStorage
function setExperienceDataById(experienceId: string, data: Experience) {
  if (typeof window !== 'undefined' && experienceId) {
    localStorage.setItem(`experience:${experienceId}`, JSON.stringify(data));
  }
}

export function getExperienceDataById(experienceId: string): Experience | null {
  if (typeof window !== 'undefined' && experienceId) {
    const raw = localStorage.getItem(`experience:${experienceId}`);
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
  skinType: '',
  description: '',
  storeLink: '',
  originalPrice: null,
  discountedPrice: null,
  estimatedDurationDays: 30,
  product_image_url: [],
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
      setExperienceData: (data, experienceId) => {
        set((state) => {
          const merged = { ...state.experienceData, ...data };
          // Store in localStorage by experienceId if provided
          if (experienceId) setExperienceDataById(experienceId, merged);
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

      // Get experience data by ID from localStorage
      getExperienceDataById: (experienceId: string): Experience | null => {
        return getExperienceDataById(experienceId);
      },

      // Fetch experience data from backend
      fetchExperienceData: async (experienceId: string): Promise<Experience | null> => {
        if (!experienceId) return null;
        
        set({ isLoading: true });
        try {
          const response = await experienceService.getById(experienceId);
          
          if (response?.data) {
            const experience = response.data;
            
            // Map backend data to Experience type
            const mappedExperience: Experience = {
              experienceId: experience.id || experience.experienceId || '',
              name: experience.name || experience.product?.name || '',
              category: experience.category || experience.product?.category || '',
              tagline: experience.tagline || experience.product?.tagline || '',
              skinType: experience.skin_type || experience.product?.skin_type || '',
              description: experience.description || experience.product?.description || '',
              storeLink: experience.store_link || experience.product?.store_link || '',
              originalPrice: experience.original_price ?? experience.product?.original_price ?? null,
              discountedPrice: experience.discounted_price ?? experience.product?.discounted_price ?? null,
              estimatedDurationDays: experience.estimated_usage_duration_days ?? experience.product?.estimated_usage_duration_days ?? 30,
              netContent: experience.net_content ?? experience.product?.net_content ?? 0,
              product_image_url: Array.isArray(experience.product?.product_image_url) 
                ? experience.product.product_image_url.map((url: string, index: number) => ({
                    id: `img-${index}-${Date.now()}`,
                    url: url,
                    file: undefined,
                  }))
                : experience.product?.product_image_url 
                  ? [{
                      id: `img-0-${Date.now()}`,
                      url: experience.product.product_image_url,
                      file: undefined,
                    }]
                  : [],
              features: {
                tutorialsRoutines: false,
                ingredientList: false,
                loyaltyPoints: false,
                skinRecommendations: false,
                chatbot: false,
                feedbackForm: true,
                customerService: false,
                productUsage: false,
                ...(Array.isArray(experience.features) 
                  ? experience.features.reduce((acc: any, feature: any) => {
                      if (feature.feature_name && typeof feature.is_enabled === 'boolean') {
                        acc[feature.feature_name] = feature.is_enabled;
                      }
                      return acc;
                    }, {})
                  : experience.features)
              }
            };

            // Update the store with fetched data and store in localStorage
            set({ 
              experienceData: mappedExperience,
              experienceId: experience.id || null,
              productId: experience.productId || experience.product?.id || null
            });

            // Also store in localStorage by ID
            setExperienceDataById(experienceId, mappedExperience);

            return mappedExperience;
          }
          return null;
        } catch (error) {
          console.error('Error fetching experience data:', error);
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setFeaturesForExperience: (experienceId, features) => {
        // Update the features field in the main experienceData object
        set((state) => ({
          experienceData: {
            ...state.experienceData,
            features: { ...features },
          },
        }));
        
        // Also store features separately by experience ID
        set((state) => ({
          featuresByExperienceId: {
            ...state.featuresByExperienceId,
            [experienceId]: features,
          },
        }));
      },

      getFeaturesForExperience: (experienceId) => {
        // First try to get from featuresByExperienceId, fallback to main experienceData
        const state = get();
        return state.featuresByExperienceId[experienceId] || state.experienceData.features;
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
      // Save all state to local storage except loading states
      partialize: (state) => ({
        experienceData: state.experienceData,
        brand: state.brand,
        experienceId: state.experienceId,
        productId: state.productId,
        featuresByExperienceId: state.featuresByExperienceId,
        experienceUrl: state.experienceUrl,
        // Exclude isLoading from persistence
      }),
    }
  )
);