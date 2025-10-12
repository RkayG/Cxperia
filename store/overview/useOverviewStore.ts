import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useMemo } from 'react';

export interface OverviewMetrics {
  totalExperiences: number;
  activeExperiences: number;
  totalScans: number;
  totalFeedbacks: number;
  experienceChange: string;
  scanChange: string;
  feedbackChange: string;
  activeChange: string;
}

interface OverviewState {
  // Data
  experiences: any[];
  feedbacks: any[];
  metrics: OverviewMetrics;
  
  // Loading states
  isLoadingExperiences: boolean;
  isLoadingFeedbacks: boolean;
  error: string | null;
  currentBrandId: string | null;
  
  // Actions
  fetchOverviewData: (brandId: string) => Promise<void>;
  clearError: () => void;
}

// Data processing functions
const processExperiencesData = (experiencesRaw: any): any[] => {
  if (!experiencesRaw) return [];
  if (experiencesRaw.error || (experiencesRaw.data && !Array.isArray(experiencesRaw.data))) {
    return [];
  }
  if (Array.isArray(experiencesRaw)) return experiencesRaw;
  if (Array.isArray(experiencesRaw.data)) return experiencesRaw.data;
  return [];
};

const processFeedbacksData = (feedbacksRaw: any): any[] => {
  if (!feedbacksRaw) return [];
  if (feedbacksRaw.error || (feedbacksRaw.data && !Array.isArray(feedbacksRaw.data))) {
    return [];
  }
  if (Array.isArray(feedbacksRaw)) return feedbacksRaw;
  if (Array.isArray(feedbacksRaw.data)) return feedbacksRaw.data;
  return [];
};

const calculateMetrics = (experiences: any[], feedbacks: any[]): OverviewMetrics => {
  const totalExperiences = experiences.length;
  const activeExperiences = experiences.filter((exp: any) => exp.is_published).length;
  const totalScans = experiences.reduce((sum, exp) => sum + (exp.scan_count || 0), 0);
  const totalFeedbacks = feedbacks.length;

  // Calculate percentage changes (mock for now - you can implement actual historical comparison)
  const experienceChange = totalExperiences > 0 ? "+12.5%" : "0%";
  const scanChange = totalScans > 0 ? "+23.1%" : "0%";
  const feedbackChange = totalFeedbacks > 0 ? "+8.7%" : "0%";
  const activeChange = activeExperiences > 0 ? "+5.2%" : "0%";

  return {
    totalExperiences,
    activeExperiences,
    totalScans,
    totalFeedbacks,
    experienceChange,
    scanChange,
    feedbackChange,
    activeChange,
  };
};

export const useOverviewStore = create<OverviewState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    experiences: [],
    feedbacks: [],
    metrics: {
      totalExperiences: 0,
      activeExperiences: 0,
      totalScans: 0,
      totalFeedbacks: 0,
      experienceChange: "0%",
      scanChange: "0%",
      feedbackChange: "0%",
      activeChange: "0%",
    },
    isLoadingExperiences: false,
    isLoadingFeedbacks: false,
    error: null,
    currentBrandId: null,

    // Actions
    fetchOverviewData: async (brandId: string) => {
      
      if (!brandId) return;
      
      // Don't fetch if we already have data for this brand
      const { currentBrandId } = get();
      if (currentBrandId === brandId && !get().isLoadingExperiences && !get().isLoadingFeedbacks) {
        return;
      }
      
      set({ isLoadingExperiences: true, isLoadingFeedbacks: true, error: null });
      
      try {
        // Fetch data directly from APIs instead of using hooks
        const experiencesResponse = await fetch(`/api/experiences?brand_id=${brandId}`);
        const feedbacksResponse = await fetch(`/api/feedbacks?brand_id=${brandId}`);
        
        const experiencesRaw = await experiencesResponse.json();
        const feedbacksRaw = await feedbacksResponse.json();

        // Process the data
        const experiences = processExperiencesData(experiencesRaw);
        const feedbacks = processFeedbacksData(feedbacksRaw);
        
        // Calculate metrics
        const metrics = calculateMetrics(experiences, feedbacks);
        
        set({ 
          experiences, 
          feedbacks, 
          metrics,
          isLoadingExperiences: false,
          isLoadingFeedbacks: false,
          currentBrandId: brandId
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch overview data',
          isLoadingExperiences: false,
          isLoadingFeedbacks: false,
          currentBrandId: brandId
        });
      }
    },

    clearError: () => {
      set({ error: null });
    },
  }))
);

// Selector hooks for specific data
export const useOverviewExperiences = () => useOverviewStore(state => state.experiences);
export const useOverviewFeedbacks = () => useOverviewStore(state => state.feedbacks);
export const useOverviewMetrics = () => useOverviewStore(state => state.metrics);
// Memoized loading selectors to prevent infinite loops
export const useOverviewLoadingExperiences = () => useOverviewStore(state => state.isLoadingExperiences);
export const useOverviewLoadingFeedbacks = () => useOverviewStore(state => state.isLoadingFeedbacks);

export const useOverviewLoading = () => {
  const isLoadingExperiences = useOverviewLoadingExperiences();
  const isLoadingFeedbacks = useOverviewLoadingFeedbacks();
  
  return useMemo(() => ({
    isLoadingExperiences,
    isLoadingFeedbacks,
  }), [isLoadingExperiences, isLoadingFeedbacks]);
};
export const useOverviewError = () => useOverviewStore(state => state.error);

// Action hooks - individual selectors to prevent infinite loops
export const useOverviewFetchOverviewData = () => useOverviewStore(state => state.fetchOverviewData);
export const useOverviewClearError = () => useOverviewStore(state => state.clearError);

export const useOverviewActions = () => {
  const fetchOverviewData = useOverviewFetchOverviewData();
  const clearError = useOverviewClearError();
  
  return useMemo(() => ({
    fetchOverviewData,
    clearError,
  }), [fetchOverviewData, clearError]);
};
