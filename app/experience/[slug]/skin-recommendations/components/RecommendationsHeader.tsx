// src/components/RecommendationsHeader.tsx
import React from 'react';

const RecommendationsHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-b-3xl relative">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-white text-2xl font-bold">Skin Recommendations</h1>
        {/* Logo Placeholder */}
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-gray-500 font-bold text-sm shadow-inner">
          LOGO
        </div>
      </div>
      <p className="text-white text-sm opacity-90 max-w-[80%]">
        The products below are recommended based on your skin type
      </p>
    </div>
  );
};

export default RecommendationsHeader;
