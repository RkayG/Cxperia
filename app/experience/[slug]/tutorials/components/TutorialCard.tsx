'use client'
import React, { useState, useCallback } from 'react';
import { getVideoType, getYouTubeEmbedUrl, getVimeoEmbedUrl, isValidVideoUrl } from './videoUtils';
import { useRouter } from 'next/navigation';
import { Play, Clock, List, MoreVertical } from 'lucide-react';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';
import { getFriendlyTimeAgo } from '@/utils/friendlyTime';
import { useIncrementTutorialView } from '@/hooks/public/useTutorialViews';

export interface TutorialDetail {
  id: string;
  title: string;
  featured_video_url?: string;
  total_duration: string;
  steps: string | string[];
  brandLogo: string;
  brandName: string;
  views: string;
  updated_at: string;
  verified?: boolean;
  video_url?: string;
  description?: string;
  featured_image?: string;
  thumbnail_url?: string;
}

interface TutorialCardProps {
  tutorial: TutorialDetail;
  brandLogo?: string;
  brandName?: string;
  contextColor?: string;
}

const TutorialCard: React.FC<TutorialCardProps> = ({ tutorial, brandLogo, brandName }) => {
  const {
    id,
    title,
    total_duration,
    steps,
    featured_video_url,
    video_url,
    views,
    updated_at,
    verified = false,
    featured_image,
    thumbnail_url,
  } = tutorial;

  const [isHovered, setIsHovered] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);

  const router = useRouter();
  const incrementViewMutation = useIncrementTutorialView();
  
  // Use stable selectors to prevent infinite re-renders
  const colorSelector = useCallback((state: any) => state.color, []);
  const slugSelector = useCallback((state: any) => state.slug, []);
  
  const color = usePublicExpStore(colorSelector);
  const slug = usePublicExpStore(slugSelector);
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with -
      .replace(/^-+|-+$/g, '');    // trim leading/trailing -

  const handleCardClick = async () => {
    try {
      // Increment view count before navigation
      await incrementViewMutation.mutateAsync(id);
    } catch (error) {
      // Don't block navigation if view tracking fails
      console.warn('Failed to track view:', error);
    }
    
    // Navigate to tutorial detail page
    const tutorialSlug = slugify(title || '');
    router.push(`/experience/${slug}/tutorials/${tutorialSlug}-${id}`);
  };

  // Prioritize video over image
  const videoSrc = featured_video_url || video_url || '';
  const hasVideo = isValidVideoUrl(videoSrc);
  const imageSrc = featured_image || thumbnail_url || 'https://placehold.co/640x360/8A2BE2/FFFFFF?text=Tutorial+Thumbnail';

  // Render video using videoUtils
  let mediaPreview;
  if (hasVideo) {
    const videoType = getVideoType(videoSrc);
    if (videoType === 'youtube') {
      mediaPreview = (
        <iframe
          src={getYouTubeEmbedUrl(videoSrc)}
          title={title}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${mediaLoaded ? 'opacity-100' : 'opacity-0'}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          frameBorder={0}
          onLoad={() => setMediaLoaded(true)}
        />
      );
    } else if (videoType === 'vimeo') {
      mediaPreview = (
        <iframe
          src={getVimeoEmbedUrl(videoSrc)}
          title={title}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${mediaLoaded ? 'opacity-100' : 'opacity-0'}`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          frameBorder={0}
          onLoad={() => setMediaLoaded(true)}
        />
      );
    } else if (videoType === 'direct') {
      mediaPreview = (
        <video
          src={videoSrc}
          poster={imageSrc}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${mediaLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoadedData={() => setMediaLoaded(true)}
          onError={(e) => { e.currentTarget.poster = imageSrc; }}
          controls={false}
          muted
          playsInline
        />
      );
    } else {
      // Fallback to image if video type is unknown
      mediaPreview = (
        <img
          src={imageSrc}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${mediaLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setMediaLoaded(true)}
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/640x360/8A2BE2/FFFFFF?text=Tutorial+Thumbnail'; }}
        />
      );
    }
  } else {
    mediaPreview = (
      <img
        src={imageSrc}
        alt={title}
        className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${mediaLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setMediaLoaded(true)}
        onError={(e) => { e.currentTarget.src = 'https://placehold.co/640x360/8A2BE2/FFFFFF?text=Tutorial+Thumbnail'; }}
      />
    );
  }

  return (
    <div 
      className="bg-white rounded-lg mx-3 shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      {/* Media Preview: Video prioritized over image */}
      <div className="relative aspect-video bg-gray-200 overflow-hidden">
        {mediaPreview}

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium flex items-center space-x-1">
          <Clock size={10} />
          <span>{total_duration}</span>
        </div>

        {/* Steps Badge */}
        <div
          className="absolute bottom-2 left-2 text-white text-xs px-2 py-1 rounded font-medium flex items-center space-x-1"
          style={{ background: color, opacity: 0.9 }}
        >
          <List size={10} />
          <span>
            {(() => {
              try {
                // If steps is already an array
                if (Array.isArray(steps)) {
                  const num = steps.length;
                  return num === 1 ? '1 step' : `${num} steps`;
                }
                
                // If steps is a JSON string, parse it
                if (typeof steps === 'string' && steps.trim().startsWith('[')) {
                  const parsedSteps = JSON.parse(steps);
                  if (Array.isArray(parsedSteps)) {
                    const num = parsedSteps.length;
                    return num === 1 ? '1 step' : `${num} steps`;
                  }
                }
                
                // If steps is a string with number (legacy format)
                if (typeof steps === 'string') {
                  const num = Number(steps.split(' ')[0]);
                  if (num === 1) return '1 step';
                  if (num > 1) return `${num} steps`;
                }
                
                // Fallback
                return '0 steps';
              } catch (error) {
                console.warn('Error parsing steps:', error);
                return '0 steps';
              }
            })()}
          </span>
        </div>

        {/* Play Button Overlay: only for video */}
        {hasVideo && (
          <div 
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="bg-black/60 rounded-full p-4 transform transition-transform duration-200 hover:scale-110">
              <Play size={32} className="text-white fill-current ml-1" />
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {!mediaLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        )}
      </div>

  {/* Video Info */}
      <div className="p-3">
        <div className="flex space-x-3">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <div className="flex justify-center ">
              <div className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg overflow-hidden">
                {brandLogo ? (
                  <img
                    src={brandLogo}
                    alt={brandName || 'Brand Logo'}
                    className="w-7 h-7 object-contain"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <span className="text-slate-700 font-bold text-sm tracking-wide">LOGO</span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 
              className="font-semibold text-left text-gray-900 text-sm leading-5 mb-1 line-clamp-2 transition-colors"
              style={isHovered ? { color: color } : {}}
              title={title}
            >
              {title}
            </h3>
            
            <div className="flex items-center space-x-1 text-xs text-gray-600 mb-1">
              <span className="hover:text-gray-900 transition-colors cursor-pointer">
                {brandName}
              </span>
              {verified && (
                <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <span>{views}</span>
              <span>•</span>
              <span>{getFriendlyTimeAgo(updated_at)}</span>
            </div>
          </div>

          {/* More Options */}
          <div className={`flex-shrink-0 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
              <MoreVertical size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Action Button */}
        {/*
        <div className="mt-3">
          <button
            className="w-full text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            style={{ background: contextColor }}
          >
            <Play size={14} className="fill-current" />
            <span>Watch</span>
          </button>
        </div>
        */}
      </div>
    </div>
  );
};

export default TutorialCard;