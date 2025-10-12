'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const RoutePersistence = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Save current path on route change
  useEffect(() => {
    const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    try {
      localStorage.setItem('lastPath', fullPath);
    } catch (e) {
      // Ignore storage errors
      //console.warn('RoutePersistence: failed to save lastPath', e);
    }
  }, [pathname, searchParams]);

  // On first mount, restore last path if not already there
  useEffect(() => {
    const lastPath = localStorage.getItem('lastPath');
    const currentFull = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    if (lastPath && lastPath !== currentFull) {
      try {
        router.replace(lastPath);
      } catch (e) {
       // console.warn('RoutePersistence: failed to restore lastPath', e);
      }
    }
    // Only run on first mount
     
  }, []);

  return null;
};

export default RoutePersistence;