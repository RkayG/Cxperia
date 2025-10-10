'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useExperienceStore } from '@/store/brands/useExperienceStore';
import { getCurrentUserBrand } from '@/lib/data/brands';

interface BrandContextType {
  brand: any | null;
  brandId: string | null;
  isLoading: boolean;
  error: string | null;
  refetchBrand: () => Promise<void>;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

interface BrandProviderProps {
  children: React.ReactNode;
}

export function BrandProvider({ children }: BrandProviderProps) {
  const router = useRouter();
  const { brand, setBrand } = useExperienceStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRedirected, setHasRedirected] = useState(false);
  const hasAttemptedFetch = useRef(false);

  const brandId = brand?.id || null;

  const fetchBrand = async () => {
    if (hasAttemptedFetch.current) return;
    hasAttemptedFetch.current = true;
    
    //console.log('🔄 BrandProvider: Fetching brand data', { timestamp: new Date().toISOString() });
    
    setIsLoading(true);
    setError(null);
    
    try {
      const brandData = await getCurrentUserBrand();
      //console.log('📡 BrandProvider: Brand data fetched', { brandData });
      
      if (!brandData) {
        //console.log('❌ BrandProvider: No brand found, redirecting to login');
        // Check if we're already on the main domain, if not redirect to login on main domain
        if (!hasRedirected) {
          setHasRedirected(true);
          if (window.location.hostname.includes('app.')) {
            router.push('/auth/login');
          } else {
            router.push('/auth/login');
          }
        }
        return;
      }
      
      setBrand(brandData);
      //console.log('✅ BrandProvider: Brand set in store', { brandId: brandData.id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch brand';
      //console.error('❌ BrandProvider: Error fetching brand', { error: errorMessage });
      setError(errorMessage);
      // If there's an error fetching brand (likely due to auth issues), redirect to login
      if (!hasRedirected) {
        setHasRedirected(true);
        if (window.location.hostname.includes('app.')) {
          router.push('/auth/login');
        } else {
          router.push('/auth/login');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refetchBrand = async () => {
    await fetchBrand();
  };

  // Fetch brand if not available
  useEffect(() => {
    if (!brand && !hasRedirected) {
      //console.log('🔍 BrandProvider: Brand not available, fetching...', { hasBrand: !!brand, isLoading });
      fetchBrand();
    }
  }, [brand, hasRedirected]);

  const value: BrandContextType = {
    brand,
    brandId,
    isLoading,
    error,
    refetchBrand,
  };

  return (
    <BrandContext.Provider value={value}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}
