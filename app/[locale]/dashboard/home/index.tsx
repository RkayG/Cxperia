'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import recentBanner2 from '@/assets/images/recent-banner2.png'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useOptimizedExperiences, useOptimizedRecentExperiences } from "@/hooks/brands/useOptimizedQueries";
import { useRecentTutorials } from "@/hooks/brands/useFeatureApi";
import { useNavigationProgressWithQuery } from '@/hooks/useNavigationProgressWithQuery';
import { getBrandStats, getCurrentUserBrand } from '@/lib/data/brands';
import { supabase } from '@/lib/supabase';
import { useExperienceStore } from '@/store/brands/useExperienceStore';
import Loading from '@/components/Loading';
import ProjectCard from "./components/ProjectCard";
import Link from "next/link";

interface Brand {
  id: string;
  name: string;
}

interface Stats {
  totalProducts: number;
  publishedExperiences: number;
  draftExperiences: number;
  todayScans: number;
}


export default function HomePage() {
  const router = useRouter();
  // Banner image loading state (must be top-level for hooks)
  const [bannerLoaded, setBannerLoaded] = React.useState(false);
  
  // Dashboard state
  const [user, setUser] = useState<any>(null);
  const { brand, setBrand } = useExperienceStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get brand from store
  const storeBrand = require('@/store/brands/useExperienceStore').useExperienceStore((state: any) => state.brand);
  
  // Conditional data fetching - only fetch when brand is available and not loading
  const { data, isLoading: isLoadingExperiences } = useOptimizedExperiences(
    brand?.id, 
    { enabled: !!brand?.id && !loading }
  );
  const { data: tutorialsData, isLoading: isLoadingTutorials } = useRecentTutorials({ 
    enabled: !loading 
  });
  
  // Use navigation progress with loading state
  const isLoading = loading || isLoadingExperiences || isLoadingTutorials;
  useNavigationProgressWithQuery(isLoading, false);
  
  // Normalize experiences array
  const experiences = Array.isArray((data as any)?.data)
    ? (data as any).data
    : Array.isArray(data)
    ? data
    : [];
  
  // Normalize tutorials array
  const tutorials = Array.isArray((tutorialsData as any)?.data)
    ? (tutorialsData as any).data
    : Array.isArray(tutorialsData)
    ? tutorialsData
    : [];

  // Search state
  const [searchQuery, setSearchQuery] = React.useState("");

  // Dashboard initialization
  useEffect(() => {
    let isMounted = true;
    
    const initializeDashboard = async () => {
      try {
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (!isMounted) return;
        
        setUser(currentUser);

        if (!currentUser) {
          router.push('/auth/login');
          return;
        }

        // Check email confirmation
        if (currentUser && !currentUser.email_confirmed_at) {
          // User is logged in but email not verified - they can stay on dashboard
          // but you might want to show a warning
          //console.log('Email not verified yet');
        }

        // Get brand data
        const brandData = await getCurrentUserBrand();
        
        if (!isMounted) return;
        
        //console.log("Current Brand in DashboardPage:", brandData);  
        if (!brandData) {
          //console.log('No brand found, redirecting to setup');
          router.push('/auth/signup');
          return;
        }
        setBrand(brandData);

        // Get stats
        const statsData = await getBrandStats(brandData.id);
        
        if (!isMounted) return;
        
        setStats(statsData);

      } catch (error) {
        //console.error('Dashboard initialization error:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeDashboard();
    
    return () => {
      isMounted = false;
    };
  }, []); // Remove dependencies to prevent re-runs

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
  // console.log('filteredExperiences:', filteredExperiences);
  //console.log('filteredTutorials:', filteredTutorials);

  if (!brand) {
    return (
      <div className="" suppressHydrationWarning>
        <Loading />
      </div>
    );
  }

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
        alt="Recent Experiences Banner"
        layout="fill"
        objectFit="cover"
        className={`rounded-xl transition-opacity duration-500 ${bannerLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setBannerLoaded(true)}
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
        <h1
          className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-700 text-transparent bg-clip-text mb-2 mt-6"
        >
          Hello, {brand?.name || storeBrand?.name || ''}
        </h1>
        <p className="text-gray-700 mb-6 max-w-sm md:max-w-xl">
          Welcome to your dashboard.
        </p>
      </div>
    </div>

    {/* Dashboard Stats Section */}
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" suppressHydrationWarning>
      <div className="px-4 py-6 sm:px-0">
        {/* Welcome Header */}
        <div className="mb-8 ">
          <h1 className="text-3xl font-bold text-gray-900 md:hidden">Welcome, {brand.name}</h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your brand today.
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden border rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats?.totalProducts || 0}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden border rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Active Experiences</dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">{stats?.publishedExperiences || 0}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden border rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Draft Experiences</dt>
              <dd className="mt-1 text-3xl font-semibold text-yellow-600">{stats?.draftExperiences || 0}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden border rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">QR Scans Today</dt>
              <dd className="mt-1 text-3xl font-semibold text-blue-600">{stats?.todayScans || 0}</dd>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/dashboard/products"
                className="group p-4 border rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <span className="text-purple-600">📦</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Manage Products</h3>
                    <p className="text-sm text-gray-500">Add and edit your products</p>
                  </div>
                </div>
              </Link>
              <Link href="/dashboard/experience/create?step=product-details&new=true" 
                className="group p-4 border rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <FaPlus />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Create Experiences</h3>
                    <p className="text-sm text-gray-500">Build digital experiences</p>
                  </div>
                </div>
              </Link>
              <Link href="/dashboard/content"
                className="group p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <span className="text-blue-600">📚</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Create Tutorials</h3>
                    <p className="text-sm text-gray-500">Build and manage your tutorials</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
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
          className="w-full px-4 md:px-6 py-2 md:py-3 pr-10 md:pr-12 rounded-full border border-gray-300 md:border-gray-400 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 lg:bg-purple-500 lg:text-white text-gray-700 rounded-full hover:bg-purple-600 transition-colors"
          // No searchActive needed
        >
          <FaSearch />
        </button>
      </div>

      {/* Recent Experiences Carousel (shadcn) */}
      <div className="w-full px-4">
        <div className="flex items-center px-2 justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Recent Experiences</h2>
        </div>
        <Carousel className="w-full">
          <CarouselContent className="flex md:gap-4 gap-2 pb-4 -ml-4">
            {isLoadingExperiences ? (
              Array.from({ length: 4 }).map((_, i) => (
                <CarouselItem key={i} className="pl-4 basis-[260px]">
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
                <CarouselItem className="pl-4 basis-[260px]">
                  <ProjectCard type="product experience" isCreateCard />
                </CarouselItem>
                {filteredExperiences.map((exp: any) => {
                  // Access nested products data
                  const product = exp.products;
                  let imageUrl = Array.isArray(product?.product_image_url)
                    ? product.product_image_url[0]
                    : product?.product_image_url;
                  if (!imageUrl || imageUrl === "") {
                    imageUrl = product?.logo_url || undefined;
                  }
                  return (
                    <CarouselItem key={String(exp.id)} className="pl-4 basis-[260px]">
                      <ProjectCard
                        id={exp.id}
                        type="product experience"
                        title={product?.name || exp.name || `Project ${exp.id}`}
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
          <Link href="/dashboard/products">
          <button
            className="px-6 py-2 bg-gray-100 rounded-none w-full sm:w-auto border border-gray-300 sm:rounded-full text-gray-700 hover:text-white rounded-full font-semibold hover:bg-purple-800 transition-all"
          >
            See All Experiences
          </button>
          </Link>
        </div>
      </div>

      {/* Recent Tutorials Carousel (shadcn) */}
      <div className="w-full px-4 mt-12">
        <div className="flex items-center px-2 justify-between mb-4">
          <h2 className="ml-1 text-lg sm:text-xl font-semibold text-gray-800">Recent Tutorials</h2>
        </div>
        <Carousel className="w-full">
          <CarouselContent className="flex md:gap-4 gap-2 pb-4 -ml-4">
            {isLoadingTutorials ? (
              Array.from({ length: 4 }).map((_, i) => (
                <CarouselItem key={i} className="pl-4 basis-[260px]">
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
                <CarouselItem className="pl-4 basis-[260px]">
                  <ProjectCard type="tutorial" isCreateCard />
                </CarouselItem>
                {filteredTutorials.map((tut: any) => {
                  // Use featured_image and featured_video_url from the data structure
                  let imageUrl = tut.featured_image;
                  if (!imageUrl || imageUrl === "") {
                    imageUrl = tut.thumbnail_url || undefined;
                  }
                
                  return (
                    <CarouselItem key={String(tut.id)} className="pl-4 basis-[260px]">
                      <ProjectCard
                        id={tut.id}
                        type="tutorial"
                        title={tut.title}
                        imageUrl={imageUrl}
                        videoUrl={tut.featured_video_url || tut.video_url || undefined}
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
          <Link href="/dashboard/content">  
          <button
            className="px-6 py-2 w-full sm:w-auto rounded-none sm:rounded-full bg-gray-100 border border-gray-300 text-gray-700 hover:text-white rounded-md font-semibold hover:bg-purple-800 transition-all"
          >
            See All Tutorials
          </button>
          </Link>
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
