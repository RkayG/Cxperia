// src/components/TutorialsGrid.tsx
import React from 'react';

import { useExperienceTutorials } from '@/hooks/public/useTutorials';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';
import TutorialCard from './TutorialCard';
import TutorialGridSkeleton from './TutorialSkeleton';
import { getVideoType, getVimeoEmbedUrl, getYouTubeEmbedUrl, isValidVideoUrl } from './videoUtils';
  
interface TutorialsGridProps {
  tutorials?: any[];
}


const TutorialsGrid: React.FC<TutorialsGridProps> = ({ tutorials: propTutorials }) => {
  const { experience, slug, brandLogo, brandName, color } = usePublicExpStore();
  const { data: tutorialsData, isLoading, error } = useExperienceTutorials(slug);
  const featuredVideoUrl = experience?.data?.featured_video_url || '';

  // Featured video embed logic
  const renderFeaturedVideo = () => {
    if (!featuredVideoUrl || !isValidVideoUrl(featuredVideoUrl)) return null;
    const type = getVideoType(featuredVideoUrl);
    if (type === 'youtube') {
      return (
        <div className="mb-6">
          <iframe
            src={getYouTubeEmbedUrl(featuredVideoUrl) + '?autoplay=1'}
            title="Featured Video"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-64 rounded-xl shadow-lg border-none"
          />
        </div>
      );
    }
    if (type === 'vimeo') {
      return (
        <div className="mb-6">
          <iframe
            src={getVimeoEmbedUrl(featuredVideoUrl) + '?autoplay=1'}
            title="Featured Video"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-64 rounded-xl shadow-lg border-none"
          />
        </div>
      );
    }
    if (type === 'direct') {
      return (
        <div className="mb-6">
          <video src={featuredVideoUrl} autoPlay controls className="w-full h-64 rounded-xl shadow-lg" />
        </div>
      );
    }
    return null;
  };

  let tutorials: any[] = [];
  if (propTutorials) {
    tutorials = propTutorials;
  } else {
    if (isLoading) return <TutorialGridSkeleton />;
    if (error) return < div className="text-red-600">Error loading tutorials.</div>;
    tutorials = Array.isArray((tutorialsData as any).tutorials) ? (tutorialsData as any).tutorials : [];
  }
  console.log('Tutorials to display:', tutorials);
  return (
    <div>
      {renderFeaturedVideo()}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
        {tutorials.map((tutorial: any, index: number) => (
          <TutorialCard
           tutorial={tutorial}
            brandLogo={brandLogo}
            brandName={brandName}
            contextColor={color || '#1a202c'}
            key={tutorial.id || index}
          />
        ))}
      </div>
    </div>
  );
};

export default TutorialsGrid;
