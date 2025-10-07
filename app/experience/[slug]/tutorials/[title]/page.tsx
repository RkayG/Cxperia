'use client';
import {
  Calendar,
  Clock,
  Play,
  Star,
  Tag,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useExperienceTutorials, useTutorialById } from "@/hooks/public/useTutorials";
import { usePublicExpStore } from "@/store/public/usePublicExpStore";
import { getFriendlyTimeAgo } from "@/utils/friendlyTime";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useState } from "react";

interface TutorialStep {
  id?: string | number;
  stepNumber?: number;
  title?: string;
  description?: string;
  duration?: string;
  products?: Array<{
    id?: string | number;
    name?: string;
    brand?: string;
    category?: string;
    amount?: string;
    imageUrl?: string;
  }>;
  tips?: string[];
  imageUrl?: string;
  videoUrl?: string;
  [key: string]: any;
}

interface TutorialDetail {
  id: string | number;
  title?: string;
  featured_video_url?: string;
  description?: string;
  brandName?: string;
  publishedAt?: string;
  views?: string | number;
  steps?: TutorialStep[] | string[];
  featured_image?: string;
  thumbnail_url?: string;
  total_duration?: string;
  category?: string;
  difficulty?: string;
  occasions?: string[];
  skin_types?: string[];
  tags?: string[];
  updated_at?: string;
}

// Tutorial Detail Skeleton Component
const TutorialDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen mt-4 max-w-xl mx-auto pb-6 bg-gray-50">
      <div className="md:max-w-4xl mx-auto md:px-6 pb-8">
        <div className="md:bg-white md:rounded-2xl md:shadow-lg overflow-hidden">
          {/* Featured Image/Video Skeleton */}
          <div className="h-64 md:h-96">
            <Skeleton className="w-full h-full" />
          </div>

          {/* Title and Meta Info Skeleton */}
          <div className="p-6 rounded-t-4xl md:-mt-8 md:bg-white md:relative md:z-10">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-8 w-3/4 mb-3" />
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>

            {/* Stats Skeleton */}
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center">
                <Skeleton className="h-4 w-4 mr-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            {/* Occasions Skeleton */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Skeleton className="h-4 w-4 mr-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
            </div>
          </div>

          {/* Description Skeleton */}
          <div className="px-6 pb-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Steps Section Skeleton */}
          <div className="p-0">
            <div className="px-6 pt-6">
              <Skeleton className="h-8 w-48 mb-6" />
            </div>
            
            {/* Steps Skeleton */}
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={index !== 2 ? "border-b border-gray-200" : ""}>
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <Skeleton className="h-6 w-48" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  
                  {/* Step Media Skeleton */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Skeleton className="w-full h-48 rounded-lg" />
                  </div>
                  
                  {/* Pro Tips Skeleton */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <Skeleton className="h-5 w-5 mr-2" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Sticky Footer Skeleton */}
      <div className="sticky bottom-0 w-full z-500 bg-white border-t border-gray-200 p-4">
        <Skeleton className="w-full h-12 rounded-lg" />
      </div>
    </div>
  );
};

const TutorialDetailPage: React.FC = () => {
  const { title: urlTitle } = useParams<{ title: string }>();
  const _router = useRouter();
  const { color, slug, brandLogo, brandName } = usePublicExpStore();
  let tutorial: TutorialDetail | undefined;
  
  // Extract tutorial ID from URL parameter (format: "tutorial-slug-uuid")
  // UUIDs contain dashes, so we need to find the UUID pattern
  const tutorialId = urlTitle ? (() => {
    // UUID pattern: 8-4-4-4-12 characters
    const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const match = urlTitle.match(uuidPattern);
    return match ? match[0] : null;
  })() : null;
  
  // Client-side friendly time state to prevent hydration mismatch
  const [friendlyTime, setFriendlyTime] = useState('');

  // If not present, fetch from experience tutorials or by ID
  const { data: tutorialsData, isLoading: isLoadingTutorials } = useExperienceTutorials(slug);
  const { data: tutorialData, isLoading: isLoadingTutorial } = useTutorialById(tutorialId || '');
  console.log('tutorialData', tutorialData);

  const tutorials = Array.isArray((tutorialsData as any)?.tutorials)
    ? (tutorialsData as any).tutorials
    : [];
    
  // Try to get tutorial from experience tutorials first, then by ID
  if (!tutorial && tutorialId && tutorials.length > 0) {
    tutorial = tutorials.find((t: any) => String(t.id) === String(tutorialId));
  }
  
  // If still not found, try fetching by ID
  if (!tutorial && tutorialId && (tutorialData as any)?.success) {
    tutorial = (tutorialData as any).tutorial;
    console.log('tutorial from useTutorialById', tutorial);
  }
  
  // Extract tutorial data using backend fields directly
  const title = tutorial?.title || "";
  const description = tutorial?.description || "";
  const featuredVideoUrl = tutorial?.featured_video_url || "";
  const featuredImage = tutorial?.featured_image || "";
  const publishedAt = tutorial?.updated_at || "";
  
  // Parse steps from JSON string if it exists
  let steps: TutorialStep[] = [];
  if (tutorial?.steps) {
    try {
      if (typeof tutorial.steps === 'string') {
        const parsedSteps = JSON.parse(tutorial.steps);
        if (Array.isArray(parsedSteps)) {
          steps = parsedSteps as TutorialStep[];
        }
      } else if (Array.isArray(tutorial.steps)) {
        // Check if it's already TutorialStep[] or string[]
        if (tutorial.steps.length > 0 && typeof tutorial.steps[0] === 'object') {
          steps = tutorial.steps as TutorialStep[];
        }
      }
    } catch (error) {
      console.warn('Error parsing tutorial steps:', error);
      steps = [];
    }
  }
  
  const category = tutorial?.category || "";
  const skinTypes: string[] = tutorial?.skin_types || [];
  const occasions: string[] = tutorial?.occasions || [];
  const tags: string[] = tutorial?.tags || [];
  
  // Calculate friendly time on client side only to prevent hydration mismatch
  useEffect(() => {
    if (publishedAt) {
      setFriendlyTime(getFriendlyTimeAgo(publishedAt));
    }
  }, [publishedAt]);
  if (!tutorial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Tutorial not found.
      </div>
    );
  }
  if (isLoadingTutorials || isLoadingTutorial) {
    return <TutorialDetailSkeleton />;
  }

  // Helper: Video embed
  const renderVideoEmbed = (url: string) => {
    if (!url) return null;
    const youtubeMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    if (youtubeMatch) {
      return (
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
            title="Tutorial Video"
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      );
    }
    return (
      <div className="relative aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Play className="w-12 h-12 text-purple-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Video: {url}</p>
        </div>
      </div>
    );
  };

  // Steps normalization for summary
  const realSteps = Array.isArray(steps)
    ? steps.filter(
        (step) =>
          (step.title && step.title.trim()) ||
          (step.description && step.description.trim()) ||
          (Array.isArray(step.products) && step.products.length > 0) ||
          (Array.isArray(step.tips) &&
            step.tips.some((tip: string) => tip.trim()))
      )
    : [];


  return (
    <div className="min-h-screen mt-4 max-w-xl mx-auto pb-6 bg-gray-50">
      <div className="md:max-w-4xl mx-auto md:px-6 pb-8">
        <div className="md:bg-white md:rounded-2xl md:shadow-lg overflow-hidden">
          {/* Featured Image/Video */}
          {featuredVideoUrl ? (
            <div className="p-6 pb-0">{renderVideoEmbed(featuredVideoUrl)}</div>
          ) : featuredImage ? (
            <div className="h-64 md:h-96 relative overflow-hidden">
              <Image
                src={featuredImage}
                alt={title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          ) : (
            <div className="h-64 md:h-96 flex items-center justify-center bg-gray-100 text-gray-500 text-lg font-semibold rounded-t-2xl">
              No featured image or video
            </div>
          )}

          {/* Title and Meta Info */}
          <div
            className="p-6 rounded-t-4xl md:-mt-8  md:bg-white  md:relative md:z-10"
            style={{
              borderTopLeftRadius: "2rem",
              borderTopRightRadius: "2rem",
            }}
          >
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500 uppercase font-medium">
                  {category}
                </span>
              </div>
              <h1
                className="text-2xl md:text-4xl text-left font-bold text-black leading-tight mb-3"
                style={{ fontFamily: "Mozilla Headline, sans-serif" }}
              >
                {title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="w-12 h-12 bg-gray-100 rounded-full">
                  {brandLogo ? (
                   <Image src={brandLogo} alt={brandName || "Cxperia"} width={48} height={48} className="w-full h-full object-contain p-2 rounded-full" />
                  ) : null}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-medium text-black">
                      {brandName || tutorial?.brandName || ""}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <span>{friendlyTime || 'Loading...'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-black" />
                <span>{skinTypes?.join(", ")}</span>
              </div>
            </div>

            {/* Occasions */}
            {occasions?.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 mr-2 text-black" />
                  <span className="text-sm font-medium text-gray-700">
                    Perfect for:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {occasions.map((occasion, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-black text-sm rounded-full"
                    >
                      {occasion}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="px-6 pb-2">
            <p
              className="text-gray-700 text-lg leading-relaxed text-left"
              style={{ fontFamily: "Tahoma" }}
            >
              {description}
            </p>
          </div>

          {/* Steps Section */}
          <div className="p-0">
            <h2
              className="text-2xl font-bold text-black mb-6 px-6 pt-6"
              style={{ fontFamily: "Mozilla Headline, sans-serif" }}
            >
              Tutorial Steps
            </h2>
            {realSteps.length > 0 ? (
              realSteps.map((step: any, index: number) => (
                <div
                  key={step.id || index}
                  className={
                    index !== realSteps.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }
                >
                  {step.duration && (
                    <span className="px-3 py-1 m-1.5 bg-orange-100 float-right text-orange-700 text-sm font-medium rounded-full">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {step.duration}
                    </span>
                  )}
                  <div className="p-6">
                    {/* Step Header */}
                    <div className="flex items-start gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex gap-3 items-center">
                            <div
                              className="flex-shrink-0 w-12 h-12  text-white rounded-full flex items-center justify-center font-bold text-lg"
                              style={{ backgroundColor: color || "#8A2BE2" }}
                            >
                              {step.stepNumber || index + 1}
                            </div>
                            <h3
                              className="md:text-xl text-left text-md font-semibold text-black"
                              style={{
                                fontFamily: "Mozilla Headline, sans-serif",
                              }}
                            >
                              {step.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p
                        className="text-gray-700 leading-relaxed text-left"
                        style={{ fontFamily: "Tahoma" }}
                      >
                        {step.description}
                      </p>
                    </div>

                    {/* Step Media */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {step.imageUrl && (
                        <div className="rounded-lg overflow-hidden">
                          <img
                            src={step.imageUrl}
                            alt={`Step ${step.stepNumber}`}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}
                      {step.videoUrl && (
                        <div className="rounded-lg overflow-hidden">
                          {renderVideoEmbed(step.videoUrl)}
                        </div>
                      )}
                    </div>

                    {/* Products Used */}
                    {Array.isArray(step.products) &&
                      step.products.length > 0 && (
                        <div className="mb-6">
                          <h4
                            className="text-lg font-semibold text-black mb-3"
                            style={{
                              fontFamily: "Mozilla Headline, sans-serif",
                            }}
                          >
                            Products Used
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {step.products.map((product: any) => (
                              <div
                                key={product.id}
                                className="bg-gray-50 rounded-lg p-3 flex flex-col items-center"
                              >
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-16 h-16 object-cover rounded-full mb-2"
                                />
                                <div className="text-xs font-semibold text-black mb-1">
                                  {product.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {product.brand}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {product.category}
                                </div>
                                {product.amount && (
                                  <div className="text-xs text-gray-400">
                                    {product.amount}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Pro Tips */}
                    {Array.isArray(step.tips) &&
                      step.tips.some((tip: string) => tip.trim()) && (
                        <div className="bg-gradient-to-r text-left from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                            <Star className="w-5 h-5 mr-2" />
                            Pro Tips
                          </h4>
                          <ul className="space-y-2">
                            {step.tips
                              .filter((tip: string) => tip.trim())
                              .map((tip: string, tipIndex: number) => (
                                <li
                                  key={tipIndex}
                                  className="text-green-700 flex items-start"
                                >
                                  <span className="text-green-500 mr-2 flex-shrink-0">
                                    •
                                  </span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No steps created yet. Add steps to help your customers follow
                along.
              </div>
            )}
          </div>

          {/* Tags */}
          {tags?.length > 0 && (
            <div className="mb-6 ml-6 mr-6">
              <div className="flex items-center mb-2">
                <Tag className="w-4 h-4 mr-2 text-black" />
                <span className="text-sm font-medium text-gray-700">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-50 text-black text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Sticky Footer */}
      <div className="sticky bottom-0 w-full z-500 bg-white border-t border-gray-200 p-4">
        <button
          onClick={() => _router.back()}
          className="w-full py-3 text-sm font-medium rounded-lg transition"
          style={{ backgroundColor: color, color: "white" }}
        >
          ← Back to Tutorials
        </button>
      </div>
    </div>
  );
};

export default TutorialDetailPage;
