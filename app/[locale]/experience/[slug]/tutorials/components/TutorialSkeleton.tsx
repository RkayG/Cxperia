import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const TutorialCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg mx-3 shadow-md overflow-hidden">
      {/* Media Preview Skeleton */}
      <div className="relative aspect-video">
        <Skeleton className="w-full h-full" />
        
        {/* Duration Badge Skeleton */}
        <div className="absolute bottom-2 right-2">
          <Skeleton className="h-6 w-16" />
        </div>
        
        {/* Steps Badge Skeleton */}
        <div className="absolute bottom-2 left-2">
          <Skeleton className="h-6 w-20" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-3">
        <div className="flex space-x-3">
          {/* Brand Logo Skeleton */}
          <div className="flex-shrink-0">
            <Skeleton className="w-9 h-9 rounded-full" />
          </div>

          {/* Content Skeleton */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Title Skeleton */}
            <div className="space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            
            {/* Brand Name Skeleton */}
            <Skeleton className="h-3 w-20" />
            
            {/* Views and Date Skeleton */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="w-1 h-1 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          {/* More Options Skeleton */}
          <div className="flex-shrink-0">
            <Skeleton className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

const TutorialGridSkeleton: React.FC = () => {
  return (
    <div>
      {/* Featured Video Skeleton */}
      <div className="mb-6">
        <Skeleton className="w-full h-64 rounded-xl" />
      </div>

      {/* Tutorial Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <TutorialCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default TutorialGridSkeleton;
