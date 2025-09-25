'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

export function useOptimizedRouter() {
  const router = useRouter();
  const { startNavigation, endNavigation } = useLoading();

  const navigateInstant = useCallback((path) => {
    // Start loading indicator
    startNavigation();
    
    // Use replace for better performance
    router.replace(path);
    
    // End loading after a short delay
    setTimeout(() => {
      endNavigation();
    }, 200);
  }, [router, startNavigation, endNavigation]);

  const prefetchRoute = useCallback((path) => {
    router.prefetch(path);
  }, [router]);

  return {
    navigateInstant,
    prefetchRoute,
    ...router
  };
}

export default useOptimizedRouter;
