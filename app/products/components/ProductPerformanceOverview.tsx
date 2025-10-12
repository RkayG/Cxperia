// src/components/ProductDashboard/ProductPerformanceOverview.tsx
import React from 'react';
import PerformanceMetricCard from './PerformanceMetrics';
import type { ProductPerformanceOverviewProps } from './productTypes';

const ProductPerformanceOverview: React.FC<ProductPerformanceOverviewProps> = ({ metrics }) => {
  return (
    <div className="mb-32 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-900 text-left mt-6  mb-6">Catalogue</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {metrics.map((metric, _idx) => (
          <PerformanceMetricCard key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
};

export default ProductPerformanceOverview;
