import { useState, useCallback } from 'react';

export const useNavigationProgress = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setProgress(0);
  }, []);

  const updateProgress = useCallback((newProgress: number) => {
    setProgress(Math.min(100, Math.max(0, newProgress)));
  }, []);

  const finishLoading = useCallback(() => {
    setProgress(100);
    // Auto-hide after completion
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 300);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setProgress(0);
  }, []);

  return {
    isLoading,
    progress,
    startLoading,
    updateProgress,
    finishLoading,
    stopLoading,
  };
};
