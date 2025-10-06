import { useEffect } from 'react';
import { useNavigationProgressContext } from '@/contexts/NavigationProgressContext';

export const useNavigationProgressWithQuery = (isLoading: boolean, isError?: boolean) => {
  const { startLoading, finishLoading, stopLoading } = useNavigationProgressContext();

  useEffect(() => {
    if (isLoading) {
      startLoading();
    } else if (isError) {
      stopLoading();
    } else {
      finishLoading();
    }
  }, [isLoading, isError, startLoading, finishLoading, stopLoading]);
};
