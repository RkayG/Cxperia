// src/components/ProductDashboard/PerformanceMetricCard.tsx
// import { Info } from 'lucide-react';
import React from 'react';
import type { PerformanceMetricCardProps } from './productTypes';

const PerformanceMetricCard: React.FC<PerformanceMetricCardProps> = ({ metric }) => {
  return (
    <div className="bg-white p-6 rounded-lg  border border-gray-300 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        {/* {metric.icon && (
          <div className="bg-blue-100 p-2 rounded-full">
            <metric.icon size={20} className="text-[#502274]" />
          </div>
        )} */}
        <h3 className=" text-md sm:text-lg font-semibold text-left text-black tracking-wide">
          {metric.title}
        </h3>
      </div>
      <div className="flex flex-col">
        <p className="text-3xl text-left font-bold text-gray-900 leading-none">
          {metric.value}
        </p>
      </div>
      
    </div>
  );
};

export default PerformanceMetricCard;