'use client';
import { Camera, Clock, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useBrand } from '@/contexts/BrandContext';
import { useNavigationProgressWithQuery } from '@/hooks/useNavigationProgressWithQuery';
import { 
  useProductsList, 
  useProductsMetrics, 
  useProductsLoading, 
  useProductsActions 
} from '@/store/products/useProductsStore';

import ProductListings from './components/ProductListings';
import ProductPerformanceOverview from './components/ProductPerformanceOverview';
import type { PerformanceMetric } from './components/productTypes';

const ProductDashboard: React.FC = () => {
  
  // Get brand from context
  const { brand, brandId, isLoading: brandLoading, error: brandError } = useBrand();
  
  // Subscribe to store state (no hooks, pure subscription)
  const products = useProductsList();
  const performanceMetrics = useProductsMetrics();
  const isLoading = useProductsLoading();
  
  // Use navigation progress with loading state
  useNavigationProgressWithQuery(isLoading, !!brandError);
  
  // Get actions from store
  const { fetchProductsData } = useProductsActions();

  const router = useRouter();

  // Initialize data fetching
  useEffect(() => {
    if (brandId) {
      fetchProductsData(brandId);
    }
  }, [brandId, fetchProductsData]);

  

  // Show error state if brand fetch failed
  if (brandError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading brand: {brandError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }


  // Add icons to metrics (this could be moved to store if needed)
  const metricsWithIcons: PerformanceMetric[] = performanceMetrics.map((metric, index) => {
    const icons = [Camera, Play, Clock];
    return {
      ...metric,
      icon: icons[index] || Camera,
    };
  });

  // Navigation handler to experience edit page with prefill data
  const handleEditExperience = (exp: any) => {
    // Store experience data in localStorage for the edit page to access
    localStorage.setItem('experienceData', JSON.stringify(exp));
    router.push(`/dashboard/experience/edit/${exp.id}?step=product-details`);
  };

  return (
    <div className="min-h-screen mx-auto pb-32 bg-gray-50 sm:pb-32 sm:p-6 lg:p-8">
      <ProductPerformanceOverview 
        metrics={metricsWithIcons} 
        isLoading={isLoading} 
      />
      <ProductListings
        products={products}
        onEditExperience={handleEditExperience}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductDashboard;