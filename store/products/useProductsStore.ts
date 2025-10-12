import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useMemo } from 'react';

export interface PerformanceMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  lastUpdated: string;
  icon: any;
}

export interface Product {
  id: string;
  image: string;
  name: string;
  category: string;
  experience: string;
  qrCodeStatus: 'Generated' | 'Pending';
  addedDate: string;
  _fullExp?: any; // Full experience data for navigation
}

interface ProductsState {
  // Data
  experiences: any[];
  products: Product[];
  performanceMetrics: PerformanceMetric[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProductsData: (brandId: string) => Promise<void>;
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

const calculatePerformanceMetrics = (experiences: any[]): PerformanceMetric[] => {
  const activeQrCount = experiences.filter((exp: any) => exp.qr_code_url).length;
  const pendingQrCount = experiences.filter((exp: any) => !exp.qr_code_url).length;
  const totalScans = experiences.reduce((sum, exp) => sum + (exp.scan_count || 0), 0);

  return [
    {
      id: 'totalBrand',
      title: 'Total Scans',
      value: totalScans.toString(),
      change: '+5.5% MoM',
      isPositive: true,
      lastUpdated: '1 hour ago',
      icon: null, // Will be set by component
    },
    {
      id: 'totalCampaigns',
      title: 'Active QR Codes',
      value: String(activeQrCount),
      change: '-1.2% MoM',
      isPositive: activeQrCount >= 0,
      lastUpdated: '',
      icon: null, // Will be set by component
    },
    {
      id: 'newListings',
      title: 'Pending QR Codes',
      value: String(pendingQrCount),
      change: '+2.1% MoM',
      isPositive: pendingQrCount >= 0,
      lastUpdated: '',
      icon: null, // Will be set by component
    },
  ];
};

const mapExperiencesToProducts = (experiences: any[]): Product[] => {
  return experiences.map((exp: any) => {
    // Get product data from the nested products object
    const product = exp.products || {};
    
    return {
      id: exp.id, // Use exp.id instead of exp.experience_id
      image: product.product_image_url && product.product_image_url[0] 
        ? product.product_image_url[0] 
        : '/src/assets/images/demo6.png',
      name: product.name || 'Untitled Product',
      category: product.category || 'Uncategorized',
      experience: product.name ? `${product.name} experience` : 'Untitled experience',
      qrCodeStatus: exp.qr_code_url ? 'Generated' : 'Pending',
      addedDate: exp.created_at ? new Date(exp.created_at).toISOString().slice(0, 10) : '',
      // Attach full experience data for navigation
      _fullExp: exp,
    };
  });
};

export const useProductsStore = create<ProductsState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    experiences: [],
    products: [],
    performanceMetrics: [],
    isLoading: false,
    error: null,

    // Actions
    fetchProductsData: async (brandId: string) => {
      
      if (!brandId) return;
      
      set({ isLoading: true, error: null });
      
      try {
        // Fetch data directly from API instead of using hooks
        const experiencesResponse = await fetch(`/api/experiences?brand_id=${brandId}`);
        const experiencesRaw = await experiencesResponse.json();

        // Process the data
        const experiences = processExperiencesData(experiencesRaw);
        const products = mapExperiencesToProducts(experiences);
        const performanceMetrics = calculatePerformanceMetrics(experiences);
        
        set({ 
          experiences, 
          products, 
          performanceMetrics,
          isLoading: false
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch products data',
          isLoading: false
        });
      }
    },

    clearError: () => {
      set({ error: null });
    },
  }))
);

// Selector hooks for specific data
export const useProductsExperiences = () => useProductsStore(state => state.experiences);
export const useProductsList = () => useProductsStore(state => state.products);
export const useProductsMetrics = () => useProductsStore(state => state.performanceMetrics);
export const useProductsLoading = () => useProductsStore(state => state.isLoading);
export const useProductsError = () => useProductsStore(state => state.error);

// Action hooks - individual selectors to prevent infinite loops
export const useProductsFetchProductsData = () => useProductsStore(state => state.fetchProductsData);
export const useProductsClearError = () => useProductsStore(state => state.clearError);

export const useProductsActions = () => {
  const fetchProductsData = useProductsFetchProductsData();
  const clearError = useProductsClearError();
  
  return useMemo(() => ({
    fetchProductsData,
    clearError,
  }), [fetchProductsData, clearError]);
};
