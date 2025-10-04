import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useTutorials } from '@/hooks/brands/useFeatureApi';

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
  
  // Actions
  fetchContentData: (brandId: string) => Promise<void>;
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
  
  return tutorials.map((tut: any, index: number) => ({
    ...tut,
    id: tut.id || `tutorial-${index}`, // Ensure ID is present
    date: formatDateFriendly(tut.created_at || tut.createdAt),
    image: tut.featured_image_url || tut.featured_image || placeholderImg,
    status: tut.is_published ? 'PUBLISHED' : 'DRAFT',
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

    // Actions
    fetchContentData: async (brandId: string) => {
      if (!brandId) return;
      
      set({ isLoading: true, error: null });
      
      try {
        // Use the existing hook internally
        const { data: tutorialsRaw, isLoading } = useTutorials(brandId);

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
          isLoading
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch content data',
          isLoading: false
        });
      }
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
export const useContentFilters = () => useContentStore(state => ({
  activeTab: state.activeTab,
  selectedType: state.selectedType,
  selectedCategory: state.selectedCategory,
  search: state.search,
}));
export const useContentLoading = () => useContentStore(state => state.isLoading);
export const useContentError = () => useContentStore(state => state.error);

// Action hooks
export const useContentActions = () => useContentStore(state => ({
  fetchContentData: state.fetchContentData,
  setActiveTab: state.setActiveTab,
  setSelectedType: state.setSelectedType,
  setSelectedCategory: state.setSelectedCategory,
  setSearch: state.setSearch,
  selectArticle: state.selectArticle,
  selectAllArticles: state.selectAllArticles,
  clearSelection: state.clearSelection,
  clearError: state.clearError,
}));
