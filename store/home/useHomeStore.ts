import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useMemo } from 'react';

interface HomeState {
  experiences: any[];
  tutorials: any[];
  stats: any;
  searchQuery: string;
  isLoadingExperiences: boolean;
  isLoadingTutorials: boolean;
  isLoadingStats: boolean;
  error: string | null;
}

interface HomeActions {
  fetchHomeData: (brandId: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  clearError: () => void;
}

export const useHomeStore = create(
  subscribeWithSelector<HomeState & HomeActions>((set, get) => ({
    experiences: [],
    tutorials: [],
    stats: null,
    searchQuery: '',
    isLoadingExperiences: false,
    isLoadingTutorials: false,
    isLoadingStats: false,
    error: null,

    fetchHomeData: async (brandId: string) => {
      console.log('📡 HomeStore: fetchHomeData called', { brandId, timestamp: new Date().toISOString() });
      
      if (!brandId) return;
      
      set({ isLoadingExperiences: true, isLoadingTutorials: true, isLoadingStats: true, error: null });
      
      try {
        // Fetch all data in parallel
        const [experiencesRes, tutorialsRes, statsRes] = await Promise.all([
          fetch(`/api/experiences?brand_id=${brandId}`),
          fetch('/api/tutorials?recent=true'),
          fetch('/api/scan-analytics/summary')
        ]);

        const [experiencesData, tutorialsData, statsData] = await Promise.all([
          experiencesRes.json(),
          tutorialsRes.json(),
          statsRes.json()
        ]);

        set({
          experiences: experiencesData?.data || [],
          tutorials: tutorialsData?.data || [],
          stats: statsData?.data || null,
          isLoadingExperiences: false,
          isLoadingTutorials: false,
          isLoadingStats: false,
        });
      } catch (error) {
        console.error('HomeStore fetch error:', error);
        set({
          error: error instanceof Error ? error.message : 'Failed to fetch home data',
          isLoadingExperiences: false,
          isLoadingTutorials: false,
          isLoadingStats: false,
        });
      }
    },

    setSearchQuery: (query: string) => {
      set({ searchQuery: query });
    },

    clearError: () => set({ error: null }),
  }))
);

// Individual selectors
export const useHomeExperiences = () => useHomeStore(state => state.experiences);
export const useHomeTutorials = () => useHomeStore(state => state.tutorials);
export const useHomeStats = () => useHomeStore(state => state.stats);
export const useHomeSearchQuery = () => useHomeStore(state => state.searchQuery);
export const useHomeError = () => useHomeStore(state => state.error);

// Individual loading selectors
export const useHomeLoadingExperiences = () => useHomeStore(state => state.isLoadingExperiences);
export const useHomeLoadingTutorials = () => useHomeStore(state => state.isLoadingTutorials);
export const useHomeLoadingStats = () => useHomeStore(state => state.isLoadingStats);

// Memoized combined loading selector
export const useHomeLoading = () => {
  const isLoadingExperiences = useHomeLoadingExperiences();
  const isLoadingTutorials = useHomeLoadingTutorials();
  const isLoadingStats = useHomeLoadingStats();
  
  return useMemo(() => ({
    isLoadingExperiences,
    isLoadingTutorials,
    isLoadingStats,
  }), [isLoadingExperiences, isLoadingTutorials, isLoadingStats]);
};

// Computed selectors
export const useHomeFilteredExperiences = () => useHomeStore(state => {
  const { experiences, searchQuery } = state;
  if (!searchQuery.trim()) return experiences;
  return experiences.filter((exp: any) => {
    const val = (exp.name || exp.title || "").toLowerCase();
    return val.includes(searchQuery.trim().toLowerCase());
  });
});

export const useHomeFilteredTutorials = () => useHomeStore(state => {
  const { tutorials, searchQuery } = state;
  if (!searchQuery.trim()) return tutorials;
  return tutorials.filter((tut: any) => {
    const val = (tut.title || tut.name || "").toLowerCase();
    return val.includes(searchQuery.trim().toLowerCase());
  });
});

// Individual action selectors
export const useHomeFetchHomeData = () => useHomeStore(state => state.fetchHomeData);
export const useHomeSetSearchQuery = () => useHomeStore(state => state.setSearchQuery);
export const useHomeClearError = () => useHomeStore(state => state.clearError);

// Memoized combined actions selector
export const useHomeActions = () => {
  const fetchHomeData = useHomeFetchHomeData();
  const setSearchQuery = useHomeSetSearchQuery();
  const clearError = useHomeClearError();
  
  return useMemo(() => ({
    fetchHomeData,
    setSearchQuery,
    clearError,
  }), [fetchHomeData, setSearchQuery, clearError]);
};
