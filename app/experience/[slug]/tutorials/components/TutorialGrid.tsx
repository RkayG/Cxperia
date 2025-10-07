// src/components/TutorialsGrid.tsx
import React from 'react';

import { usePublicExpStore } from '@/store/public/usePublicExpStore';
import TutorialCard from './TutorialCard';
import { getVideoType, getVimeoEmbedUrl, getYouTubeEmbedUrl, isValidVideoUrl } from './videoUtils';
  
interface TutorialsGridProps {
  tutorials?: any[];
}


const TutorialsGrid: React.FC<TutorialsGridProps> = ({ tutorials: propTutorials }) => {
  const { experience, slug, brandLogo, brandName, color } = usePublicExpStore();
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

  // Use tutorials from props if provided, otherwise show empty state
  const tutorials: any[] = propTutorials || [];
 // console.log('Tutorials to display:', tutorials);
  return (
    <div>
      {renderFeaturedVideo()}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
        {tutorials.map((tutorial: any, index: number) => (
          <TutorialCard
           tutorial={tutorial}
            contextColor={color || '#1a202c'}
            key={tutorial.id || index}
          />
        ))}
      </div>
    </div>
  );
};

export default TutorialsGrid;
