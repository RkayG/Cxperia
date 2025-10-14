// src/components/ProductDashboard/ProductPerformanceOverview.tsx
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import PerformanceMetricCard from './PerformanceMetrics';
import type { ProductPerformanceOverviewProps } from './productTypes';

interface ProductPerformanceOverviewPropsWithLoading extends ProductPerformanceOverviewProps {
  isLoading?: boolean;
}

const ProductPerformanceOverview: React.FC<ProductPerformanceOverviewPropsWithLoading> = ({ metrics, isLoading = false }) => {
  return (
    <div className="mb-24 mt-4 md:mt-0 px-4 md:px-0 ">
      <h2 className="text-2xl font-bold text-gray-900 text-left  mb-6">Produits</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {isLoading ? (
          // Skeleton loading for performance metrics
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <div className="flex flex-col">
                <Skeleton className="h-8 w-16 mb-2" />
              </div>
            </div>
          ))
        ) : (
          metrics.map((metric, _idx) => (
            <PerformanceMetricCard key={metric.id} metric={metric} />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductPerformanceOverview;
