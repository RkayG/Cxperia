import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useMemo } from 'react';

export interface Article {
  id: string | number;
  title: string;
  description?: string;
  date: string;
  image: string;
  status: 'PUBLISHED' | 'DRAFT';
  category?: string;
  featured_video_url?: string;
  is_published?: boolean;
  created_at?: string;
  createdAt?: string;
  featured_image_url?: string;
  featured_image?: string;
  views: number;
  userImage: string;
}

interface ContentState {
  // Data
  tutorials: any[];
  articles: Article[];
  filteredArticles: Article[];
  
  // UI State
  selectedArticles: Set<string | number>;
  activeTab: string;
  selectedType: string;
  selectedCategory: string;
  search: string;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Cache tracking
  currentBrandId: string | null;
  
  // Actions
  fetchContentData: (brandId: string) => Promise<void>;
  invalidateCache: () => void;
  refreshData: (brandId: string) => Promise<void>;
  setActiveTab: (tab: string) => void;
  setSelectedType: (type: string) => void;
  setSelectedCategory: (category: string) => void;
  setSearch: (search: string) => void;
  selectArticle: (id: string | number, isSelected: boolean) => void;
  selectAllArticles: () => void;
  clearSelection: () => void;
  clearError: () => void;
}

// Data processing functions
const processTutorialsData = (tutorialsRaw: any): any[] => {
  if (!tutorialsRaw) return [];
  if (tutorialsRaw.error || (tutorialsRaw.data && !Array.isArray(tutorialsRaw.data))) {
    return [];
  }
  if (Array.isArray(tutorialsRaw)) return tutorialsRaw;
  if (Array.isArray(tutorialsRaw.data)) return tutorialsRaw.data;
  return [];
};

const formatDateFriendly = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
};

const mapTutorialsToArticles = (tutorials: any[]): Article[] => {
  const placeholderImg = 'https://placehold.co/600x400/EEE/31343C?text=No+Image';
  const defaultUserImage = 'https://placehold.co/40x40/EEE/31343C?text=U';
  
  return tutorials.map((tut: any, index: number) => ({
    ...tut,
    id: tut.id || `tutorial-${index}`, // Ensure ID is present
    date: formatDateFriendly(tut.created_at || tut.createdAt),
    image: tut.featured_image_url || tut.featured_image || placeholderImg,
    status: tut.is_published ? 'PUBLISHED' : 'DRAFT',
    views: tut.views || Math.floor(Math.random() * 1000) + 50, // Default views or random
    userImage: tut.user_image || tut.userImage || defaultUserImage, // Default user image
  }));
};

const filterArticles = (
  articles: Article[], 
  activeTab: string, 
  selectedType: string, 
  selectedCategory: string, 
  search: string
): Article[] => {
  return articles.filter(article => {
    // Tab filter (status)
    if (activeTab === 'published' && String(article.status).toLowerCase() !== 'published') return false;
    if (activeTab === 'draft' && String(article.status).toLowerCase() !== 'draft') return false;
    
    // Type filter: Video = has featured_video_url, Article = does not have featured_video_url
    if (selectedType === 'Video' && !article.featured_video_url) return false;
    if (selectedType === 'Article' && article.featured_video_url) return false;
    
    // Category filter
    if (selectedCategory && selectedCategory !== 'All Categories' && article.category !== selectedCategory) return false;
    
    // Search filter
    if (search && !String(article.title).toLowerCase().includes(search.toLowerCase())) return false;
    
    return true;
  });
};

export const useContentStore = create<ContentState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    tutorials: [],
    articles: [],
    filteredArticles: [],
    selectedArticles: new Set(),
    activeTab: 'all',
    selectedType: '',
    selectedCategory: '',
    search: '',
    isLoading: false,
    error: null,
    currentBrandId: null,

    // Actions
    fetchContentData: async (brandId: string) => {
      console.log('📡 ContentStore: fetchContentData called', { brandId, timestamp: new Date().toISOString() });
      
      if (!brandId) return;
      
      // Don't fetch if we already have data for this brand
      const { currentBrandId } = get();
      if (currentBrandId === brandId && !get().isLoading) {
        console.log('⏭️ ContentStore: Skipping fetch - already have data for brand', { brandId });
        return;
      }
      
      set({ isLoading: true, error: null });
      
      try {
        // Fetch data directly from API instead of using hooks
        const tutorialsResponse = await fetch(`/api/tutorials?brand_id=${brandId}`);
        const tutorialsRaw = await tutorialsResponse.json();

        // Process the data
        const tutorials = processTutorialsData(tutorialsRaw);
        const articles = mapTutorialsToArticles(tutorials);
        
        // Apply current filters
        const { activeTab, selectedType, selectedCategory, search } = get();
        const filteredArticles = filterArticles(articles, activeTab, selectedType, selectedCategory, search);
        
        set({ 
          tutorials, 
          articles, 
          filteredArticles,
          isLoading: false,
          currentBrandId: brandId // Set current brand after successful fetch
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch content data',
          isLoading: false,
          currentBrandId: brandId // Set current brand even on error to prevent re-fetching immediately
        });
      }
    },

    invalidateCache: () => {
      console.log('🔄 ContentStore: Cache invalidated - next fetch will reload data');
      set({ currentBrandId: null });
    },

    refreshData: async (brandId: string) => {
      console.log('🔄 ContentStore: Force refreshing data for brand:', brandId);
      set({ currentBrandId: null }); // Clear cache
      const { fetchContentData } = get();
      await fetchContentData(brandId); // Force refetch
    },

    setActiveTab: (tab: string) => {
      const { articles, selectedType, selectedCategory, search } = get();
      const filteredArticles = filterArticles(articles, tab, selectedType, selectedCategory, search);
      set({ activeTab: tab, filteredArticles });
    },

    setSelectedType: (type: string) => {
      const { articles, activeTab, selectedCategory, search } = get();
      const filteredArticles = filterArticles(articles, activeTab, type, selectedCategory, search);
      set({ selectedType: type, filteredArticles });
    },

    setSelectedCategory: (category: string) => {
      const { articles, activeTab, selectedType, search } = get();
      const filteredArticles = filterArticles(articles, activeTab, selectedType, category, search);
      set({ selectedCategory: category, filteredArticles });
    },

    setSearch: (search: string) => {
      const { articles, activeTab, selectedType, selectedCategory } = get();
      const filteredArticles = filterArticles(articles, activeTab, selectedType, selectedCategory, search);
      set({ search, filteredArticles });
    },

    selectArticle: (id: string | number, isSelected: boolean) => {
      const { selectedArticles } = get();
      const newSelected = new Set(selectedArticles);
      if (isSelected) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      set({ selectedArticles: newSelected });
    },

    selectAllArticles: () => {
      const { filteredArticles } = get();
      const allIds = new Set(filteredArticles.map(article => article.id));
      set({ selectedArticles: allIds });
    },

    clearSelection: () => {
      set({ selectedArticles: new Set() });
    },

    clearError: () => {
      set({ error: null });
    },
  }))
);

// Selector hooks for specific data
export const useContentTutorials = () => useContentStore(state => state.tutorials);
export const useContentArticles = () => useContentStore(state => state.articles);
export const useContentFilteredArticles = () => useContentStore(state => state.filteredArticles);
export const useContentSelectedArticles = () => useContentStore(state => state.selectedArticles);

// Memoized filter selectors to prevent infinite loops
export const useContentActiveTab = () => useContentStore(state => state.activeTab);
export const useContentSelectedType = () => useContentStore(state => state.selectedType);
export const useContentSelectedCategory = () => useContentStore(state => state.selectedCategory);
export const useContentSearch = () => useContentStore(state => state.search);

// Combined filters hook with proper memoization
export const useContentFilters = () => {
  const activeTab = useContentActiveTab();
  const selectedType = useContentSelectedType();
  const selectedCategory = useContentSelectedCategory();
  const search = useContentSearch();
  
  return useMemo(() => ({
    activeTab,
    selectedType,
    selectedCategory,
    search,
  }), [activeTab, selectedType, selectedCategory, search]);
};

export const useContentLoading = () => useContentStore(state => state.isLoading);
export const useContentError = () => useContentStore(state => state.error);

// Action hooks - individual selectors to prevent infinite loops
export const useContentFetchContentData = () => useContentStore(state => state.fetchContentData);
export const useContentInvalidateCache = () => useContentStore(state => state.invalidateCache);
export const useContentRefreshData = () => useContentStore(state => state.refreshData);
export const useContentSetActiveTab = () => useContentStore(state => state.setActiveTab);
export const useContentSetSelectedType = () => useContentStore(state => state.setSelectedType);
export const useContentSetSelectedCategory = () => useContentStore(state => state.setSelectedCategory);
export const useContentSetSearch = () => useContentStore(state => state.setSearch);
export const useContentSelectArticle = () => useContentStore(state => state.selectArticle);
export const useContentSelectAllArticles = () => useContentStore(state => state.selectAllArticles);
export const useContentClearSelection = () => useContentStore(state => state.clearSelection);
export const useContentClearError = () => useContentStore(state => state.clearError);

export const useContentActions = () => {
  const fetchContentData = useContentFetchContentData();
  const invalidateCache = useContentInvalidateCache();
  const refreshData = useContentRefreshData();
  const setActiveTab = useContentSetActiveTab();
  const setSelectedType = useContentSetSelectedType();
  const setSelectedCategory = useContentSetSelectedCategory();
  const setSearch = useContentSetSearch();
  const selectArticle = useContentSelectArticle();
  const selectAllArticles = useContentSelectAllArticles();
  const clearSelection = useContentClearSelection();
  const clearError = useContentClearError();
  
  return {
    fetchContentData,
    invalidateCache,
    refreshData,
    setActiveTab,
    setSelectedType,
    setSelectedCategory,
    setSearch,
    selectArticle,
    selectAllArticles,
    clearSelection,
    clearError,
  };
};
