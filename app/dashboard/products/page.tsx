'use client';
import { Camera, Clock, Play } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useExperienceStore } from '@/store/brands/useExperienceStore';
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
  // Get brand from store
  const brand = useExperienceStore((state) => state.brand);
  const brandId = brand?.id;
  
  // Subscribe to store state (no hooks, pure subscription)
  const products = useProductsList();
  const performanceMetrics = useProductsMetrics();
  const isLoading = useProductsLoading();
  
  // Get actions from store
  const { fetchProductsData } = useProductsActions();

  const pathname = usePathname();
  const router = useRouter();

  // Initialize data fetching
  useEffect(() => {
    if (brandId) {
      fetchProductsData(brandId);
    }
  }, [brandId, fetchProductsData]);


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