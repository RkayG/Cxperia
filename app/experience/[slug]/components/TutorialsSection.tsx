'use client';

import React, { useEffect, useState } from 'react';
import { useExperienceTutorials } from '@/hooks/public/useTutorials';
import { Skeleton } from '@/components/ui/skeleton';

interface TutorialsSectionProps {
  slug: string;
  color: string;
}

const TutorialsSection: React.FC<TutorialsSectionProps> = ({ slug, color }) => {
  const { data: tutorialsData, isLoading, error } = useExperienceTutorials(slug);
  const [tutorials, setTutorials] = useState<any[]>([]);

  useEffect(() => {
    if (tutorialsData?.data) {
      setTutorials(Array.isArray(tutorialsData.data) ? tutorialsData.data : []);
    }
  }, [tutorialsData]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Loading tutorials...</h3>
        <div className="grid gap-4">
          {[...Array(3)].map((_, index) => (
            <TutorialCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Failed to load tutorials</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (tutorials.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No tutorials available</h3>
        <p className="text-gray-600">Check back later for new tutorials and routines.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Tutorials & Routines</h3>
      <div className="grid gap-4">
        {tutorials.map((tutorial: any) => (
          <TutorialCard key={tutorial.id || tutorial.title} tutorial={tutorial} color={color} />
        ))}
      </div>
    </div>
  );
};

const TutorialCard: React.FC<{ tutorial: any; color: string }> = ({ tutorial, color }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        {tutorial.featured_image_url || tutorial.featured_image ? (
          <div className="relative h-48 bg-gray-100">
            <img
              src={tutorial.featured_image_url || tutorial.featured_image}
              alt={tutorial.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-200">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: color }}
          >
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {tutorial.title}
        </h4>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {tutorial.description || tutorial.content || 'Learn more about this tutorial.'}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <span className="text-sm text-gray-500">
              {tutorial.duration || '5 min'}
            </span>
          </div>
          
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            style={{ 
              backgroundColor: `${color}15`, 
              color: color,
              border: `1px solid ${color}30`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = color;
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${color}15`;
              e.currentTarget.style.color = color;
            }}
          >
            Watch Now
          </button>
        </div>
      </div>
    </div>
  );
};

const TutorialCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative">
        <Skeleton className="h-48 w-full" />
      </div>
      
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default TutorialsSection;
