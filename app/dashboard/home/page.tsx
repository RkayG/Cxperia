'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { FaSearch } from "react-icons/fa";
import { useExperiences } from "@/hooks/brands/useExperienceApi";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectCard from "./components/ProjectCard";
import { useRecentTutorials } from "@/hooks/brands/useFeatureApi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import recentBanner2 from '@/assets/images/recent-banner2.png'


export default function RecentPage() {
  const { data, isLoading: isLoadingExperiences } = useExperiences();
  const router = useRouter();
  // Banner image loading state (must be top-level for hooks)
  const [bannerLoaded, setBannerLoaded] = React.useState(false);
  // Get brand from store
  const brand = require('@/store/brands/useExperienceStore').useExperienceStore((state: any) => state.brand);
  // Normalize experiences array
  const experiences = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];
  // Fetch recent tutorials (must be inside the component)
  const { data: tutorialsData, isLoading: isLoadingTutorials } = useRecentTutorials();
  console.log("Fetched recent tutorials data:", tutorialsData);
  const tutorials = Array.isArray(tutorialsData?.data)
    ? tutorialsData.data
    : Array.isArray(tutorialsData)
    ? tutorialsData
    : [];

  // Search state
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filtered results
  const filteredExperiences = searchQuery.trim()
    ? experiences.filter((exp: any) => {
        const val = (exp.name || exp.title || "").toLowerCase();
        return val.includes(searchQuery.trim().toLowerCase());
      })
    : experiences;
  const filteredTutorials = searchQuery.trim()
    ? tutorials.filter((tut: any) => {
        const val = (tut.title || tut.name || "").toLowerCase();
        return val.includes(searchQuery.trim().toLowerCase());
      })
    : tutorials;


  // Debug logs for filtered results
  console.log('filteredExperiences:', filteredExperiences);
  console.log('filteredTutorials:', filteredTutorials);

  // Example data for top scans (replace with real API data)
/*   const topScansData = [
    {
      id: "1",
      productName: "HydraGlow Serum",
      imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=400&q=80",
      scanCount: 42,
      lastScan: "2025-09-14 15:32",
    },
    {
      id: "2",
      productName: "Radiant Cleanser",
      imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80",
      scanCount: 35,
      lastScan: "2025-09-13 10:21",
    },
    {
      id: "3",
      productName: "Night Repair Cream",
      imageUrl: "https://images.unsplash.com/photo-1602488257133-58d5fc939286?auto=format&fit=crop&w=400&q=80",
      scanCount: 28,
      lastScan: "2025-09-12 19:05",
    },
  ]; */

  return (
    <>
    <div className="relative w-[90%] mx-auto mt-4 mb-8 hidden md:block h-32">
      {!bannerLoaded && (
        <div className="absolute inset-0 z-0">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
      )}
      <Image
        src={recentBanner2}
        alt="Banner"
        className="rounded-xl w-full h-full object-cover"
        fill={false}
        onLoad={() => setBannerLoaded(true)}
        style={{ display: bannerLoaded ? 'block' : 'none' }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
        <h1
          className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-700 text-transparent bg-clip-text mb-2 mt-6"
        >
          Hello, {brand?.name || 'Brand'}
        </h1>
        <p className="text-gray-700 mb-6 max-w-sm md:max-w-xl">
          View your latest product experiences and tutorials.
        </p>
      </div>
    </div>
    <div className="mb-24 min-h-screen">

      <div className="w-full max-w-xs mb-12 mt-12 md:mt-auto mx-auto md:max-w-xl relative">
        <input
          type="text"
          placeholder="Search project"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          // No searchActive needed
          className="w-full px-4 md:px-6 py-2 md:py-3 pr-10 md:pr-12 rounded-full border border-gray-300 md:border-gray-600 text-gray-900 shadow-sm md:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 lg:bg-purple-500 lg:text-white text-gray-700 rounded-full hover:bg-purple-600 transition-colors"
          // No searchActive needed
        >
          <FaSearch />
        </button>
      </div>

      {/* Recent Experiences Carousel (shadcn) */}
      <div className="mx-auto px-4 max-w-screen-lg recent-carousel-section">
        <div className="flex items-center px-2 justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Recent Experiences</h2>
        </div>
        <Carousel className="relative  max-w-screen-lg ">
          <CarouselContent className="flex gap-2 pb-4">
            {isLoadingExperiences ? (
              Array.from({ length: 4 }).map((_, i) => (
                <CarouselItem key={i} style={{ minWidth: 260, maxWidth: 260 }}>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-40 w-full mb-2" />
                    <Skeleton className="h-5 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-1/2 mb-1" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CarouselItem>
              ))
            ) : (
              <>
                <CarouselItem style={{ minWidth: 260, maxWidth: 260 }}>
                  <ProjectCard type="product experience" isCreateCard />
                </CarouselItem>
                {filteredExperiences.map((exp: any) => {
                  let imageUrl = Array.isArray(exp.product_image_url)
                    ? exp.product_image_url[0]
                    : exp.product_image_url;
                  if (!imageUrl || imageUrl === "") {
                    imageUrl = exp.logo_url || undefined;
                  }
                  return (
                    <CarouselItem key={String(exp.id)} style={{ minWidth: 260, maxWidth: 260 }}>
                      <ProjectCard
                        id={exp.id}
                        type="product experience"
                        title={exp.name || exp.title || `Project ${exp.id}`}
                        imageUrl={imageUrl}
                        qr_code_url={exp.qr_code_url}
                      />
                    </CarouselItem>
                  );
                })}
              </>
            )}
          </CarouselContent>
      {/*     <CarouselPrevious className="-left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="-right-4 top-1/2 -translate-y-1/2" /> */}
        </Carousel>
        {/* See All Products Button */}
        <div className="flex justify-center mb-12 md:mb-auto mt-4">
          <button
            className="px-6 py-2 bg-gray-100 rounded-none w-full sm:w-auto sm:rounded-full text-gray-700 hover:text-white rounded-full font-semibold shadow hover:bg-purple-800 transition-all"
              onClick={() => router.push('/dashboard/overview')}
          >
            See All Experiences
          </button>
        </div>
      </div>

      {/* Recent Tutorials Carousel (shadcn) */}
      <div className="mx-auto px-4 max-w-screen-lg  mt-12 recent-carousel-section">
        <div className="flex items-center px-2 justify-between mb-4">
          <h2 className="ml-1 text-lg sm:text-xl font-semibold text-gray-800">Recent Tutorials</h2>
        </div>
        <Carousel className="relative max-w-screen-lg ">
          <CarouselContent className="flex gap-2 pb-4">
            {isLoadingTutorials ? (
              Array.from({ length: 4 }).map((_, i) => (
                <CarouselItem key={i} style={{ minWidth: 260, maxWidth: 260 }}>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-40 w-full mb-2" />
                    <Skeleton className="h-5 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-1/2 mb-1" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CarouselItem>
              ))
            ) : (
              <>
                <CarouselItem style={{ minWidth: 260, maxWidth: 260 }}>
                  <ProjectCard type="tutorial" isCreateCard />
                </CarouselItem>
                {filteredTutorials.map((tut: any) => {
                  let imageUrl = tut.thumbnail_url;
                  if (!imageUrl || imageUrl === "") {
                    imageUrl = tut.featured_image || tut.imageUrl || undefined;
                  }
                  return (
                    <CarouselItem key={String(tut.id)} style={{ minWidth: 260, maxWidth: 260 }}>
                      <ProjectCard
                        id={tut.id}
                        type="tutorial"
                        title={tut.title}
                        imageUrl={imageUrl}
                        videoUrl={
                          tut.video_url ||
                          tut.videoUrl ||
                          (tut.videoData && tut.videoData.url) ||
                          tut.url
                        }
                      />
                    </CarouselItem>
                  );
                })}
              </>
            )}
          </CarouselContent>
        {/*   <CarouselPrevious className="-left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="-right-4 top-1/2 -translate-y-1/2" /> */}
        </Carousel>
        {/* See All Tutorials Button */}
        <div className="flex justify-center mt-4 mb-16 ">
          <button
            className="px-6 py-2 w-full sm:w-auto rounded-none sm:rounded-full bg-gray-100 text-gray-700 hover:text-white rounded-md font-semibold shadow hover:bg-purple-800 transition-all"
              onClick={() => router.push('/dashboard/overview')}
          >
            See All Tutorials
          </button>
        </div>
      </div>

      {/* Insights Section: Top Scans and Metrics */}
      <div className="mx-auto px-4 max-w-6xl mt-16">
        {/* <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Insights (Last 7 Days)</h2>
          <p className="text-gray-600 text-md mb-4">See your most scanned products and recent activity.</p>
        </div> */}
       {/*  <TopScans scans={topScansData} /> */}
        {/* You can add more metrics or charts here as needed */}
      </div>

  
      <style>{`
        .recent-carousel-section {
          max-width: 100vw;
          width: 100vw;
          overflow: hidden;
        }
      
        @media (min-width: 1024px) {
          .recent-carousel-section {
            max-width: calc(100vw - 16rem);
            width: calc(100vw - 16rem);
          }
        }
        .hide-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome/Safari/Webkit */
        }
      `}</style>
    </div>
    </>
  );
}
