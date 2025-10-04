//// src/pages/ProductDashboard.tsx
//'use client';
//import { Camera, Clock, Play } from 'lucide-react';
//import { usePathname, useRouter } from 'next/navigation';
//import React, { useEffect } from 'react';
//import { useOptimizedExperiences } from '@/hooks/brands/useOptimizedQueries';
//import ProductListings from './components/ProductListings';
//import ProductPerformanceOverview from './components/ProductPerformanceOverview';
//import type { PerformanceMetric, Product } from './components/productTypes';
//
//const ProductDashboard: React.FC = () => {
//  // Get brand from store for conditional fetching
//  const brand = require('@/store/brands/useExperienceStore').useExperienceStore((state: any) => state.brand);
//  
//  // Fetch experiences as products with proper caching
//  const { data: experiencesRaw, isLoading: isLoadingExperiences } = useOptimizedExperiences(
//    brand?.id,
//    { enabled: !!brand?.id }
//  );
//  const pathname = usePathname();
//  // Remove context usage; use localStorage directly or zustand if needed
// //console.log('Experiences fetched:', experiencesRaw);
//  // On mount, check for ref param and clear experience if needed
//  useEffect(() => {
//    const params = new URLSearchParams(pathname.search);
//    if (params.get('ref') === 'experience-complete') {
//      // Clear experienceId from localStorage directly
//      localStorage.removeItem('experienceId');
//    }
//    // Only run on mount or when pathname.search changes
//  }, [pathname.search]);
//
//  // Calculate metrics based on experiences
//  const experienceArr: any[] = React.useMemo(() => {
//    if (!experiencesRaw) return [];
//    if ((experiencesRaw as any).error || ((experiencesRaw as any).data && !Array.isArray((experiencesRaw as any).data))) {
//      return [];
//    }
//    if (Array.isArray(experiencesRaw)) return experiencesRaw;
//    if (Array.isArray((experiencesRaw as any).data)) return (experiencesRaw as any).data;
//    return [];
//  }, [experiencesRaw]);
//
//  const activeQrCount = experienceArr.filter((exp: any) => exp.qr_code_url).length;
//  const pendingQrCount = experienceArr.filter((exp: any) => !exp.qr_code_url).length;
//
//  const performanceMetrics: PerformanceMetric[] = [
//    {
//      id: 'totalBrand',
//      title: 'Total Scans',
//      value: '0',
//      change: '+5.5% MoM',
//      isPositive: true,
//      lastUpdated: '1 hour ago',
//      icon: Camera,
//    },
//    {
//      id: 'totalCampaigns',
//      title: 'Active QR Codes',
//      value: String(activeQrCount),
//      change: '-1.2% MoM',
//      isPositive: activeQrCount >= 0,
//      lastUpdated: '',
//      icon: Play,
//    },
//    {
//      id: 'newListings',
//      title: 'Pending QR Codes',
//      value: String(pendingQrCount),
//      change: '+2.1% MoM',
//      isPositive: pendingQrCount >= 0,
//      lastUpdated: '',
//      icon: Clock,
//    },
//  ];
//
//  // Map experiences to Product[] shape expected by ProductListings
//  const products: Product[] = React.useMemo(() => {
//    return experienceArr.map((exp: any) => {
//      // Get product data from the nested products object
//      const product = exp.products || {};
//      
//      return {
//        id: exp.id, // Use exp.id instead of exp.experience_id
//        image: product.product_image_url && product.product_image_url[0] 
//          ? product.product_image_url[0] 
//          : '/src/assets/images/demo6.png',
//        name: product.name || 'Untitled Product',
//        category: product.category || 'Uncategorized',
//        experience: product.name ? `${product.name} experience` : 'Untitled experience',
//        qrCodeStatus: exp.qr_code_url ? 'Generated' : 'Pending',
//        addedDate: exp.created_at ? new Date(exp.created_at).toISOString().slice(0, 10) : '',
//        // Attach full experience data for navigation
//        _fullExp: exp,
//      };
//    });
//  }, [experienceArr]);
//
//  // Navigation handler to experience edit page with prefill data
//  const router = useRouter();
//  const handleEditExperience = (exp: any) => {
//    // Store experience data in localStorage for the edit page to access
//    localStorage.setItem('experienceData', JSON.stringify(exp));
//    router.push(`/dashboard/experience/edit/${exp.id}?step=product-details`);
//  };
//
//  return (
//    <div className="min-h-screen mx-auto pb-32 bg-gray-50 sm:pb-32 sm:p-6 lg:p-8">
//      <ProductPerformanceOverview 
//        metrics={performanceMetrics} 
//        isLoading={isLoadingExperiences} 
//      />
//      <ProductListings
//        products={products}
//        onEditExperience={handleEditExperience}
//        isLoading={isLoadingExperiences}
//      />
//    </div>
//  );
//};
//
//export default ProductDashboard;

export default function ProductsPage() {
  return <div>Products Page</div>;
}