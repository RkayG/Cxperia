// src/components/AdBanner.tsx

import React from 'react';

const AdBanner: React.FC = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg">
      <img
        src="/path-to-your-image.png" 
        alt="Hydra Glow Cream"
        className="w-full h-auto"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        
      </div>
    </div>
  );
};

export default AdBanner;