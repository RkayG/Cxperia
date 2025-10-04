import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

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
          fetch(`/api/brand-stats?brand_id=${brandId}`)
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

// Selectors
export const useHomeExperiences = () => useHomeStore(state => state.experiences);
export const useHomeTutorials = () => useHomeStore(state => state.tutorials);
export const useHomeStats = () => useHomeStore(state => state.stats);
export const useHomeSearchQuery = () => useHomeStore(state => state.searchQuery);
export const useHomeLoading = () => useHomeStore(state => ({
  isLoadingExperiences: state.isLoadingExperiences,
  isLoadingTutorials: state.isLoadingTutorials,
  isLoadingStats: state.isLoadingStats,
}));
export const useHomeError = () => useHomeStore(state => state.error);

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

// Actions
export const useHomeActions = () => useHomeStore(state => ({
  fetchHomeData: state.fetchHomeData,
  setSearchQuery: state.setSearchQuery,
  clearError: state.clearError,
}));
