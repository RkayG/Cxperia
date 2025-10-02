// app/experience/[slug]/layout.tsx
'use client';
import React, { useEffect } from 'react';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';
import { useParams, usePathname } from 'next/navigation';
import logo from '@/assets/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { Footer } from '@/components/footer';
import { useIncrementScanCount, shouldCountScan, markScanCounted } from '@/hooks/public/useScanTracking';

export default function ExperienceSlugLayout({ children }: { children: React.ReactNode }) {
  const fetchExperience = usePublicExpStore((state) => state.fetchExperience);
  const isLoading = usePublicExpStore((state) => state.isLoading);
  const error = usePublicExpStore((state) => state.error);
  const experience = usePublicExpStore((state) => state.experience);
  const params = useParams();
  const pathname = usePathname();
  const incrementScanMutation = useIncrementScanCount();
  // Try to extract slug robustly for both /experience/[slug] and /experience/[slug]/subpage
  let slug = '';
  if (typeof params?.slug === 'string') {
    slug = params.slug;
  } else if (Array.isArray(params?.slug) && params.slug.length > 0) {
    slug = params.slug[0] ?? '';
  } else {
    // Fallback: extract from pathname if possible
    const match = pathname?.match(/\/experience\/([^/]+)/);
    if (match && match[1]) {
      slug = match[1];
    }
  }

  useEffect(() => {
    if (slug) {
      console.log("Fetching experience for slug:", slug);
      fetchExperience(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, fetchExperience]);

  // Track scan count when experience is successfully loaded
  useEffect(() => {
    if (slug && experience && !isLoading && !error) {
      // Only count scan if it should be counted for this session
      if (shouldCountScan(slug)) {
        console.log("📊 Tracking scan for experience:", slug);
        
        incrementScanMutation.mutateAsync(slug)
          .then(() => {
            // Mark scan as counted for this session
            markScanCounted(slug);
            console.log("✅ Scan count incremented successfully");
          })
          .catch((error) => {
            console.warn("⚠️ Failed to track scan:", error);
            // Don't block the user experience if scan tracking fails
          });
      } else {
        console.log("⏭️ Scan already counted for this session, skipping");
      }
    }
  }, [slug, experience, isLoading, error, incrementScanMutation]);

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-red-600 bg-white">
        Invalid product link. No slug provided.
      </div>
    );
  }

  
  if (error === 'not_found') {
    console.log("Experience not found for slug:", slug);
    return (
        <>
      <div className="min-h-screen flex items-center justify-center text-center bg-white">
        <div>
            <Link href="/">
              <Image src={logo} alt="Cxperia Logo" className="w-48 mb-8 mx-auto" />
            </Link>
          <div className="text-3xl font-bold text-blue-700 mb-4 animate-pulse">Experience Not Found</div>
          <div className="text-lg text-gray-500">Sorry, this product experience does not exist or is no longer available.</div>
        </div>
       
      </div>
       <Footer />
      </>
    );
  }

  // Removed loading state - experience will load in background


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-red-600 bg-white">
        {error}
      </div>
    );
  }

  return <>{children}</>;
}
